import type { Metadata } from "next";
import { LoginForm } from "@/components/site/LoginForm";

export const metadata: Metadata = {
  title: "Přihlášení",
  description: "Vstup do soukromé části webu.",
  // A login page has no business being in search results.
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return <LoginForm />;
}
