import type { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AuthLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthLayout({
  title,
  description,
  children,
  footer,
}: AuthLayoutProps) {
  return (
    <div className="min-h-svh w-full flex items-center justify-center bg-background p-4 overflow-y-auto relative py-12 sm:py-4">
      <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
      <div className="absolute inset-0 -z-10 h-full w-full [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,var(--color-primary)_100%)] opacity-50" />
      <Card className="w-full max-w-md glass-morphism relative z-10 animate-in fade-in zoom-in duration-700 overflow-hidden">
        <CardHeader className="space-y-1 p-6 sm:p-8">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="relative group">
              <div className="absolute -inset-1 bg-linear-to-r from-primary to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
              <div className="relative h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-black/40 flex items-center justify-center border border-white/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-6 w-6 sm:h-7 sm:w-7 text-primary"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
            </div>
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-bold text-center tracking-tight bg-linear-to-br from-white to-white/60 bg-clip-text text-transparent">
            {title}
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground/80 text-sm sm:text-base">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-6 sm:px-8 pb-6 sm:pb-8">
          {children}
        </CardContent>
        {footer && (
          <CardFooter className="flex flex-col space-y-2 border-t border-white/5 pt-6 pb-8">
            {footer}
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
