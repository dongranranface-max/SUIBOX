'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';

export default function TermsPage() {
  const { tt } = useI18n?.() || { tt: (k: string, f?: string) => f || k };
  return (
    <div className="min-h-screen bg-black text-white">
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <h1 className="text-3xl font-bold mb-8 text-center">📜 服务条款</h1>
        
        <div className="space-y-6 text-gray-300 leading-relaxed">
          <section className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">第一条：接受条款</h2>
            <p>
              欢迎使用SUIBOX平台（以下简称"本平台"）。本服务条款（以下简称"条款"）规定了您与SUIBOX之间的法律关系。
              您访问或使用本平台，即表示您已阅读、理解并同意受本条款的约束。如果您不同意本条款的任何内容，请立即停止使用本平台。
            </p>
          </section>

          <section className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">第二条：服务描述</h2>
            <p>
              SUIBOX是一个基于SUI区块链的NFT交易平台，提供以下服务：NFT铸造、盲盒抽取、碎片合成、NFT交易、质押、拍卖及DAO治理等功能。
              本平台保留随时修改、暂停或终止任何服务的权利，恕不另行通知。
            </p>
          </section>

          <section className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">第三条：用户资格</h2>
            <p>
              您确认并保证：您已达到法定年龄并具有签订合同的完全能力；您未被禁止使用本平台；
              您的使用行为将遵守所有适用法律和法规。您需要注册账户并完成必要的身份验证才能使用部分功能。
            </p>
          </section>

          <section className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">第四条：账户安全</h2>
            <p>
              您有责任保护您的账户凭证安全，包括密码和私钥。您对账户下发生的所有活动负全部责任。
              如发现任何未经授权的使用或安全漏洞，请立即通知我们。您同意对您的密码和账户严格保密，不向任何第三方透露。
            </p>
          </section>

          <section className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">第五条：NFT交易规则</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>所有NFT交易基于智能合约执行，一旦完成不可撤销</li>
              <li>卖家需确认拥有NFT的完整所有权</li>
              <li>平台收取一定比例的手续费（详见费率页面）</li>
              <li>禁止洗钱交易、价格操纵及其他违规行为</li>
              <li>用户需自行承担NFT价格波动风险</li>
            </ul>
          </section>

          <section className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">第六条：盲盒抽取</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>盲盒抽取结果由随机算法产生，概率公开透明</li>
              <li>抽取前请仔细阅读各稀有度的概率说明</li>
              <li>一旦抽取完成，不可退款或更换</li>
              <li>平台保留调整概率的权利，并将提前公告</li>
            </ul>
          </section>

          <section className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">第七条：质押规则</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>质押NFT可获得BOX代币奖励</li>
              <li>质押锁定期内NFT不可转移</li>
              <li>提前解除质押将扣除一定比例违约金</li>
              <li>收益率可能根据市场情况调整</li>
            </ul>
          </section>

          <section className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">第八条：DAO治理</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>持有BOX代币可参与平台治理投票</li>
              <li>提案需达到最低门槛才能进入投票阶段</li>
              <li>投票结果具有约束力，平台必须执行</li>
              <li>委托投票机制允许将投票权委托给社区代表</li>
            </ul>
          </section>

          <section className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">第九条：知识产权</h2>
            <p>
              本平台及其内容（包括但不限于代码、Logo，设计、文本、图形）的知识产权归SUIBOX所有。
              未经授权，您不得复制、修改、分发或使用本平台内容用于商业目的。用户上传的内容归用户所有，但授予本平台全球免费使用权。
            </p>
          </section>

          <section className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">第十条：免责声明</h2>
            <p>
              本平台按"原样"提供，不提供任何明示或暗示的保证。在法律允许的最大范围内，我们不对以下事项承担责任：
              任何交易损失、NFT价值波动、第三方行为，网络故障或数据丢失。您使用本平台的风险由您自行承担。
            </p>
          </section>

          <section className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">第十一条：责任限制</h2>
            <p>
              在任何情况下，我们不对您遭受的间接、附带、特殊或后果性损害负责。
              我们的总责任不超过您在使用本平台期间向我们支付的费用（如果有）。某些司法管辖区不允许排除或限制间接损害，上述限制可能不适用于您。
            </p>
          </section>

          <section className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">第十二条：终止</h2>
            <p>
              我们可能随时终止或暂停您对本平台的访问，恕不另行通知，包括如果您违反本条款。
              终止后，您使用本平台的权利立即失效。您可以使用本平台的服务直到您主动关闭账户或账户被终止。
            </p>
          </section>

          <section className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">第十三条：管辖法律</h2>
            <p>
              本条款受SUI区块链所在 jurisdiction 法律管辖。因本条款或您使用本平台而产生的任何争议，
              应通过友好协商解决。如协商不成，任何一方均可向有管辖权的法院提起诉讼。
            </p>
          </section>

          <section className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">第十四条：变更条款</h2>
            <p>
              我们保留随时修改本条款的权利。我们将通过平台公告或更新条款生效日期来通知重大变更。
              您在变更生效后继续使用本平台即表示接受新条款。建议您定期查看本条款以了解最新内容。
            </p>
          </section>

          <section className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">联系方式</h2>
            <p>
              如对本条款有任何疑问，请联系我们：<br/>
              📧 邮箱：support@suibox.io<br/>
              💬 Discord：discord.gg/suibox<br/>
              🐦 Twitter：@SUIBOX_Official
            </p>
          </section>
        </div>

        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>最后更新日期：2026年3月12日</p>
          <div className="mt-4 flex justify-center gap-4">
            <Link href="/privacy" className="text-violet-400 hover:text-violet-300">查看隐私政策</Link>
            <span>|</span>
            <Link href="/" className="text-violet-400 hover:text-violet-300">返回首页</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
