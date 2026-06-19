/**
 * Blog Card Skeleton Component
 * Loading state for blog post cards
 */

export default function BlogCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
      {/* Image placeholder */}
      <div className="h-48 bg-gray-200"></div>
      
      {/* Content */}
      <div className="p-6">
        {/* Category & date */}
        <div className="flex items-center gap-4 mb-3">
          <div className="h-3 bg-gray-200 rounded w-20"></div>
          <div className="h-3 bg-gray-200 rounded w-24"></div>
        </div>
        
        {/* Title */}
        <div className="h-6 bg-gray-200 rounded w-full mb-3"></div>
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        
        {/* Excerpt */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
        
        {/* Read more button */}
        <div className="h-10 bg-gray-200 rounded w-32"></div>
      </div>
    </div>
  );
}
