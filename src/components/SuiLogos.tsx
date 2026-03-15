import Image from 'next/image';

interface SuiEcosystemLogos {
  cetus: string;
  suiet: string;
  scallop: string;
  turbos: string;
  sui: string;
}

// SUI生态项目Logo
export const suiLogos: SuiEcosystemLogos = {
  cetus: 'https://app.cetus.zone/favicon.ico',
  suiet: 'https://assets.suiet.app/logo.png',
  scallop: 'https://www.scallop.io/images/logo.png',
  turbos: '/turbos-logo.png',
  sui: '/sui-logo.png',
};

export const suiEcosystem = [
  { name: 'SUIet', type: '钱包', logo: suiLogos.suiet, url: 'https://suiet.app' },
  { name: 'Cetus', type: 'DEX', logo: suiLogos.cetus, url: 'https://app.cetus.zone/swap' },
  { name: 'Scallop', type: '借贷', logo: suiLogos.scallop, url: 'https://www.scallop.io' },
  { name: 'Turbos', type: 'DEX', logo: suiLogos.turbos, url: 'https://turbos.finance' },
];

// Logo组件
export function SuiLogo({ name, size = 32 }: { name: keyof SuiEcosystemLogos; size?: number }) {
  return (
    <Image 
      src={suiLogos[name]} 
      alt={name} 
      width={size} 
      height={size}
      className="rounded-full"
    />
  );
}
