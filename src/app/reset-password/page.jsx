import { Suspense } from 'react';
import ResetPasswordPage from '@/components/forgot-password/ResetPassword';

export default function ResetPassword() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordPage />
    </Suspense>
  );
}