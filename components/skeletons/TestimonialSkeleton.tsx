/**
 * Testimonial Skeleton Component
 * Loading state for testimonial cards
 */

export default function TestimonialSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
      {/* Quote */}
      <div className="space-y-3 mb-6">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-11/12"></div>
        <div className="h-4 bg-gray-200 rounded w-4/5"></div>
      </div>
      
      {/* Author info */}
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="h-12 w-12 bg-gray-200 rounded-full shrink-0"></div>
        
        {/* Name and title */}
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
}
