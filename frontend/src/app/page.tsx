import { redirect } from "next/navigation";

/**
 * Root "/" redirects to /dashboard (auth guard handles the rest).
 */
export default function RootPage() {
  redirect("/dashboard");
}
