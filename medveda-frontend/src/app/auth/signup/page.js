import AuthLayout from '../../../components/AuthLayout';
import AuthForm from '../../../components/AuthForm';

export default function SignupPage() {
  return (
    <AuthLayout>
      <AuthForm mode="signup" />
    </AuthLayout>
  );
}
