'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';

export default function PrivacyPage() {
  const { tt } = useI18n?.() || { tt: (k: string, f?: string) => f || k };
  return (
    <div className="min-h-screen bg-black text-white">
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <h1 className="text-3xl font-bold mb-8 text-center">🔒 隐私政策</h1>
        
        <div className="space-y-6 text-gray-300 leading-relaxed">
          <section className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">引言</h2>
            <p>
              SUIBOX（以下简称"我们"或"本平台"）非常重视用户（以下简称"您"）的隐私。
              本隐私政策（以下简称"政策"）说明了我们如何收集、使用、存储和保护您的个人信息。
              使用本平台即表示您同意本政策所述的数据处理方式。
            </p>
          </section>

          <section className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">我们收集的信息</h2>
            <ul className="list-disc list-inside space-y-3">
              <li><strong className="text-white">账户信息：</strong> 注册时收集的用户名、电子邮件地址、钱包地址</li>
              <li><strong className="text-white">区块链数据：</strong> 您的钱包地址、交易记录、NFT持有信息（这些信息是公开的区块链数据）</li>
              <li><strong className="text-white">设备信息：</strong> IP地址、浏览器类型、操作系统、访问时间、页面浏览记录</li>
              <li><strong className="text-white">Cookies：</strong> 用于改善用户体验的小型数据文件</li>
              <li><strong className="text-white">身份验证信息：</strong> 如您使用社交登录，我们会收集OAuth提供商提供的基本信息</li>
            </ul>
          </section>

          <section className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">信息使用目的</h2>
            <p className="mb-3">我们收集的信息用于以下目的：</p>
            <ul className="list-disc list-inside space-y-2">
              <li>提供、维护和改进本平台服务</li>
              <li>处理您的交易和请求</li>
              <li>验证您的身份并防止欺诈</li>
              <li>向您发送账户相关通知和更新</li>
              <li>分析使用情况以优化用户体验</li>
              <li>遵守法律义务和监管要求</li>
              <li>提供客户支持服务</li>
            </ul>
          </section>

          <section className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">信息共享与披露</h2>
            <p className="mb-3">我们可能在以下情况下共享您的信息：</p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong className="text-white">服务提供商：</strong> 与帮助我们运营平台的第三方服务提供商共享（如云存储、支付处理）</li>
              <li><strong className="text-white">法律要求：</strong> 根据法律要求或响应执法请求而披露</li>
              <li><strong className="text-white">业务转让：</strong> 如发生合并、收购或资产出售，您的信息可能被转移</li>
              <li><strong className="text-white">区块链：</strong> 您的交易信息和钱包地址在区块链上是公开的，任何人都可以查看</li>
            </ul>
            <p className="mt-3 text-yellow-400">
              ⚠️ 我们不会出售您的个人信息给广告商或第三方营销机构。
            </p>
          </section>

          <section className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">数据安全</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>采用行业标准的安全措施保护您的数据</li>
              <li>使用加密技术保护数据传输和存储</li>
              <li>定期进行安全审计和漏洞修复</li>
              <li>限制员工访问您的个人信息</li>
              <li>但请注意，互联网传输和区块链存储无法保证100%安全</li>
            </ul>
          </section>

          <section className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">数据存储</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>您的个人信息存储在加密的服务器上</li>
              <li>区块链上的数据不可更改或删除</li>
              <li>账户删除后，我们会在合理期限内删除您的个人信息（法律要求的除外）</li>
              <li>部分数据可能因技术限制无法完全删除</li>
            </ul>
          </section>

          <section className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">Cookies政策</h2>
            <p className="mb-3">我们使用Cookies来：</p>
            <ul className="list-disc list-inside space-y-2">
              <li>记住您的登录状态和偏好</li>
              <li>分析流量和使用模式</li>
              <li>提供个性化的内容和广告</li>
            </ul>
            <p className="mt-3">
              您可以通过浏览器设置禁用Cookies，但这可能影响某些功能的使用。
            </p>
          </section>

          <section className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">您的权利</h2>
            <ul className="list-disc list-inside space-y-2">
              <li><strong className="text-white">访问权：</strong> 您可以请求获取我们持有的关于您的个人信息</li>
              <li><strong className="text-white">更正权：</strong> 您可以要求更正不准确的信息</li>
              <li><strong className="text-white">删除权：</strong> 在某些情况下，您可以要求删除您的个人信息</li>
              <li><strong className="text-white">拒绝权：</strong> 您可以拒绝某些类型的数据处理</li>
              <li><strong className="text-white">数据可携带权：</strong> 您可以请求以结构化、常用格式获取您的数据</li>
            </ul>
            <p className="mt-3 text-yellow-400">
              ⚠️ 注意：区块链上的某些数据无法被删除或修改，因为它们是去中心化且不可变的。
            </p>
          </section>

          <section className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">未成年人隐私</h2>
            <p>
              本平台不面向未满18岁的用户。我们不会故意收集未成年人的个人信息。
              如果您发现您的孩子向我们提供了个人信息，请联系我们进行删除。
            </p>
          </section>

          <section className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">第三方链接</h2>
            <p>
              本平台可能包含指向第三方网站或服务的链接。我们不对这些第三方的隐私做法负责。
              建议您在离开本平台时阅读其他网站的隐私政策。
            </p>
          </section>

          <section className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">政策变更</h2>
            <p>
              我们可能随时更新本隐私政策。重大变更将通过平台公告或直接通知您。
              您继续使用本平台即表示接受更新后的政策。我们建议您定期查看本页面以了解最新内容。
            </p>
          </section>

          <section className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">跨境数据传输</h2>
            <p>
              您的信息可能在世界任何地方存储和处理，包括可能没有与您所在国家/地区同等数据保护法律的国家/地区。
              使用本平台即表示您同意跨境传输您的信息。
            </p>
          </section>

          <section className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">联系我们</h2>
            <p>
              如对本隐私政策有任何疑问、投诉或请求，请联系我们：<br/>
              📧 邮箱：privacy@suibox.io<br/>
              💬 Discord：discord.gg/suibox<br/>
              🐦 Twitter：@SUIBOX_Official
            </p>
          </section>
        </div>

        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>最后更新日期：2026年3月12日</p>
          <div className="mt-4 flex justify-center gap-4">
            <Link href="/terms" className="text-violet-400 hover:text-violet-300">查看服务条款</Link>
            <span>|</span>
            <Link href="/" className="text-violet-400 hover:text-violet-300">返回首页</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
