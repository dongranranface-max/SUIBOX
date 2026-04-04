import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Help Center – SUIBOX',
  description: 'Find answers to common questions about SUIBOX NFT platform.',
};

const topics = [
  {
    icon: '🎁',
    title: 'Mystery Boxes',
    desc: 'Learn how to purchase, open, and manage your mystery boxes.',
    href: '/support',
  },
  {
    icon: '🔨',
    title: 'Auctions',
    desc: 'Understand bidding rules, buy-now pricing, and auction timelines.',
    href: '/support',
  },
  {
    icon: '💎',
    title: 'NFT Trading',
    desc: 'How to list, buy, and transfer NFTs on the SUIBOX marketplace.',
    href: '/support',
  },
  {
    icon: '🏦',
    title: 'Staking & Yield',
    desc: 'Stake SBOX tokens and NFTs to earn platform rewards.',
    href: '/staking',
  },
  {
    icon: '👛',
    title: 'Wallet & Account',
    desc: 'Connect your SUI wallet, bind multiple wallets, and manage your account.',
    href: '/bind',
  },
  {
    icon: '🔒',
    title: 'Security',
    desc: 'Best practices to keep your account and assets safe.',
    href: '/security',
  },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
            Help Center
          </h1>
          <p className="text-gray-400 text-lg">
            Find answers and guides for everything SUIBOX.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {topics.map((topic) => (
            <Link
              key={topic.title}
              href={topic.href}
              className="flex items-start gap-4 p-5 bg-gray-900/60 border border-white/10 rounded-2xl hover:border-violet-500/30 hover:bg-white/5 transition-all group"
            >
              <span className="text-3xl">{topic.icon}</span>
              <div>
                <h2 className="font-bold text-white group-hover:text-violet-400 transition-colors mb-1">
                  {topic.title}
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed">{topic.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center bg-gray-900/40 border border-white/10 rounded-2xl p-8">
          <p className="text-gray-400 mb-4">Still need help? Visit our full support center.</p>
          <Link
            href="/support"
            className="inline-block px-6 py-3 bg-violet-600 hover:bg-violet-500 rounded-xl font-semibold transition-colors"
          >
            Go to Support Center
          </Link>
        </div>
      </div>
    </div>
  );
}
