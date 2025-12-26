import '../styles/circuit-theme.css';
import '../styles/circuit-animations.css';
import CircuitBackground from '../components/circuit/CircuitBackground';
import CurrentCanvas from '../components/circuit/CurrentCanvas';
import TerminalNav from '../components/circuit/TerminalNav';
import Footer from '../components/footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'GoooIce的MiantuNet',
    template: '%s | GoooIce的MiantuNet',
  },
  description: '一个关于技术、生活与思考的个人博客',
  language: 'zh-CN',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  ),
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
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.27/dist/katex.min.css"
          integrity="sha384-Pu5+C18nP5dwykLJOhd2U4Xen7rjScHN/qusop27hdd2drI+lL5KvX7YntvT8yew"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <CircuitBackground />
        <CurrentCanvas />
        <TerminalNav />
        <main style={{ position: 'relative', zIndex: 2 }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
