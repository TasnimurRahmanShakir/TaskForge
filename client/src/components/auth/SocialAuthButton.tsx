import type { ElementType } from "react";
import { Button } from "@/components/ui/button";

interface SocialAuthButtonProps {
  icon: ElementType;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function SocialAuthButton({
  icon: Icon,
  label,
  onClick,
  disabled,
}: SocialAuthButtonProps) {
  return (
    <Button
      variant="outline"
      className="w-full bg-background/50 hover:bg-background/80 border-white/10 h-10 transition-all duration-300 hover:scale-[1.02]"
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      <Icon className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
}
