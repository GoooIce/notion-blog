import Header from '../components/header';
import ExtLink from '../components/ext-link';
import Features from '../components/features';
import SmoothScroll from '../components/smooth-scroll';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  useParallax,
  useRevealOnScroll,
  useStaggeredReveal,
} from '../hooks/useParallax';
import sharedStyles from '../styles/shared.module.css';
import styles from '../styles/home.module.css';

export default function Index() {
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch recent posts for preview
    const fetchRecentPosts = async () => {
      try {
        const response = await fetch('/api/blog');
        if (response.ok) {
          const data = await response.json();
          setRecentPosts(data.posts?.slice(0, 3) || []);
        }
      } catch (error) {
        console.error('Failed to fetch recent posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentPosts();
  }, []);

  // Parallax refs
  const heroBackgroundRef = useParallax({ speed: 0.3 });
  const heroContentRef = useRevealOnScroll({ delay: 0.2 });
  const featuresSectionRef = useRevealOnScroll({ delay: 0.3 });
  const postsSectionRef = useRevealOnScroll({ delay: 0.4 });
  const postsGridRef = useStaggeredReveal('.post-card');
  const ctaSectionRef = useParallax({ speed: 0.2 });

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
            <div ref={heroContentRef as any} className={styles.heroContent}>
              <div className={styles.logoWrapper}>
                <Image
                  src="/goooice-and-notion.png"
                  width={300}
                  height={102}
                  alt="Goooice + Notion"
                  className={styles.logo}
                  priority
                />
              </div>
              <div className={styles.heroText}>
                <h1 className={styles.heroTitle}>
                  欢迎访问 <span className={styles.highlight}>GoooIce</span> 的
                  MiantuNet
                </h1>
                <h2 className={styles.heroSubtitle}>
                  一个关于技术、生活与思考的个人博客
                </h2>
              </div>
            </div>
            <div className={styles.heroQuote}>
              <blockquote>
                <p>"这个妹妹好像在哪儿见过似的"</p>
                <cite>— 贾宝玉初见林黛玉</cite>
              </blockquote>
              <p className={styles.emoji}>呲溜 ლ(′◉❥◉｀ლ)</p>
            </div>
          </section>

          {/* Features Section */}
          <section
            ref={featuresSectionRef as any}
            className={styles.featuresSection}
          >
            <h2 className={styles.sectionTitle}>技术栈与兴趣</h2>
            <Features />
          </section>

          {/* Recent Posts Preview */}
          <section ref={postsSectionRef as any} className={styles.recentPosts}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>最新文章</h2>
              <Link href="/blog" className={styles.viewAllLink}>
                查看全部 →
              </Link>
            </div>

            {loading ? (
              <div className={styles.loading}>加载中...</div>
            ) : recentPosts.length > 0 ? (
              <div ref={postsGridRef as any} className={styles.postsGrid}>
                {recentPosts.map((post) => (
                  <Link
                    href={`/blog/${post.slug}`}
                    key={post.id}
                    className={`${styles.postCard} post-card`}
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
          </section>

          {/* Call to Action */}
          <section ref={ctaSectionRef as any} className={styles.cta}>
            <div className={styles.ctaBackground} />
            <div className={styles.ctaContent}>
              <h2>探索更多</h2>
              <p>发现技术分享、生活记录和思考感悟</p>
              <div className={styles.ctaButtons}>
                <Link href="/blog" className={styles.primaryButton}>
                  浏览博客
                </Link>
                <Link href="/contact" className={styles.secondaryButton}>
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
