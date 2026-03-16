// SUI 网络配置
export const SUI_CONFIG = {
  devnet: {
    packageId: '0x1d3f4739d0fbc863cabcf08986d462a00ccfb1a031e3c99d65257304308ebdc7',
    network: 'https://fullnode.devnet.sui.io',
    faucet: 'https://faucet.devnet.sui.io',
  },
  testnet: {
    packageId: '',
    network: 'https://fullnode.testnet.sui.io',
    faucet: 'https://faucet.testnet.sui.io',
  },
  mainnet: {
    packageId: '',
    network: 'https://fullnode.mainnet.sui.io',
  },
};

export const MODULE_NAME = 'box';

// 开盲盒函数
export const BOX_FUNCTIONS = {
  openCommonBox: 'open_common_box',
  openRareBox: 'open_rare_box',
  openEpicBox: 'open_epic_box',
};

// 稀有度映射
export const RARITY_MAP = {
  1: { name: 'Common', label: '普通', color: 'blue' },
  2: { name: 'Rare', label: '稀有', color: 'purple' },
  3: { name: 'Epic', label: '史诗', color: 'amber' },
};

export const FRAGMENT_TYPE = '0x1d3f4739d0fbc863cabcf08986d462a00ccfb1a031e3c99d65257304308ebdc7::box::Fragment';
