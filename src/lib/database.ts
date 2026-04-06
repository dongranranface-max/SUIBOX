/**
 * IMPORTANT – Serverless / Edge compatibility notice:
 * `better-sqlite3` is a native Node.js addon. NOT compatible with Vercel Edge Runtime.
 * All route files using this module must NOT set `export const runtime = 'edge'`.
 * For a fully serverless-compatible alternative, migrate to Neon / PlanetScale / Turso.
 */

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(process.cwd(), 'data', 'suibox.db');
let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (_db) return _db;
  const dataDir = path.dirname(dbPath);
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  _db = new Database(dbPath);
  _db.pragma('journal_mode = WAL');
  _db.pragma('foreign_keys = ON');
  initSchema(_db);

  // 进程退出时关闭数据库，确保 WAL 文件正确合并
  const closeDb = () => {
    if (_db && _db.open) {
      _db.close();
      _db = null;
    }
  };
  process.once('exit', closeDb);
  process.once('SIGINT', () => { closeDb(); process.exit(0); });
  process.once('SIGTERM', () => { closeDb(); process.exit(0); });

  return _db;
}

// ─────────────────────────────────────────────
// Schema initialisation
// ─────────────────────────────────────────────
function initSchema(db: Database.Database): void {
  db.exec(`
    -- ═══════════════════════════════════════
    -- 1. 用户表
    -- ═══════════════════════════════════════
    CREATE TABLE IF NOT EXISTS users (
      id               INTEGER PRIMARY KEY AUTOINCREMENT,
      sui_address      TEXT    UNIQUE NOT NULL,
      provider         TEXT,
      email            TEXT,
      name             TEXT,
      avatar           TEXT,
      invite_code      TEXT    UNIQUE,
      referrer_id      INTEGER REFERENCES users(id),
      referrer_address TEXT,
      status           TEXT    DEFAULT 'active',
      login_count      INTEGER DEFAULT 0,
      last_login       DATETIME,
      created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at       DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- ═══════════════════════════════════════
    -- 2. 用户资产（链上余额快照缓存）
    -- ═══════════════════════════════════════
    CREATE TABLE IF NOT EXISTS user_assets (
      id                  INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id             INTEGER NOT NULL REFERENCES users(id),
      sui_balance         REAL    DEFAULT 0,
      box_balance         REAL    DEFAULT 0,
      box_opens_remaining INTEGER DEFAULT 0,
      total_nfts          INTEGER DEFAULT 0,
      nft_categories      TEXT    DEFAULT '{}',
      airdrop_claimed     REAL    DEFAULT 0,
      airdrop_pending     REAL    DEFAULT 0,
      updated_at          DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- ═══════════════════════════════════════
    -- 3. 碎片库存（普通/稀有/史诗，按用户）
    -- ═══════════════════════════════════════
    CREATE TABLE IF NOT EXISTS fragments (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      user_address   TEXT    NOT NULL,
      fragment_type  TEXT    NOT NULL CHECK(fragment_type IN ('common','rare','epic')),
      quantity       INTEGER NOT NULL DEFAULT 0,
      updated_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_address, fragment_type)
    );

    -- ═══════════════════════════════════════
    -- 4. 盲盒每日开盒记录（午夜清零）
    -- ═══════════════════════════════════════
    CREATE TABLE IF NOT EXISTS daily_box_opens (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      user_address TEXT    NOT NULL,
      open_date    TEXT    NOT NULL,           -- YYYY-MM-DD (UTC)
      free_opens   INTEGER DEFAULT 0,
      paid_opens   INTEGER DEFAULT 0,
      UNIQUE(user_address, open_date)
    );

    -- ═══════════════════════════════════════
    -- 5. 保底计数器（感谢参与累计次数）
    -- ═══════════════════════════════════════
    CREATE TABLE IF NOT EXISTS consolation_counter (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      user_address TEXT    NOT NULL UNIQUE,
      count        INTEGER DEFAULT 0,          -- 当前累计感谢参与次数
      total_count  INTEGER DEFAULT 0,          -- 历史总次数（统计用）
      updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- ═══════════════════════════════════════
    -- 6. 盲盒开启历史记录
    -- ═══════════════════════════════════════
    CREATE TABLE IF NOT EXISTS box_open_history (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      user_address    TEXT    NOT NULL,
      channel         TEXT    NOT NULL CHECK(channel IN ('free','paid')),
      result          TEXT    NOT NULL CHECK(result IN ('common','rare','epic','nothing')),
      fragment_type   TEXT,                    -- NULL when result='nothing'
      box_cost        REAL    DEFAULT 0,       -- BOX consumed (paid channel)
      consolation_cnt INTEGER DEFAULT 0,       -- consolation count at time of open
      opened_at       DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- ═══════════════════════════════════════
    -- 7. NFT 库存（带星级）
    -- ═══════════════════════════════════════
    CREATE TABLE IF NOT EXISTS nft_inventory (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      token_id     TEXT    UNIQUE NOT NULL,
      name         TEXT    NOT NULL,
      nft_type     TEXT    NOT NULL CHECK(nft_type IN ('common','rare','epic','legendary')),
      star_level   INTEGER DEFAULT 0,          -- 0=未升级, Epic最高3, Legendary最高5
      owner_address TEXT   NOT NULL,
      is_staked    INTEGER DEFAULT 0,
      is_listed    INTEGER DEFAULT 0,
      price        REAL    DEFAULT 0,
      image_url    TEXT,
      created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- ═══════════════════════════════════════
    -- 8. NFT 升级记录（BOX销毁记录）
    -- ═══════════════════════════════════════
    CREATE TABLE IF NOT EXISTS nft_upgrades (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      token_id      TEXT    NOT NULL,
      user_address  TEXT    NOT NULL,
      from_star     INTEGER NOT NULL,
      to_star       INTEGER NOT NULL,
      box_burned    REAL    NOT NULL,          -- 本次升级消耗销毁的BOX
      upgraded_at   DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- ═══════════════════════════════════════
    -- 9. 合成历史（用于动态成本 + 里程碑）
    -- ═══════════════════════════════════════
    CREATE TABLE IF NOT EXISTS synthesis_history (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      user_address    TEXT    NOT NULL,
      synthesis_type  TEXT    NOT NULL,        -- 'fragment_to_nft' | 'nft_to_nft' | 'legendary'
      target_rarity   TEXT    NOT NULL,        -- 'common'|'rare'|'epic'|'legendary'
      fragments_used  TEXT,                    -- JSON array of {type, qty}
      nfts_used       TEXT,                    -- JSON array of token_ids
      box_burned      REAL    DEFAULT 0,
      box_reward      REAL    DEFAULT 0,
      result_token_id TEXT,
      synthesized_at  DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- ═══════════════════════════════════════
    -- 10. 合成全局计数（用于动态成本阶梯）
    -- ═══════════════════════════════════════
    CREATE TABLE IF NOT EXISTS synthesis_global_count (
      nft_type   TEXT    PRIMARY KEY,          -- 'rare'|'epic'|'legendary'
      total_minted INTEGER DEFAULT 0
    );
    INSERT OR IGNORE INTO synthesis_global_count(nft_type, total_minted) VALUES('rare',0);
    INSERT OR IGNORE INTO synthesis_global_count(nft_type, total_minted) VALUES('epic',0);
    INSERT OR IGNORE INTO synthesis_global_count(nft_type, total_minted) VALUES('legendary',0);

    -- ═══════════════════════════════════════
    -- 11. 邀请里程碑奖励记录
    -- ═══════════════════════════════════════
    CREATE TABLE IF NOT EXISTS invite_milestones (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      inviter_address TEXT    NOT NULL,
      invitee_address TEXT    NOT NULL,
      milestone       INTEGER NOT NULL,        -- 1 | 10 | 50 (好友第N次合成)
      inviter_reward  REAL    NOT NULL,        -- BOX奖励给邀请人
      referrer_reward REAL    DEFAULT 0,       -- BOX奖励给上级（如有）
      status          TEXT    DEFAULT 'pending',
      rewarded_at     DATETIME,
      UNIQUE(invitee_address, milestone)
    );

    -- ═══════════════════════════════════════
    -- 12. Staking 质押池定义（10个池）
    -- ═══════════════════════════════════════
    CREATE TABLE IF NOT EXISTS staking_pools (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      pool_key        TEXT    UNIQUE NOT NULL,  -- e.g. 'box_token', 'sui_token', 'common_nft'…
      name            TEXT    NOT NULL,
      total_budget    REAL    NOT NULL,         -- 总BOX预算
      daily_release   REAL    NOT NULL,         -- 每日释放量
      base_power      REAL    NOT NULL,         -- 基础算力倍数
      lock_days       INTEGER DEFAULT 30,       -- 锁定天数
      open_at         DATETIME,                 -- 开放时间
      status          TEXT    DEFAULT 'pending' -- pending|active|ended
    );

    -- 预填10个质押池
    INSERT OR IGNORE INTO staking_pools VALUES
      (1,'box_token',    'BOX代币质押池',  6500000, 5937, 1,  0,  datetime('now'), 'active'),
      (2,'sui_token',    'SUI代币质押池',  2000000, 1826, 1,  30, datetime('now'), 'active'),
      (3,'common_nft',   '普通NFT质押池',  1500000, 1370, 1,  30, datetime('now'), 'active'),
      (4,'rare_nft',     '稀有NFT质押池',  4500000, 4110, 3,  30, datetime('now'), 'active'),
      (5,'epic_nft',     '史诗NFT质押池',  5500000, 5023, 8,  30, datetime('now','+90 days'), 'pending'),
      (6,'legendary_nft','传奇NFT质押池',  6500000, 5937, 20, 30, datetime('now','+90 days'), 'pending'),
      (7,'rare_epic',    '稀有+史诗质押池',3000000, 2740, 12, 30, datetime('now','+180 days'),'pending'),
      (8,'rare_legendary','稀有+传奇质押池',3000000,2740, 28, 30, datetime('now','+180 days'),'pending'),
      (9,'epic_legendary','史诗+传奇质押池',4000000,3653, 23, 30, datetime('now','+180 days'),'pending'),
      (10,'all_plus',    '万物皆可质押池', 3500000, 3196, 1,  30, datetime('now','+180 days'),'pending');

    -- ═══════════════════════════════════════
    -- 13. Staking 用户质押仓位
    -- ═══════════════════════════════════════
    CREATE TABLE IF NOT EXISTS staking_positions (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      pool_key        TEXT    NOT NULL REFERENCES staking_pools(pool_key),
      user_address    TEXT    NOT NULL,
      asset_type      TEXT    NOT NULL,         -- 'box'|'sui'|'nft'
      asset_id        TEXT,                     -- token_id for NFT, NULL for tokens
      amount          REAL    DEFAULT 0,        -- token amount (for token pools)
      lock_days       INTEGER NOT NULL,
      power_multiplier REAL   NOT NULL,         -- veBOX multiplier applied
      staked_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
      unlocks_at      DATETIME NOT NULL,
      last_claimed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      rewards_claimed REAL    DEFAULT 0,
      status          TEXT    DEFAULT 'active'  -- active|unlocked|force_unstaked
    );

    -- ═══════════════════════════════════════
    -- 14. NFT 市场挂单
    -- ═══════════════════════════════════════
    CREATE TABLE IF NOT EXISTS market_listings (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      token_id        TEXT    NOT NULL UNIQUE,
      seller_address  TEXT    NOT NULL,
      price           REAL    NOT NULL,
      price_unit      TEXT    DEFAULT 'SUI',    -- 'SUI'|'BOX'
      listed_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
      sold_at         DATETIME,
      buyer_address   TEXT,
      status          TEXT    DEFAULT 'active'  -- active|sold|cancelled
    );

    -- ═══════════════════════════════════════
    -- 15. 全局 Offer 池（巨鲸收购单）
    -- ═══════════════════════════════════════
    CREATE TABLE IF NOT EXISTS offers (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      buyer_address   TEXT    NOT NULL,
      nft_type        TEXT    NOT NULL,         -- 'common'|'rare'|'epic'|'legendary'
      offer_price     REAL    NOT NULL,
      price_unit      TEXT    DEFAULT 'SUI',
      max_quantity    INTEGER DEFAULT 1,
      filled_quantity INTEGER DEFAULT 0,
      deposited_amount REAL   NOT NULL,         -- 锁定的资金
      expires_at      DATETIME,
      created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
      status          TEXT    DEFAULT 'open'    -- open|filled|cancelled|expired
    );

    -- ═══════════════════════════════════════
    -- 16. 拍卖记录
    -- ═══════════════════════════════════════
    CREATE TABLE IF NOT EXISTS auctions (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      token_id        TEXT    NOT NULL,
      seller_address  TEXT    NOT NULL,
      start_price     REAL    NOT NULL,
      current_price   REAL    NOT NULL,
      buy_now_price   REAL,
      current_bidder  TEXT,
      bid_count       INTEGER DEFAULT 0,
      starts_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
      ends_at         DATETIME NOT NULL,
      status          TEXT    DEFAULT 'active'  -- active|ended|cancelled
    );

    CREATE TABLE IF NOT EXISTS auction_bids (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      auction_id      INTEGER NOT NULL REFERENCES auctions(id),
      bidder_address  TEXT    NOT NULL,
      bid_amount      REAL    NOT NULL,
      increment_amount REAL   DEFAULT 0,        -- 本次增量
      earn_reward     REAL    DEFAULT 0,        -- 30%增量奖励（给被超越方）
      bid_at          DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- ═══════════════════════════════════════
    -- 17. BOX 代币销毁记录（Burn Hole）
    -- ═══════════════════════════════════════
    CREATE TABLE IF NOT EXISTS token_burns (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      user_address    TEXT    NOT NULL,
      amount          REAL    NOT NULL,
      reason          TEXT    NOT NULL,         -- 'upgrade'|'synthesis'|'paid_box'|'tx_fee'
      reference_id    TEXT,                     -- token_id / synthesis_history.id / etc.
      burned_at       DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- ═══════════════════════════════════════
    -- 18. Real Yield 金库仓位
    -- ═══════════════════════════════════════
    CREATE TABLE IF NOT EXISTS treasury_positions (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      protocol        TEXT    NOT NULL,         -- 'navi'|'scallop'|'vSUI'|'haSUI'
      allocation_pct  REAL    NOT NULL,         -- 40/30/15/15
      principal_sui   REAL    DEFAULT 0,
      yield_earned    REAL    DEFAULT 0,
      last_updated    DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    INSERT OR IGNORE INTO treasury_positions(protocol, allocation_pct) VALUES
      ('navi',   40),
      ('scallop',30),
      ('vSUI',   15),
      ('haSUI',  15);

    -- ═══════════════════════════════════════
    -- 19. DAO 提案
    -- ═══════════════════════════════════════
    CREATE TABLE IF NOT EXISTS dao_proposals (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      proposer        TEXT    NOT NULL,
      title           TEXT    NOT NULL,
      description     TEXT    NOT NULL,
      category        TEXT    DEFAULT 'general', -- 'general'|'emergency'
      snapshot_block  TEXT,
      deposit_box     REAL    DEFAULT 500,       -- 500 BOX 保证金
      votes_for       INTEGER DEFAULT 0,
      votes_against   INTEGER DEFAULT 0,
      quorum_required INTEGER DEFAULT 10,
      status          TEXT    DEFAULT 'discussion', -- discussion|voting|passed|rejected|executed
      discussion_ends DATETIME,
      voting_ends     DATETIME,
      created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS dao_votes (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      proposal_id     INTEGER NOT NULL REFERENCES dao_proposals(id),
      voter_address   TEXT    NOT NULL,
      vote            TEXT    NOT NULL CHECK(vote IN ('for','against')),
      weight          INTEGER NOT NULL,          -- 史诗=1, 传奇=5 (每枚NFT)
      voted_at        DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(proposal_id, voter_address)
    );

    -- ═══════════════════════════════════════
    -- 20. Alpha Terminal 订阅
    -- ═══════════════════════════════════════
    CREATE TABLE IF NOT EXISTS subscriptions (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      user_address    TEXT    NOT NULL,
      tier            TEXT    NOT NULL CHECK(tier IN ('free','pro','elite')),
      box_per_month   REAL    DEFAULT 0,         -- 99 or 199
      starts_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at      DATETIME,
      auto_renew      INTEGER DEFAULT 1,
      status          TEXT    DEFAULT 'active'
    );

    -- ═══════════════════════════════════════
    -- 21. NFT 交易记录
    -- ═══════════════════════════════════════
    CREATE TABLE IF NOT EXISTS nft_transactions (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      token_id        TEXT    NOT NULL,
      from_address    TEXT    NOT NULL,
      to_address      TEXT    NOT NULL,
      price           REAL    NOT NULL,
      price_unit      TEXT    DEFAULT 'SUI',
      fee_total       REAL    DEFAULT 0,
      fee_legendary   REAL    DEFAULT 0,        -- 1% → 五星传奇持有者
      fee_platform    REAL    DEFAULT 0,        -- 2% → 平台
      fee_burn        REAL    DEFAULT 0,        -- 2% → 销毁
      tx_type         TEXT    DEFAULT 'market', -- 'market'|'auction'|'offer'
      tx_at           DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- ═══════════════════════════════════════
    -- 22. 基础交易记录（兼容旧API）
    -- ═══════════════════════════════════════
    CREATE TABLE IF NOT EXISTS transactions (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      tx_hash      TEXT    UNIQUE NOT NULL,
      from_address TEXT,
      to_address   TEXT,
      token_id     TEXT,
      amount       REAL,
      type         TEXT    NOT NULL,
      status       TEXT    DEFAULT 'pending',
      created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- ═══════════════════════════════════════
    -- 索引（查询热路径）
    -- ═══════════════════════════════════════
    CREATE INDEX IF NOT EXISTS idx_users_address          ON users(sui_address);
    CREATE INDEX IF NOT EXISTS idx_users_invite_code      ON users(invite_code);
    CREATE INDEX IF NOT EXISTS idx_users_referrer         ON users(referrer_id);
    CREATE INDEX IF NOT EXISTS idx_fragments_user         ON fragments(user_address);
    CREATE INDEX IF NOT EXISTS idx_daily_opens_user_date  ON daily_box_opens(user_address, open_date);
    CREATE INDEX IF NOT EXISTS idx_consolation_user       ON consolation_counter(user_address);
    CREATE INDEX IF NOT EXISTS idx_box_history_user       ON box_open_history(user_address);
    CREATE INDEX IF NOT EXISTS idx_nft_inventory_owner    ON nft_inventory(owner_address);
    CREATE INDEX IF NOT EXISTS idx_nft_inventory_type     ON nft_inventory(nft_type);
    CREATE INDEX IF NOT EXISTS idx_synthesis_user         ON synthesis_history(user_address);
    CREATE INDEX IF NOT EXISTS idx_synthesis_target       ON synthesis_history(target_rarity);
    CREATE INDEX IF NOT EXISTS idx_invite_milestones      ON invite_milestones(invitee_address);
    CREATE INDEX IF NOT EXISTS idx_invite_milestones_inv  ON invite_milestones(inviter_address);
    CREATE INDEX IF NOT EXISTS idx_staking_pos_user       ON staking_positions(user_address);
    CREATE INDEX IF NOT EXISTS idx_staking_pos_pool       ON staking_positions(pool_key);
    CREATE INDEX IF NOT EXISTS idx_listings_status        ON market_listings(status);
    CREATE INDEX IF NOT EXISTS idx_offers_type            ON offers(nft_type, status);
    CREATE INDEX IF NOT EXISTS idx_auctions_status        ON auctions(status);
    CREATE INDEX IF NOT EXISTS idx_burns_user             ON token_burns(user_address);
    CREATE INDEX IF NOT EXISTS idx_burns_at               ON token_burns(burned_at);
    CREATE INDEX IF NOT EXISTS idx_nft_tx_token           ON nft_transactions(token_id);
    CREATE INDEX IF NOT EXISTS idx_nft_tx_from            ON nft_transactions(from_address);
    CREATE INDEX IF NOT EXISTS idx_dao_proposals_status   ON dao_proposals(status);
    CREATE INDEX IF NOT EXISTS idx_dao_votes_proposal     ON dao_votes(proposal_id);
  `);
}

// ─────────────────────────────────────────────
// Lazy-initialised singleton (Proxy for backward-compat)
// ─────────────────────────────────────────────
export const db = new Proxy({} as Database.Database, {
  get(_, prop) {
    return getDb()[prop as keyof Database.Database];
  },
});

// ─────────────────────────────────────────────
// User helpers
// ─────────────────────────────────────────────
export function createUser(data: {
  sui_address: string; provider?: string; email?: string; name?: string; avatar?: string;
}) {
  return getDb().prepare(`
    INSERT INTO users (sui_address, provider, email, name, avatar)
    VALUES (@sui_address, @provider, @email, @name, @avatar)
    ON CONFLICT(sui_address) DO UPDATE SET
      email = @email, name = @name, avatar = @avatar, updated_at = CURRENT_TIMESTAMP
  `).run(data);
}

export function getUserByAddress(address: string) {
  return getDb().prepare('SELECT * FROM users WHERE sui_address = ?').get(address);
}

// ─────────────────────────────────────────────
// Fragment helpers
// ─────────────────────────────────────────────
export function getFragments(address: string) {
  return getDb().prepare(
    'SELECT fragment_type, quantity FROM fragments WHERE user_address = ?'
  ).all(address) as { fragment_type: string; quantity: number }[];
}

export function addFragment(address: string, type: 'common' | 'rare' | 'epic', qty: number) {
  return getDb().prepare(`
    INSERT INTO fragments (user_address, fragment_type, quantity)
    VALUES (?, ?, ?)
    ON CONFLICT(user_address, fragment_type) DO UPDATE SET
      quantity = quantity + ?, updated_at = CURRENT_TIMESTAMP
  `).run(address, type, qty, qty);
}

export function consumeFragments(address: string, type: 'common' | 'rare' | 'epic', qty: number): boolean {
  const row = getDb().prepare(
    'SELECT quantity FROM fragments WHERE user_address = ? AND fragment_type = ?'
  ).get(address, type) as { quantity: number } | undefined;
  if (!row || row.quantity < qty) return false;
  getDb().prepare(
    'UPDATE fragments SET quantity = quantity - ?, updated_at = CURRENT_TIMESTAMP WHERE user_address = ? AND fragment_type = ?'
  ).run(qty, address, type);
  return true;
}

// ─────────────────────────────────────────────
// Consolation counter helpers
// ─────────────────────────────────────────────
export function getConsolationCount(address: string): number {
  const row = getDb().prepare(
    'SELECT count FROM consolation_counter WHERE user_address = ?'
  ).get(address) as { count: number } | undefined;
  return row?.count ?? 0;
}

export function incrementConsolation(address: string): number {
  getDb().prepare(`
    INSERT INTO consolation_counter (user_address, count, total_count)
    VALUES (?, 1, 1)
    ON CONFLICT(user_address) DO UPDATE SET
      count = count + 1, total_count = total_count + 1, updated_at = CURRENT_TIMESTAMP
  `).run(address);
  return getConsolationCount(address);
}

export function resetConsolation(address: string) {
  getDb().prepare(
    `UPDATE consolation_counter SET count = 0, updated_at = CURRENT_TIMESTAMP WHERE user_address = ?`
  ).run(address);
}

// ─────────────────────────────────────────────
// Daily box open helpers
// ─────────────────────────────────────────────
export function getTodayOpens(address: string): { free_opens: number; paid_opens: number } {
  const today = new Date().toISOString().slice(0, 10);
  const row = getDb().prepare(
    'SELECT free_opens, paid_opens FROM daily_box_opens WHERE user_address = ? AND open_date = ?'
  ).get(address, today) as { free_opens: number; paid_opens: number } | undefined;
  return row ?? { free_opens: 0, paid_opens: 0 };
}

export function recordBoxOpen(address: string, channel: 'free' | 'paid') {
  const today = new Date().toISOString().slice(0, 10);
  const col = channel === 'free' ? 'free_opens' : 'paid_opens';
  getDb().prepare(`
    INSERT INTO daily_box_opens (user_address, open_date, ${col})
    VALUES (?, ?, 1)
    ON CONFLICT(user_address, open_date) DO UPDATE SET ${col} = ${col} + 1
  `).run(address, today);
}

// ─────────────────────────────────────────────
// Synthesis global count helpers
// ─────────────────────────────────────────────
export function getSynthesisCount(nftType: string): number {
  const row = getDb().prepare(
    'SELECT total_minted FROM synthesis_global_count WHERE nft_type = ?'
  ).get(nftType) as { total_minted: number } | undefined;
  return row?.total_minted ?? 0;
}

export function incrementSynthesisCount(nftType: string) {
  getDb().prepare(
    'UPDATE synthesis_global_count SET total_minted = total_minted + 1 WHERE nft_type = ?'
  ).run(nftType);
}

/**
 * Dynamic fragment cost for rare NFT based on total minted.
 * Steps: 0-10k→8, 10k-30k→12, 30k-60k→16, 60k-100k→20, 100k+→24
 */
export function getRareFragmentCost(): number {
  const minted = getSynthesisCount('rare');
  if (minted < 10000)  return 8;
  if (minted < 30000)  return 12;
  if (minted < 60000)  return 16;
  if (minted < 100000) return 20;
  return 24;
}

/**
 * Dynamic fragment cost for epic NFT based on total minted.
 * Steps: 0-5k→10, 5k-15k→15, 15k-30k→20, 30k-50k→25, 50k+→30
 */
export function getEpicFragmentCost(): number {
  const minted = getSynthesisCount('epic');
  if (minted < 5000)  return 10;
  if (minted < 15000) return 15;
  if (minted < 30000) return 20;
  if (minted < 50000) return 25;
  return 30;
}

// ─────────────────────────────────────────────
// NFT inventory helpers
// ─────────────────────────────────────────────
export function getUserNFTs(address: string) {
  return getDb().prepare(
    'SELECT * FROM nft_inventory WHERE owner_address = ? ORDER BY created_at DESC'
  ).all(address);
}

export function createNFTInventory(data: {
  token_id: string; name: string; nft_type: string;
  owner_address: string; image_url?: string;
}) {
  return getDb().prepare(`
    INSERT OR IGNORE INTO nft_inventory (token_id, name, nft_type, owner_address, image_url)
    VALUES (@token_id, @name, @nft_type, @owner_address, @image_url)
  `).run(data);
}

export function upgradeNFTStar(tokenId: string, ownerAddress: string): {
  ok: boolean; newStar?: number; error?: string;
} {
  const nft = getDb().prepare(
    'SELECT nft_type, star_level FROM nft_inventory WHERE token_id = ? AND owner_address = ?'
  ).get(tokenId, ownerAddress) as { nft_type: string; star_level: number } | undefined;

  if (!nft) return { ok: false, error: 'NFT不存在或不属于该用户' };
  const maxStar = nft.nft_type === 'legendary' ? 5 : nft.nft_type === 'epic' ? 3 : 0;
  if (maxStar === 0) return { ok: false, error: '该NFT不支持升级' };
  if (nft.star_level >= maxStar) return { ok: false, error: '已达最高星级' };

  const newStar = nft.star_level + 1;
  getDb().prepare(
    'UPDATE nft_inventory SET star_level = ?, updated_at = CURRENT_TIMESTAMP WHERE token_id = ?'
  ).run(newStar, tokenId);
  return { ok: true, newStar };
}

// ─────────────────────────────────────────────
// Token burn helpers
// ─────────────────────────────────────────────
export function recordBurn(data: {
  user_address: string; amount: number;
  reason: 'upgrade' | 'synthesis' | 'paid_box' | 'tx_fee'; reference_id?: string;
}) {
  return getDb().prepare(`
    INSERT INTO token_burns (user_address, amount, reason, reference_id)
    VALUES (@user_address, @amount, @reason, @reference_id)
  `).run(data);
}

export function getRecentBurns(limit = 20) {
  return getDb().prepare(`
    SELECT user_address, amount, reason, reference_id, burned_at
    FROM token_burns ORDER BY burned_at DESC LIMIT ?
  `).all(limit);
}

export function getTotalBurned(): number {
  const row = getDb().prepare('SELECT COALESCE(SUM(amount),0) as total FROM token_burns').get() as { total: number };
  return row.total;
}

// ─────────────────────────────────────────────
// Synthesis history helpers
// ─────────────────────────────────────────────
export function recordSynthesis(data: {
  user_address: string; synthesis_type: string; target_rarity: string;
  fragments_used?: string; nfts_used?: string;
  box_burned?: number; box_reward?: number; result_token_id?: string;
}) {
  return getDb().prepare(`
    INSERT INTO synthesis_history
      (user_address, synthesis_type, target_rarity, fragments_used, nfts_used, box_burned, box_reward, result_token_id)
    VALUES (@user_address, @synthesis_type, @target_rarity, @fragments_used, @nfts_used, @box_burned, @box_reward, @result_token_id)
  `).run(data);
}

/** Count how many times an invitee has synthesised (to check milestones). */
export function getSynthesisCountForUser(userAddress: string): number {
  const row = getDb().prepare(
    'SELECT COUNT(*) as cnt FROM synthesis_history WHERE user_address = ?'
  ).get(userAddress) as { cnt: number };
  return row.cnt;
}

// ─────────────────────────────────────────────
// Invite milestone helpers
// ─────────────────────────────────────────────
export function checkAndGrantMilestone(
  inviterAddress: string, inviteeAddress: string, newSynthesisCount: number
): { granted: boolean; milestone?: number; inviterReward?: number } {
  const milestones = [
    { count: 1,  inviterReward: 1,  referrerReward: 0.5 },
    { count: 10, inviterReward: 3,  referrerReward: 1.5 },
    { count: 50, inviterReward: 18, referrerReward: 9   },
  ];

  for (const m of milestones) {
    if (newSynthesisCount === m.count) {
      const existing = getDb().prepare(
        'SELECT id FROM invite_milestones WHERE invitee_address = ? AND milestone = ?'
      ).get(inviteeAddress, m.count);
      if (!existing) {
        getDb().prepare(`
          INSERT INTO invite_milestones (inviter_address, invitee_address, milestone, inviter_reward, referrer_reward, status, rewarded_at)
          VALUES (?, ?, ?, ?, ?, 'granted', CURRENT_TIMESTAMP)
        `).run(inviterAddress, inviteeAddress, m.count, m.inviterReward, m.referrerReward);
        return { granted: true, milestone: m.count, inviterReward: m.inviterReward };
      }
    }
  }
  return { granted: false };
}

// ─────────────────────────────────────────────
// Treasury helpers
// ─────────────────────────────────────────────
export function getTreasuryPositions() {
  return getDb().prepare('SELECT * FROM treasury_positions').all();
}

export function addTreasuryDeposit(suiAmount: number) {
  // Distribute: Navi 40%, Scallop 30%, vSUI 15%, haSUI 15%
  const splits: { protocol: string; pct: number }[] = [
    { protocol: 'navi',   pct: 40 },
    { protocol: 'scallop', pct: 30 },
    { protocol: 'vSUI',   pct: 15 },
    { protocol: 'haSUI',  pct: 15 },
  ];
  const stmt = getDb().prepare(
    'UPDATE treasury_positions SET principal_sui = principal_sui + ?, last_updated = CURRENT_TIMESTAMP WHERE protocol = ?'
  );
  for (const s of splits) {
    stmt.run((suiAmount * s.pct) / 100, s.protocol);
  }
}

// ─────────────────────────────────────────────
// Legacy NFT helpers (compat)
// ─────────────────────────────────────────────
export function createNFT(data: {
  token_id: string; name: string; description?: string; image_url?: string;
  owner_address: string; price?: number; rarity?: string; category?: string;
}) {
  return getDb().prepare(`
    INSERT INTO nft_inventory (token_id, name, nft_type, owner_address, image_url, price)
    VALUES (@token_id, @name, @rarity, @owner_address, @image_url, @price)
    ON CONFLICT(token_id) DO NOTHING
  `).run({ ...data, rarity: data.rarity ?? 'common' });
}

export function getNFTs(filters?: {
  owner?: string; status?: string; category?: string; limit?: number; offset?: number;
}) {
  let sql = 'SELECT * FROM nft_inventory WHERE 1=1';
  const params: Record<string, unknown> = {};
  if (filters?.owner) { sql += ' AND owner_address = @owner'; params.owner = filters.owner; }
  sql += ' ORDER BY created_at DESC';
  if (filters?.limit) {
    sql += ' LIMIT @limit'; params.limit = filters.limit;
    if (filters.offset) { sql += ' OFFSET @offset'; params.offset = filters.offset; }
  }
  return getDb().prepare(sql).all(params);
}

// ─────────────────────────────────────────────
// Legacy staking helpers (compat)
// ─────────────────────────────────────────────
export function createStake(data: {
  user_address: string; amount: number; pool_type?: string; lock_days?: number;
}) {
  const lockDays = data.lock_days ?? 30;
  const unlocks = new Date(Date.now() + lockDays * 86400_000).toISOString();
  return getDb().prepare(`
    INSERT INTO staking_positions (pool_key, user_address, asset_type, amount, lock_days, power_multiplier, unlocks_at)
    VALUES (@pool_key, @user_address, 'box', @amount, @lock_days, 1.0, @unlocks_at)
  `).run({ pool_key: data.pool_type ?? 'box_token', user_address: data.user_address, amount: data.amount, lock_days: lockDays, unlocks_at: unlocks });
}

export function getStakesByUser(address: string) {
  return getDb().prepare(
    'SELECT * FROM staking_positions WHERE user_address = ? ORDER BY staked_at DESC'
  ).all(address);
}

// ─────────────────────────────────────────────
// Legacy transaction helpers (compat)
// ─────────────────────────────────────────────
export function createTransaction(data: {
  tx_hash: string; from_address?: string; to_address?: string;
  token_id?: string; amount?: number; type: string;
}) {
  return getDb().prepare(`
    INSERT INTO transactions (tx_hash, from_address, to_address, token_id, amount, type)
    VALUES (@tx_hash, @from_address, @to_address, @token_id, @amount, @type)
  `).run(data);
}

export function getTransactionsByUser(address: string) {
  return getDb().prepare(`
    SELECT * FROM transactions WHERE from_address = ? OR to_address = ?
    ORDER BY created_at DESC LIMIT 100
  `).all(address, address);
}

// ─────────────────────────────────────────────
// Boxes (legacy compat)
// ─────────────────────────────────────────────
export function getBoxes() {
  return [] as unknown[];  // boxes are now handled via box_open_history
}
