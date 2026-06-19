/**
 * Form Skeleton Component
 * Loading state for forms
 */

interface FormSkeletonProps {
  fields?: number;
}

export default function FormSkeleton({ fields = 4 }: FormSkeletonProps) {
  return (
    <div className="space-y-6 animate-pulse">
      {[...Array(fields)].map((_, i) => (
        <div key={i}>
          {/* Label */}
          <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
          
          {/* Input field */}
          <div className="h-12 bg-gray-200 rounded w-full"></div>
        </div>
      ))}
      
      {/* Submit button */}
      <div className="h-12 bg-gray-200 rounded w-32"></div>
    </div>
  );
}
