import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'suibox.db');

// 确保数据目录存在
import fs from 'fs';
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);

// 初始化数据库表
db.exec(`
  -- 用户表
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sui_address TEXT UNIQUE NOT NULL,
    provider TEXT,
    email TEXT,
    name TEXT,
    avatar TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- NFT 表
  CREATE TABLE IF NOT EXISTS nfts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    token_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    owner_address TEXT NOT NULL,
    price REAL,
    status TEXT DEFAULT 'active',
    rarity TEXT DEFAULT 'common',
    category TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- 盲盒表
  CREATE TABLE IF NOT EXISTS boxes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    box_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    price REAL NOT NULL,
    total_supply INTEGER DEFAULT 100,
    sold_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active',
    rarity_config TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- 质押表
  CREATE TABLE IF NOT EXISTS stakes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_address TEXT NOT NULL,
    amount REAL NOT NULL,
    pool_type TEXT DEFAULT 'sbox',
    start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    end_time DATETIME,
    rewards_claimed REAL DEFAULT 0,
    status TEXT DEFAULT 'active'
  );

  -- 交易记录表
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tx_hash TEXT UNIQUE NOT NULL,
    from_address TEXT,
    to_address TEXT,
    token_id TEXT,
    amount REAL,
    type TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- 索引
  CREATE INDEX IF NOT EXISTS idx_users_address ON users(sui_address);
  CREATE INDEX IF NOT EXISTS idx_nfts_owner ON nfts(owner_address);
  CREATE INDEX IF NOT EXISTS idx_nfts_status ON nfts(status);
  CREATE INDEX IF NOT EXISTS idx_stakes_user ON stakes(user_address);
  CREATE INDEX IF NOT EXISTS idx_transactions_hash ON transactions(tx_hash);
`);

export { db };

// 用户操作
export function createUser(data: {
  sui_address: string;
  provider?: string;
  email?: string;
  name?: string;
  avatar?: string;
}) {
  const stmt = db.prepare(`
    INSERT INTO users (sui_address, provider, email, name, avatar)
    VALUES (@sui_address, @provider, @email, @name, @avatar)
    ON CONFLICT(sui_address) DO UPDATE SET
      email = @email,
      name = @name,
      avatar = @avatar,
      updated_at = CURRENT_TIMESTAMP
  `);
  return stmt.run(data);
}

export function getUserByAddress(address: string) {
  const stmt = db.prepare('SELECT * FROM users WHERE sui_address = ?');
  return stmt.get(address);
}

// NFT 操作
export function createNFT(data: {
  token_id: string;
  name: string;
  description?: string;
  image_url?: string;
  owner_address: string;
  price?: number;
  rarity?: string;
  category?: string;
}) {
  const stmt = db.prepare(`
    INSERT INTO nfts (token_id, name, description, image_url, owner_address, price, rarity, category)
    VALUES (@token_id, @name, @description, @image_url, @owner_address, @price, @rarity, @category)
  `);
  return stmt.run(data);
}

export function getNFTs(filters?: {
  owner?: string;
  status?: string;
  category?: string;
  limit?: number;
  offset?: number;
}) {
  let sql = 'SELECT * FROM nfts WHERE 1=1';
  const params: any = {};
  
  if (filters?.owner) {
    sql += ' AND owner_address = @owner';
    params.owner = filters.owner;
  }
  if (filters?.status) {
    sql += ' AND status = @status';
    params.status = filters.status;
  }
  if (filters?.category) {
    sql += ' AND category = @category';
    params.category = filters.category;
  }
  
  sql += ' ORDER BY created_at DESC';
  
  if (filters?.limit) {
    sql += ' LIMIT @limit';
    params.limit = filters.limit;
    if (filters?.offset) {
      sql += ' OFFSET @offset';
      params.offset = filters.offset;
    }
  }
  
  const stmt = db.prepare(sql);
  return stmt.all(params);
}

// 盲盒操作
export function createBox(data: {
  box_id: string;
  name: string;
  description?: string;
  image_url?: string;
  price: number;
  total_supply?: number;
  rarity_config?: string;
}) {
  const stmt = db.prepare(`
    INSERT INTO boxes (box_id, name, description, image_url, price, total_supply, rarity_config)
    VALUES (@box_id, @name, @description, @image_url, @price, @total_supply, @rarity_config)
  `);
  return stmt.run(data);
}

export function getBoxes() {
  const stmt = db.prepare('SELECT * FROM boxes WHERE status = ? ORDER BY created_at DESC');
  return stmt.all('active');
}

// 质押操作
export function createStake(data: {
  user_address: string;
  amount: number;
  pool_type?: string;
  lock_days?: number;
}) {
  const endTime = data.lock_days 
    ? new Date(Date.now() + data.lock_days * 24 * 60 * 60 * 1000).toISOString()
    : null;
    
  const stmt = db.prepare(`
    INSERT INTO stakes (user_address, amount, pool_type, end_time)
    VALUES (@user_address, @amount, @pool_type, @endTime)
  `);
  return stmt.run({
    user_address: data.user_address,
    amount: data.amount,
    pool_type: data.pool_type || 'sbox',
    endTime
  });
}

export function getStakesByUser(address: string) {
  const stmt = db.prepare('SELECT * FROM stakes WHERE user_address = ? ORDER BY start_time DESC');
  return stmt.all(address);
}

// 交易记录
export function createTransaction(data: {
  tx_hash: string;
  from_address?: string;
  to_address?: string;
  token_id?: string;
  amount?: number;
  type: string;
}) {
  const stmt = db.prepare(`
    INSERT INTO transactions (tx_hash, from_address, to_address, token_id, amount, type)
    VALUES (@tx_hash, @from_address, @to_address, @token_id, @amount, @type)
  `);
  return stmt.run(data);
}

export function getTransactionsByUser(address: string) {
  const stmt = db.prepare(`
    SELECT * FROM transactions 
    WHERE from_address = ? OR to_address = ?
    ORDER BY created_at DESC
    LIMIT 100
  `);
  return stmt.all(address, address);
}
