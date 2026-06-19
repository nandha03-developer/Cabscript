import { Metadata } from "next";
import SettingsPageClient from "./SettingsPageClient";

export const metadata: Metadata = {
  title: "Settings | CabScript Admin",
  description: "Admin settings and preferences",
};

export default function SettingsPage() {
  return <SettingsPageClient />;
}
