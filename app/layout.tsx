// import type { Metadata } from "next";
// import Script from "next/script";
// import { Suspense } from "react";
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// import "primereact/resources/themes/lara-light-cyan/theme.css";
// import "primeicons/primeicons.css";
// import { generateMetadata as generateSEOMetadata, generateOrganizationSchema, generateWebsiteSchema } from "@/lib/seo";
// import GoogleAnalytics from "@/components/GoogleAnalytics";
// import FacebookPixel from "@/components/FacebookPixel";
// import PageViewTracker from "@/components/PageViewTracker";
// import ChatSupport from "@/components/ChatSupport";
// import PWAInstallPrompt from "@/components/PWAInstallPrompt";
// import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
// import OnlineStatusIndicator from "@/components/OnlineStatusIndicator";
// import CookieConsent from "@/components/CookieConsent";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = generateSEOMetadata({
//   title: "Launch Your Own Uber Clone in 7 Days",
//   description: "Ready-to-deploy taxi booking software with admin dashboard, driver & customer apps. Full source code, white-label solution starting at $2,999. Start your ride-hailing business today!",
//   keywords: [
//     'taxi booking script',
//     'uber clone app',
//     'ride sharing software',
//     'cab dispatch system',
//     'white label taxi app',
//     'on-demand transportation',
//     'taxi app source code',
//   ],
// });

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   const organizationSchema = generateOrganizationSchema();
//   const websiteSchema = generateWebsiteSchema();

//   return (
//     <html lang="en">
//       <head>
//         {/* JSON-LD Structured Data */}
//         <script
//           type="application/ld+json"
//           dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
//         />
//         <script
//           type="application/ld+json"
//           dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
//         />
        
//         {/* PWA Meta Tags */}
//         <link rel="manifest" href="/manifest.json" />
//         <meta name="theme-color" content="#FFD300" />
//         <meta name="mobile-web-app-capable" content="yes" />
//         <meta name="apple-mobile-web-app-capable" content="yes" />
//         <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
//         <meta name="apple-mobile-web-app-title" content="CabScript" />
        
//         {/* Apple Touch Icons */}
//         <link rel="apple-touch-icon" href="/icons/icon-152x152.png" />
//         <link rel="apple-touch-icon" sizes="72x72" href="/icons/icon-72x72.png" />
//         <link rel="apple-touch-icon" sizes="96x96" href="/icons/icon-96x96.png" />
//         <link rel="apple-touch-icon" sizes="128x128" href="/icons/icon-128x128.png" />
//         <link rel="apple-touch-icon" sizes="144x144" href="/icons/icon-144x144.png" />
//         <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
//         <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192x192.png" />
//         <link rel="apple-touch-icon" sizes="384x384" href="/icons/icon-384x384.png" />
//         <link rel="apple-touch-icon" sizes="512x512" href="/icons/icon-512x512.png" />
        
//         {/* Favicon */}
//         <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-72x72.png" />
//         <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-72x72.png" />
        
//         {/* Microsoft Tiles */}
//         <meta name="msapplication-TileColor" content="#FFD300" />
//         <meta name="msapplication-TileImage" content="/icons/icon-144x144.png" />
//         <meta name="msapplication-config" content="/browserconfig.xml" />
//       </head>
//             <body className={geistSans.className}>
//         <GoogleAnalytics />
//         <FacebookPixel />
//         <Suspense fallback={null}>
//           <PageViewTracker />
//         </Suspense>
        
//         {/* Razorpay Script */}
//         <Script
//           src="https://checkout.razorpay.com/v1/checkout.js"
//           strategy="lazyOnload"
//         />
        
//         {children}
        
//         {/* Live Chat Support - Site-wide */}
//         <ChatSupport 
//           enableTawkTo={true}
//           enableWhatsApp={true}
//           whatsAppPosition="bottom-left"
//         />
        
//         {/* PWA Features */}
//         <PWAInstallPrompt />
//         <ServiceWorkerRegistration />
//         <OnlineStatusIndicator />
        
//         {/* Cookie Consent Banner (GDPR Compliance) */}
//         <CookieConsent />
//       </body>
//     </html>
//   );
// }
