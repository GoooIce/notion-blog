'use client';

import Link from 'next/link';
import Header from '../../components/header';
import { 
  useRevealOnScroll, 
  useStaggeredReveal,
  useMagneticEffect,
  use3DTilt,
  useScaleOnScroll
} from '../../hooks/useParallax';
import {
  FloatingShapes,
  WaveBackground,
  GeometricPattern
} from '../../components/decorations';
import blogStyles from '../../styles/blog.module.css';
import sharedStyles from '../../styles/shared.module.css';

interface BlogListClientProps {
  posts: any[];
}

export default function BlogListClient({ posts }: BlogListClientProps) {
  const headerRef = useRevealOnScroll({ delay: 0.1 });
  const postsGridRef = useStaggeredReveal('.blog-post-card');
  const backgroundRef = useScaleOnScroll({ scale: 1.05 });

  return (
    <>
      <Header titlePre="Blog" />
      
      <div className={`${sharedStyles.layout} ${blogStyles.blogIndex}`}>
        {/* Hero Section */}
        <section ref={headerRef as any} className={blogStyles.blogHero}>
          <div ref={backgroundRef as any} className={blogStyles.blogHeroBackground} />
          
          {/* Artistic decorations */}
          <FloatingShapes
            count={15}
            size="medium"
            className="opacity-20"
          />
          <GeometricPattern
            pattern="triangles"
            color="#FF6B9D"
            className="opacity-15"
          />
          
          <div className={blogStyles.blogHeroContent}>
            <h1 className="artistic-text-gradient">I wanna hacked life.</h1>
            <p className={blogStyles.blogHeroSubtitle}>
              探索技术、分享思考、记录生活
            </p>
          </div>
        </section>

        {/* Posts Grid */}
        <section className={blogStyles.postsSection}>
          {posts.length === 0 ? (
            <div className={blogStyles.noPosts}>
              <p>There are no posts yet</p>
            </div>
          ) : (
            <div ref={postsGridRef as any} className={blogStyles.postsGrid}>
              {posts.map((post, index) => {
                const postMagneticRef = useMagneticEffect({ intensity: 0.15 });
                const postTiltRef = use3DTilt({ intensity: 0.08 });
                
                return (
                  <article 
                    key={post.slug}
                    className={`${blogStyles.postPreview} blog-post-card artistic-hover-lift`}
                    style={{
                      animationDelay: `${index * 0.1}s`,
                      background: `linear-gradient(135deg, 
                        rgba(255, 107, 157, 0.05) 0%, 
                        rgba(192, 107, 255, 0.05) 50%, 
                        rgba(0, 212, 255, 0.05) 100%)`,
                      border: '1px solid rgba(255, 107, 157, 0.2)',
                      borderRadius: 'var(--radius-large)',
                      padding: '2rem',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <div 
                      ref={postMagneticRef as any}
                      className={blogStyles.postContent}
                    >
                      <div 
                        ref={postTiltRef as any}
                        className={blogStyles.postHeader}
                      >
                        <h3 className={blogStyles.postTitle}>
                          <span className={blogStyles.titleContainer}>
                            <Link 
                              href={`/blog/${post.slug}`}
                              className="artistic-text-gradient"
                            >
                              {post.title}
                            </Link>
                          </span>
                        </h3>
                        
                        {post.author && (
                          <div className={blogStyles.postAuthor}>
                            By: {post.author}
                          </div>
                        )}
                        
                        {post.date && (
                          <div className={blogStyles.postDate}>
                            Posted: {post.date}
                          </div>
                        )}
                      </div>
                      
                      <div className={blogStyles.postExcerpt}>
                        {(!post.preview || post.preview.length === 0) && '预览不可用'}
                        {post.preview}
                      </div>
                    </div>
                    
                    {/* Gradient overlay */}
                    <div 
                      className={blogStyles.postOverlay}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'var(--gradient-primary)',
                        opacity: 0,
                        transition: 'opacity var(--animation-normal) var(--ease-smooth)',
                        zIndex: 0,
                      }}
                    />
                  </article>
                );
              })}
            </div>
          )}
          
          {/* Background decorations - subtle and positioned */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <WaveBackground 
              color="#00D4FF" 
              className="opacity-05 absolute bottom-0 left-0"
            />
            <FloatingShapes 
              count={6} 
              size="small" 
              className="opacity-08 absolute top-1/3 right-1/4"
            />
            <GeometricPattern 
              pattern="dots" 
              color="#FF6B9D" 
              className="opacity-04 absolute top-1/2 left-1/3"
            />
          </div>
        </section>
      </div>
    </>
  );
}
