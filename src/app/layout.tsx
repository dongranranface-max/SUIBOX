import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { I18nProvider } from "@/lib/i18n";
import Header from "@/components/Header";
import PageTransition from "@/components/PageTransition";

export const metadata: Metadata = {
  title: "SUIBOX - NFT Mystery Box + DeFi Staking | SUI Chain",
  description: "Discover rare NFTs through mystery boxes, craft fragments, stake for 15% APY, and participate in DAO governance on SUI blockchain.",
  keywords: "NFT, SUI, mystery box, DeFi, staking, blockchain, Web3, crypto, DAO",
  authors: [{ name: "SUIBOX Team" }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "SUIBOX - NFT Mystery Box + DeFi",
    description: "Discover rare NFTs through mystery boxes on SUI blockchain. Stake SBOX for 15% APY.",
    type: "website",
    url: "https://suibox.site",
    siteName: "SUIBOX",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "SUIBOX - NFT Mystery Box + DeFi",
    description: "Discover rare NFTs on SUI blockchain. Stake for 15% APY.",
  },
  alternates: {
    canonical: "https://suibox.site",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <I18nProvider>
          <Providers>
            <Header />
            <PageTransition>
              {children}
            </PageTransition>
          </Providers>
        </I18nProvider>
      </body>
    </html>
  );
}
