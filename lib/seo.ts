import { Metadata } from 'next';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  noIndex?: boolean;
}

const siteConfig = {
  name: 'CabScript.com',
  title: 'CabScript - Launch Your Own Uber Clone in 7 Days | Taxi Booking Script',
  description: 'Ready-to-deploy taxi booking software with admin dashboard, driver & customer apps. Full source code, white-label solution. Start your ride-hailing business today!',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://cabscript.com',
  ogImage: '/og-image.jpg',
  twitterHandle: '@cabscript',
  keywords: [
    'uber clone script',
    'taxi booking software',
    'ride hailing app',
    'cab booking system',
    'taxi dispatch software',
    'uber clone source code',
    'taxi app development',
    'ride sharing software',
    'on-demand taxi app',
    'white label taxi solution',
  ],
};

export function generateMetadata({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  noIndex = false,
}: SEOProps = {}): Metadata {
  const metaTitle = title 
    ? `${title} | ${siteConfig.name}` 
    : siteConfig.title;
  
  const metaDescription = description || siteConfig.description;
  const metaImage = image || `${siteConfig.url}${siteConfig.ogImage}`;
  const metaUrl = url ? `${siteConfig.url}${url}` : siteConfig.url;
  const metaKeywords = [...siteConfig.keywords, ...keywords].join(', ');

  const metadata: Metadata = {
    metadataBase: new URL(siteConfig.url),
    title: metaTitle,
    description: metaDescription,
    keywords: metaKeywords,
    authors: author ? [{ name: author }] : [{ name: siteConfig.name }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: type === 'product' ? 'website' : type,
      locale: 'en_US',
      url: metaUrl,
      title: metaTitle,
      description: metaDescription,
      siteName: siteConfig.name,
      images: [
        {
          url: metaImage,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [metaImage],
      creator: siteConfig.twitterHandle,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: metaUrl,
    },
  };

  // Add article metadata if type is article
  if (type === 'article' && (publishedTime || modifiedTime)) {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: 'article',
      publishedTime,
      modifiedTime,
      authors: author ? [author] : undefined,
    };
  }

  return metadata;
}

/**
 * Generate JSON-LD structured data for Organization
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    description: siteConfig.description,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Madurai',
      addressRegion: 'Tamil Nadu',
      addressCountry: 'IN',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-93619-31050',
      contactType: 'Customer Service',
      email: 'support@cabscript.com',
      availableLanguage: ['English'],
    },
    sameAs: [
      'https://www.facebook.com/cabscript',
      'https://www.linkedin.com/company/cabscript',
      'https://www.youtube.com/@cabscript',
      'https://github.com/cabscript',
    ],
  };
}

/**
 * Generate JSON-LD structured data for Product
 */
export function generateProductSchema(product: {
  name: string;
  price: number;
  description: string;
  image?: string;
  sku?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: product.name,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web, iOS, Android',
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: siteConfig.name,
      },
    },
    description: product.description,
    image: product.image || `${siteConfig.url}${siteConfig.ogImage}`,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '127',
      bestRating: '5',
      worstRating: '1',
    },
  };
}

/**
 * Generate JSON-LD structured data for FAQ
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate JSON-LD structured data for Breadcrumb
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.url}`,
    })),
  };
}

/**
 * Generate JSON-LD structured data for WebSite with SearchAction
 */
export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export { siteConfig };
