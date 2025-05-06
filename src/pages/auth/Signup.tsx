
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthLayout } from "@/components/auth/AuthLayout";

export default function Signup() {
  return (
    <AuthLayout>
      <div className="flex justify-center">
        <AuthForm type="signup" />
      </div>
    </AuthLayout>
  );
}
