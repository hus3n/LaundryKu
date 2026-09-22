export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export interface AppGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleFullscreen: () => void;
}
