import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
  articleData?: {
    author?: string;
    publishedTime?: string;
    modifiedTime?: string;
    section?: string;
    tags?: string[];
  };
}

export default function SEOHead({
  title = 'AI Marketing News - AI・マーケティング業界の最新動向',
  description = 'AI・マーケティング業界の最新動向と実践的なノウハウを専門家がお届け。GPT-4、ChatGPT、マーケティング自動化など、最新のトレンドを詳しく解説します。',
  keywords = ['AI', 'マーケティング', 'GPT-4', 'ChatGPT', 'マーケティング自動化', 'デジタルマーケティング'],
  ogTitle,
  ogDescription,
  ogImage = 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200',
  ogUrl,
  twitterTitle,
  twitterDescription,
  twitterImage,
  canonicalUrl,
  articleData
}: SEOHeadProps) {
  
  useEffect(() => {
    // Set document title
    document.title = title;

    // Helper function to set meta tag
    const setMetaTag = (name: string, content: string, property?: boolean) => {
      const attribute = property ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };

    // Helper function to set link tag
    const setLinkTag = (rel: string, href: string) => {
      let link = document.querySelector(`link[rel="${rel}"]`);
      
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', rel);
        document.head.appendChild(link);
      }
      
      link.setAttribute('href', href);
    };

    // Basic meta tags
    setMetaTag('description', description);
    setMetaTag('keywords', keywords.join(', '));
    setMetaTag('author', 'AI Marketing News');
    setMetaTag('robots', 'index, follow');
    setMetaTag('viewport', 'width=device-width, initial-scale=1.0');

    // Open Graph tags
    setMetaTag('og:type', 'website', true);
    setMetaTag('og:title', ogTitle || title, true);
    setMetaTag('og:description', ogDescription || description, true);
    setMetaTag('og:image', ogImage, true);
    setMetaTag('og:site_name', 'AI Marketing News', true);
    setMetaTag('og:locale', 'ja_JP', true);

    if (ogUrl) {
      setMetaTag('og:url', ogUrl, true);
    }

    // Article-specific Open Graph tags
    if (articleData) {
      setMetaTag('og:type', 'article', true);
      
      if (articleData.author) {
        setMetaTag('article:author', articleData.author, true);
      }
      
      if (articleData.publishedTime) {
        setMetaTag('article:published_time', articleData.publishedTime, true);
      }
      
      if (articleData.modifiedTime) {
        setMetaTag('article:modified_time', articleData.modifiedTime, true);
      }
      
      if (articleData.section) {
        setMetaTag('article:section', articleData.section, true);
      }
      
      if (articleData.tags) {
        articleData.tags.forEach(tag => {
          setMetaTag('article:tag', tag, true);
        });
      }
    }

    // Twitter Card tags
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:site', '@AIMarketingNews');
    setMetaTag('twitter:creator', '@AIMarketingNews');
    setMetaTag('twitter:title', twitterTitle || ogTitle || title);
    setMetaTag('twitter:description', twitterDescription || ogDescription || description);
    setMetaTag('twitter:image', twitterImage || ogImage);

    // Additional SEO tags
    setMetaTag('theme-color', '#dc2626');
    setMetaTag('msapplication-TileColor', '#dc2626');

    // Canonical URL
    if (canonicalUrl) {
      setLinkTag('canonical', canonicalUrl);
    }

    // Structured data (JSON-LD)
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': articleData ? 'Article' : 'WebSite',
      name: title,
      description: description,
      url: canonicalUrl || window.location.href,
      ...(articleData ? {
        headline: title,
        author: {
          '@type': 'Person',
          name: articleData.author || 'AI Marketing News'
        },
        publisher: {
          '@type': 'Organization',
          name: 'AI Marketing News',
          logo: {
            '@type': 'ImageObject',
            url: 'https://ai-marketing-news.example.com/logo.png'
          }
        },
        datePublished: articleData.publishedTime,
        dateModified: articleData.modifiedTime || articleData.publishedTime,
        image: ogImage,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl || window.location.href
        },
        keywords: keywords.join(', ')
      } : {
        '@type': 'WebSite',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${window.location.origin}?search={search_term_string}`
          },
          'query-input': 'required name=search_term_string'
        }
      })
    };

    // Remove existing structured data
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      // Don't remove meta tags on cleanup as they should persist
      // for the page lifetime
    };
  }, [
    title, 
    description, 
    keywords, 
    ogTitle, 
    ogDescription, 
    ogImage, 
    ogUrl,
    twitterTitle,
    twitterDescription,
    twitterImage,
    canonicalUrl,
    articleData
  ]);

  // This component doesn't render anything visible
  return null;
}

// Utility function to generate meta tags for server-side rendering
export const generateMetaTags = (props: SEOHeadProps) => {
  const {
    title = 'AI Marketing News - AI・マーケティング業界の最新動向',
    description = 'AI・マーケティング業界の最新動向と実践的なノウハウを専門家がお届け',
    keywords = ['AI', 'マーケティング', 'GPT-4', 'ChatGPT'],
    ogTitle,
    ogDescription,
    ogImage = 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200',
    ogUrl,
    twitterTitle,
    twitterDescription,
    twitterImage,
    canonicalUrl,
    articleData
  } = props;

  return {
    title,
    meta: [
      { name: 'description', content: description },
      { name: 'keywords', content: keywords.join(', ') },
      { name: 'author', content: 'AI Marketing News' },
      { name: 'robots', content: 'index, follow' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      
      // Open Graph
      { property: 'og:type', content: articleData ? 'article' : 'website' },
      { property: 'og:title', content: ogTitle || title },
      { property: 'og:description', content: ogDescription || description },
      { property: 'og:image', content: ogImage },
      { property: 'og:site_name', content: 'AI Marketing News' },
      { property: 'og:locale', content: 'ja_JP' },
      ...(ogUrl ? [{ property: 'og:url', content: ogUrl }] : []),
      
      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@AIMarketingNews' },
      { name: 'twitter:creator', content: '@AIMarketingNews' },
      { name: 'twitter:title', content: twitterTitle || ogTitle || title },
      { name: 'twitter:description', content: twitterDescription || ogDescription || description },
      { name: 'twitter:image', content: twitterImage || ogImage },
      
      // Additional
      { name: 'theme-color', content: '#dc2626' },
      { name: 'msapplication-TileColor', content: '#dc2626' }
    ],
    link: [
      ...(canonicalUrl ? [{ rel: 'canonical', href: canonicalUrl }] : [])
    ]
  };
};