import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = { title: "Create Account | VoiceCart" };

export default function RegisterPage() {
  return <RegisterForm />;
}
