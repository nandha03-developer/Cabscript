/**
 * Blog Page Loading State
 */

import BlogCardSkeleton from '@/components/skeletons/BlogCardSkeleton';

export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-12 animate-pulse">
          <div className="h-12 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-96 mx-auto"></div>
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {[...Array(6)].map((_, i) => (
            <BlogCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
