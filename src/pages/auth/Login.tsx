
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthLayout } from "@/components/auth/AuthLayout";

export default function Login() {
  return (
    <AuthLayout>
      <div className="flex justify-center">
        <AuthForm type="login" />
      </div>
    </AuthLayout>
  );
}
