import { Metadata } from "next";
import EmailTestingPageClient from "./EmailTestingPageClient";

export const metadata: Metadata = {
  title: "Email Testing - CabScript Admin",
  description: "Test and preview email templates",
};

export default function EmailTestingPage() {
  return <EmailTestingPageClient />;
}
