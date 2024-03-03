import ExtLink from './ext-link'

export default function Footer() {
  return (
    <>
      <footer>
        Powered by{' '}
        <a href="https://notion.io" rel="nofollow">
          Notion
        </a>{' '}
        ©王雪
        <span>
          {' '}
          2021-2024{' '}
          <a href="https://beian.miit.gov.cn/" rel="nofollow">
            冀ICP备15007337号
          </a>
        </span>
      </footer>
    </>
  )
}
