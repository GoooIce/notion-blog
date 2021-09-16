import Header from '../components/header'
import ExtLink from '../components/ext-link'
import Features from '../components/features'
import sharedStyles from '../styles/shared.module.css'

export default function Index() {
  return (
    <>
      <Header titlePre="Home" />
      <div className={sharedStyles.layout}>
        <img
          src="/goooice-and-notion.png"
          height="85"
          width="250"
          alt="Goooice + Notion"
        />
        <h1>欢迎访问GoooIce的MiantuNet</h1>
        <h2>又一个记录与分享的博客 </h2>

        <Features />

        <div className="explanation">
          <p>呲溜 ლ(′◉❥◉｀ლ)</p>
        </div>
      </div>
    </>
  )
}
