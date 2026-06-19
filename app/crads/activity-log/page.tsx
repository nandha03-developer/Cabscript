import { redirect } from 'next/navigation';

export default function ActivityLogRedirect() {
  // Redirect from singular to plural
  redirect('/crads/activity-logs');
}