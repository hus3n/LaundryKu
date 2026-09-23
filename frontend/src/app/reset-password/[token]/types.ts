export interface ResetPasswordFormProps {
  token: string;
  onSuccess: () => void;
}

export interface ResetPasswordSuccessProps {
  onGoToLogin?: () => void;
}
