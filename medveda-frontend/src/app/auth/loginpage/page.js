import AuthLayout from '@/app/components/auth/AuthLayout';
import AuthForm from '@/app/components/auth/AuthForm';

export default function LoginPage() {
  return (
    <AuthLayout>
      <AuthForm mode="login" />
    </AuthLayout>
  );
}
