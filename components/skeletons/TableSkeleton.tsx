/**
 * Table Skeleton Component
 * Loading state for data tables (admin dashboard)
 */

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export default function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full">
        {/* Header */}
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {[...Array(columns)].map((_, i) => (
              <th key={i} className="px-6 py-3 text-left">
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              </th>
            ))}
          </tr>
        </thead>
        
        {/* Body */}
        <tbody className="divide-y divide-gray-200">
          {[...Array(rows)].map((_, rowIndex) => (
            <tr key={rowIndex}>
              {[...Array(columns)].map((_, colIndex) => (
                <td key={colIndex} className="px-6 py-4">
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
