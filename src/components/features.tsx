import Lightning from './svgs/lightning'
import Jamstack from './svgs/jamstack'
import Wifi from './svgs/wifi'
import Lighthouse from './svgs/lighthouse'
import Plus from './svgs/plus'
import Notion from './svgs/notion'
import Edit from './svgs/edit'
import Scroll from './svgs/scroll'

const features = [
  {
    text: 'Rust',
    icon: Lightning,
  },
  {
    text: 'JAMstack',
    icon: Jamstack,
  },
  {
    text: 'React Native',
    icon: Wifi,
  },
  {
    text: 'GraphQL',
    icon: Edit,
  },
  {
    text: '终身学习',
    icon: Plus,
  },
  {
    text: '开源爱好',
    icon: Scroll,
  },
  {
    text: '半程马拉松',
    icon: Lighthouse,
  },
  {
    text: 'Edit via Notion',
    icon: Notion,
  },
]

const Features = () => (
  <div className="features">
    {features.map(({ text, icon: Icon }) => (
      <div className="feature" key={text}>
        {Icon && <Icon height={24} width={24} />}
        <span>{text}</span>
      </div>
    ))}
  </div>
)

export default Features
