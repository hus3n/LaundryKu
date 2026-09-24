
import ResetPasswordClient from './ResetPasswordClient';

export function generateStaticParams() {
  return [{ token: 'dummy' }];
}

export default function ResetPasswordPage() {
  return <ResetPasswordClient />;
}

