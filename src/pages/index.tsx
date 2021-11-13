import Header from '../components/header'
import ExtLink from '../components/ext-link'
import Features from '../components/features'
import Image from 'next/image'
import sharedStyles from '../styles/shared.module.css'

export default function Index() {
  return (
    <>
      <Header titlePre="Home" />
      <div className={sharedStyles.layout}>
        <section>
          <Image
            src="/goooice-and-notion.png"
            layout="fixed"
            height="85"
            width="250"
            alt="Goooice + Notion"
          />
        </section>
        <h1>欢迎访问GoooIce的MiantuNet</h1>
        <h2>又一个记录与分享的博客 </h2>

        <Features />

        <div className="explanation">
          <p>贾宝玉第一次见到林黛玉说的第一句话是:</p>

          <p>
            “这个妹妹好像在哪儿见过似的”。有点熟悉，也有点意外，这就是喜欢了。
          </p>
          <p>呲溜 ლ(′◉❥◉｀ლ)</p>
        </div>
      </div>
    </>
  )
}
