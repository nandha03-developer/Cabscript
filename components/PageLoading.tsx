/**
 * Page Loading Component
 * Full-page loading state with brand colors
 */

import Spinner from './Spinner';

export default function PageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100">
      <div className="text-center">
        <Spinner size="xl" color="text-[#FFD300]" />
        <p className="mt-4 text-lg font-medium text-gray-700">Loading CabScript...</p>
      </div>
    </div>
  );
}
