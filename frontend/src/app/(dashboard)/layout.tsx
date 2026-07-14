import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

/**
 * Dashboard route group layout.
 * All child routes (/, /list, /history, etc.) require authentication.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
