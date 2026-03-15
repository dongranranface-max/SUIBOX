import type { Metadata } from "next";
import "./globals.css";
import { I18nProvider } from "@/contexts/I18nContext";
import { Providers } from "@/providers/WalletProvider";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "SUIBOX - NFT盲盒与DeFi质押平台 | SUI链",
  description: "SUIBOX是基于SUI链的NFT盲盒平台，支持开盲盒、碎片合成、NFT交易、DeFi质押等功能。",
  keywords: "NFT, SUI, 盲盒, DeFi, 质押, 区块链, Web3",
  authors: [{ name: "SUIBOX Team" }],
  openGraph: {
    title: "SUIBOX - NFT盲盒与DeFi质押平台",
    description: "基于SUI链的NFT盲盒平台，开启你的数字资产之旅",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body className="antialiased">
        <Providers>
          <I18nProvider>
            <Header />
            {children}
          </I18nProvider>
        </Providers>
      </body>
    </html>
  );
}
