import { Metadata } from "next";
import ActivityLogsClient from "./ActivityLogsClient";

export const metadata: Metadata = {
  title: "Activity Logs - CabScript Admin",
  description: "View and filter admin activity logs",
};

export default function ActivityLogsPage() {
  return <ActivityLogsClient />;
}
