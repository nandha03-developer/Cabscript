import { Metadata } from "next";
import LicenseManagementClient from "./LicenseManagementClient";

export const metadata: Metadata = {
  title: "License Key Management - CabScript Admin",
  description: "Manage and validate license keys",
};

export default function LicenseManagementPage() {
  return <LicenseManagementClient />;
}
