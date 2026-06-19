/**
 * Pricing Card Skeleton Component
 * Loading state for pricing cards
 */

export default function PricingCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-xl p-8 animate-pulse">
      {/* Plan name */}
      <div className="h-8 bg-gray-200 rounded w-2/3 mb-4"></div>
      
      {/* Price */}
      <div className="h-12 bg-gray-200 rounded w-1/2 mb-6"></div>
      
      {/* Features list */}
      <div className="space-y-4 mb-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-5 w-5 bg-gray-200 rounded-full shrink-0"></div>
            <div className="h-4 bg-gray-200 rounded flex-1"></div>
          </div>
        ))}
      </div>
      
      {/* Button */}
      <div className="h-12 bg-gray-200 rounded w-full"></div>
    </div>
  );
}
