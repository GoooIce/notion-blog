import '../styles/global.css';
import 'katex/dist/katex.css';
import Footer from '../components/footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'GoooIce的MiantuNet',
    template: '%s | GoooIce的MiantuNet'
  },
  description: '一个关于技术、生活与思考的个人博客',
  language: 'zh-CN',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    siteName: 'GoooIce的MiantuNet',
    images: [
      {
        url: '/goooice-and-notion.png',
        width: 300,
        height: 102,
        alt: 'GoooIce + Notion',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GoooIce的MiantuNet',
    description: '一个关于技术、生活与思考的个人博客',
    images: ['/goooice-and-notion.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-cmn-Hans">
      <head />
      <body>
        {children}
        <Footer />
      </body>
    </html>
  );
}