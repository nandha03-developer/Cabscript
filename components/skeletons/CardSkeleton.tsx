/**
 * Card Skeleton Component
 * Used for loading states of card-based content
 */

export default function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 animate-pulse">
      {/* Header */}
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
      
      {/* Content lines */}
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
      
      {/* Footer */}
      <div className="mt-6 h-10 bg-gray-200 rounded w-1/3"></div>
    </div>
  );
}
