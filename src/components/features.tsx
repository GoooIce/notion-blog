import Lightning from './svgs/lightning';
import Jamstack from './svgs/jamstack';
import Wifi from './svgs/wifi';
import Lighthouse from './svgs/lighthouse';
import Plus from './svgs/plus';
import Notion from './svgs/notion';
import Edit from './svgs/edit';
import Scroll from './svgs/scroll';
import { useMagneticEffect, use3DTilt } from '../hooks/useParallax';

const features = [
  {
    text: 'Rust',
    icon: Lightning,
    gradient: 'var(--gradient-primary)',
    color: '#FF6B9D'
  },
  {
    text: 'DDD',
    icon: Jamstack,
    gradient: 'var(--gradient-secondary)',
    color: '#00D4FF'
  },
  {
    text: '蒸达人',
    icon: Wifi,
    gradient: 'var(--gradient-accent)',
    color: '#FFB800'
  },
  {
    text: 'DeepLearning',
    icon: Edit,
    gradient: 'var(--gradient-nature)',
    color: '#00FFA3'
  },
  {
    text: '终身学习',
    icon: Plus,
    gradient: 'var(--gradient-primary)',
    color: '#C06BFF'
  },
  {
    text: '开源爱好',
    icon: Scroll,
    gradient: 'var(--gradient-secondary)',
    color: '#0099FF'
  },
  {
    text: '半程马拉松',
    icon: Lighthouse,
    gradient: 'var(--gradient-accent)',
    color: '#FF6B00'
  },
  {
    text: 'Edit via Notion',
    icon: Notion,
    gradient: 'var(--gradient-nature)',
    color: '#00D4AA'
  },
];

const FeatureItem = ({ text, icon: Icon, gradient, color }: any) => {
  const magneticRef = useMagneticEffect({ intensity: 0.2 });
  const tiltRef = use3DTilt({ intensity: 0.1 });

  return (
    <div 
      ref={magneticRef as any}
      className="feature artistic-hover-lift"
      style={{
        background: `linear-gradient(135deg, ${color}15, ${color}05)`,
        border: `1px solid ${color}30`,
        borderRadius: 'var(--radius-large)',
        padding: '1rem',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all var(--animation-normal) var(--ease-smooth)',
      }}
    >
      <div 
        ref={tiltRef as any}
        className="feature-content"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {Icon && (
          <div 
            className="feature-icon"
            style={{
              color: color,
              filter: `drop-shadow(0 2px 4px ${color}40)`,
              transition: 'all var(--animation-normal) var(--ease-smooth)',
            }}
          >
            <Icon height={24} width={24} />
          </div>
        )}
        <span 
          className="feature-text"
          style={{
            fontWeight: '600',
            color: color,
            fontSize: '0.95rem',
            transition: 'all var(--animation-normal) var(--ease-smooth)',
          }}
        >
          {text}
        </span>
      </div>
      
      {/* Gradient overlay */}
      <div 
        className="feature-overlay"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: gradient,
          opacity: 0,
          transition: 'opacity var(--animation-normal) var(--ease-smooth)',
          zIndex: 0,
        }}
      />
    </div>
  );
};

const Features = () => (
  <div className="features">
    {features.map((feature) => (
      <FeatureItem key={feature.text} {...feature} />
    ))}
  </div>
);

export default Features;
