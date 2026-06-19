/**
 * Loading Overlay Component
 * Full-screen loading overlay for page transitions
 */

import Spinner from './Spinner';

interface LoadingOverlayProps {
  message?: string;
}

export default function LoadingOverlay({ message = 'Loading...' }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4 max-w-sm mx-4">
        <Spinner size="xl" />
        <p className="text-lg font-medium text-gray-700">{message}</p>
      </div>
    </div>
  );
}
