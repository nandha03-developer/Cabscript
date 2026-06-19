// /**
//  * Home Page Loading State
//  * Shown while the main page content is being loaded
//  */

// import CardSkeleton from '@/components/skeletons/CardSkeleton';
// import PricingCardSkeleton from '@/components/skeletons/PricingCardSkeleton';

// export default function HomeLoading() {
//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Hero Section Skeleton */}
//       <section className="relative bg-black py-20 animate-pulse">
//         <div className="container mx-auto px-4">
//           <div className="max-w-4xl mx-auto text-center">
//             <div className="h-12 bg-gray-800 rounded w-3/4 mx-auto mb-6"></div>
//             <div className="h-6 bg-gray-800 rounded w-2/3 mx-auto mb-4"></div>
//             <div className="h-6 bg-gray-800 rounded w-1/2 mx-auto mb-8"></div>
//             <div className="flex justify-center gap-4">
//               <div className="h-12 bg-gray-800 rounded w-40"></div>
//               <div className="h-12 bg-gray-800 rounded w-40"></div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Stats Section Skeleton */}
//       <section className="py-12 bg-white">
//         <div className="container mx-auto px-4">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 animate-pulse">
//             {[...Array(4)].map((_, i) => (
//               <div key={i} className="text-center">
//                 <div className="h-12 bg-gray-200 rounded w-24 mx-auto mb-2"></div>
//                 <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Features Section Skeleton */}
//       <section className="py-20">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-12 animate-pulse">
//             <div className="h-10 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
//             <div className="h-6 bg-gray-200 rounded w-96 mx-auto"></div>
//           </div>
//           <div className="grid md:grid-cols-3 gap-8">
//             {[...Array(6)].map((_, i) => (
//               <CardSkeleton key={i} />
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Pricing Section Skeleton */}
//       <section className="py-20 bg-white">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-12 animate-pulse">
//             <div className="h-10 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
//             <div className="h-6 bg-gray-200 rounded w-96 mx-auto"></div>
//           </div>
//           <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
//             {[...Array(3)].map((_, i) => (
//               <PricingCardSkeleton key={i} />
//             ))}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }
