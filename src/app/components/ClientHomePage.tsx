'use client';

import Header from '../../components/header';
import ExtLink from '../../components/ext-link';
import Features from '../../components/features';
import SmoothScroll from '../../components/smooth-scroll';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { 
  useParallax, 
  useRevealOnScroll, 
  useStaggeredReveal,
  useMouseParallax,
  use3DTilt,
  useMagneticEffect,
  useScrollRotate,
  useScaleOnScroll
} from '../../hooks/useParallax';
import { 
  FloatingShapes, 
  WaveBackground, 
  ParticleField, 
  MorphingBlob, 
  GeometricPattern 
} from '../../components/decorations';
import sharedStyles from '../../styles/shared.module.css';
import styles from '../../styles/home.module.css';

interface ClientHomePageProps {
  recentPosts: any[];
}

export default function ClientHomePage({ recentPosts }: ClientHomePageProps) {
  const [loading, setLoading] = useState(false); // No longer loading since data is server-fetched

  // Enhanced parallax refs with artistic effects
  const heroBackgroundRef = useParallax({ speed: 0.3 });
  const heroContentRef = useRevealOnScroll({ delay: 0.2 });
  const heroMouseRef = useMouseParallax({ intensity: 0.1 });
  const hero3DRef = use3DTilt({ intensity: 0.05 });
  
  const featuresSectionRef = useRevealOnScroll({ delay: 0.3 });
  const featuresMagneticRef = useMagneticEffect({ intensity: 0.2 });
  
  const postsSectionRef = useRevealOnScroll({ delay: 0.4 });
  const postsGridRef = useStaggeredReveal('.post-card');
  const postsScaleRef = useScaleOnScroll({ scale: 1.1 });
  
  const ctaSectionRef = useParallax({ speed: 0.2 });
  const ctaWaveRef = useScrollRotate({ speed: 0.3 });

  return (
    <>
      <SmoothScroll>
        <Header titlePre="Home" />
        <div className={`${sharedStyles.layout} ${styles.homeContainer}`}>
          {/* Hero Section */}
          <section className={styles.hero}>
            <div
              ref={heroBackgroundRef as any}
              className={styles.heroBackground}
            />
            
            {/* Artistic decorations - positioned to complement content */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <FloatingShapes 
                count={6} 
                size="medium" 
                className="opacity-08 absolute top-1/4 left-1/4"
              />
              <ParticleField 
                count={12} 
                size={2} 
                className="opacity-10 absolute top-1/2 right-1/3"
              />
              <MorphingBlob 
                color="#FF6B9D" 
                size={200} 
                className="opacity-05 absolute bottom-1/4 left-1/3"
              />
              <GeometricPattern 
                pattern="dots" 
                color="#00D4FF" 
                className="opacity-06 absolute top-1/3 right-1/4"
              />
            </div>
            
            <div 
              ref={heroMouseRef as any}
              className={styles.heroContent}
            >
              <div 
                ref={hero3DRef as any}
                className={styles.logoWrapper}
              >
                <Image
                  src="/goooice-and-notion.png"
                  width={300}
                  height={102}
                  alt="Goooice + Notion"
                  className={`${styles.logo} artistic-hover-lift`}
                  priority
                />
              </div>
              <div ref={heroContentRef as any} className={styles.heroText}>
                <h1 className={`${styles.heroTitle} artistic-text-gradient`}>
                  欢迎访问 <span className={styles.highlight}>GoooIce</span> 的 MiantuNet
                </h1>
                <h2 className={styles.heroSubtitle}>
                  一个关于技术、生活与思考的个人博客
                </h2>
              </div>
            </div>
            <div className={`${styles.heroQuote} artistic-border`}>
              <blockquote>
                <p>"这个妹妹好像在哪儿见过似的"</p>
                <cite>— 贾宝玉初见林黛玉</cite>
              </blockquote>
              <p className={styles.emoji}>呲溜 ლ(′◉❥◉｀ლ)</p>
            </div>
          </section>

          {/* Features Section */}
          <section ref={featuresSectionRef as any} className={styles.featuresSection}>
            <div ref={featuresMagneticRef as any}>
              <h2 className={`${styles.sectionTitle} artistic-text-gradient`}>技术栈与兴趣</h2>
              <Features />
            </div>
            <GeometricPattern 
              pattern="hexagons" 
              color="#FFB800" 
              className="opacity-10"
            />
          </section>

          {/* Recent Posts Preview */}
          <section ref={postsSectionRef as any} className={styles.recentPosts}>
            <div className={styles.sectionHeader}>
              <h2 className={`${styles.sectionTitle} artistic-text-gradient`}>最新文章</h2>
              <Link href="/blog" className={`${styles.viewAllLink} artistic-hover-lift`}>
                查看全部 →
              </Link>
            </div>

            {loading ? (
              <div className={styles.loading}>加载中...</div>
            ) : recentPosts.length > 0 ? (
              <div ref={postsGridRef as any} className={styles.postsGrid}>
                {recentPosts.map((post, index) => (
                  <Link
                    href={`/blog/${post.slug}`}
                    key={post.id}
                    className={`${styles.postCard} post-card artistic-hover-lift artistic-border`}
                    style={{
                      animationDelay: `${index * 0.1}s`
                    }}
                  >
                    <div className={styles.postContent}>
                      <h3 className={styles.postTitle}>{post.title}</h3>
                      <p className={styles.postDate}>
                        {new Date(post.date).toLocaleDateString('zh-CN')}
                      </p>
                      {post.preview && (
                        <p className={styles.postPreview}>
                          {post.preview.slice(0, 120)}...
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className={styles.noPosts}>
                <p>暂无文章，敬请期待！</p>
              </div>
            )}
            
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <WaveBackground 
                color="#00FFA3" 
                className="opacity-08 absolute bottom-0 left-0"
              />
              <FloatingShapes 
                count={4} 
                size="small" 
                className="opacity-12 absolute top-1/3 right-1/4"
              />
              <GeometricPattern 
                pattern="dots" 
                color="#FF6B9D" 
                className="opacity-06 absolute top-1/2 left-1/3"
              />
            </div>
          </section>

          {/* Call to Action */}
          <section ref={ctaSectionRef as any} className={styles.cta}>
            <div className={styles.ctaBackground} />
            
            {/* Artistic decorations - positioned to complement content */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <WaveBackground 
                color="#C06BFF" 
                className="opacity-08 absolute bottom-0 left-0"
              />
              <ParticleField 
                count={12}
                size={3} 
                className="opacity-15 absolute top-1/4 right-1/4"
              />
              <MorphingBlob 
                color="#00D4FF" 
                size={300} 
                className="opacity-06 absolute bottom-1/4 left-1/3"
              />
              <GeometricPattern 
                pattern="dots" 
                color="#FFB800" 
                className="opacity-05 absolute top-1/2 left-1/2"
              />
            </div>
            
            <div ref={ctaWaveRef as any} className={styles.ctaContent}>
              <h2 className="artistic-text-gradient">探索更多</h2>
              <p>发现技术分享、生活记录和思考感悟</p>
              <div className={styles.ctaButtons}>
                <Link href="/blog" className={`${styles.primaryButton} artistic-hover-lift artistic-glow`}>
                  浏览博客
                </Link>
                <Link href="/contact" className={`${styles.secondaryButton} artistic-hover-lift`}>
                  联系我
                </Link>
              </div>
            </div>
          </section>
        </div>
      </SmoothScroll>
    </>
  );
}