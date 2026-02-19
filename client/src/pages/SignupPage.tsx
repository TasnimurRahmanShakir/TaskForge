import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { SocialAuthButton } from "@/components/auth/SocialAuthButton";
import { signupSchema, type SignupFormValues } from "@/lib/schemas";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  async function onSubmit(_values: SignupFormValues) {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    navigate("/dashboard");
    setIsLoading(false);
  }

  return (
    <AuthLayout
      title="Create an account"
      description="Enter your information to get started."
      footer={
        <div className="text-sm text-center text-muted-foreground">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Sign in
          </Link>
          <div className="mt-4 flex justify-between text-xs text-muted-foreground/50">
            <Link to="#" className="hover:text-foreground">
              Privacy Policy
            </Link>
            <Link to="#" className="hover:text-foreground">
              Terms of Service
            </Link>
            <Link to="#" className="hover:text-foreground">
              Help Center
            </Link>
          </div>
        </div>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground/90 font-medium">
                  Full Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Doe"
                    {...field}
                    className="h-11 bg-white/3 border-white/10 focus:border-primary/40 transition-all placeholder:text-muted-foreground/30"
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-400/80" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground/90 font-medium">
                  Email address
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="name@example.com"
                    {...field}
                    className="h-11 bg-white/3 border-white/10 focus:border-primary/40 transition-all placeholder:text-muted-foreground/30"
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-400/80" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground/90 font-medium">
                  Password
                </FormLabel>
                <FormControl>
                  <div className="relative group">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...field}
                      className="h-11 bg-white/3 border-white/10 focus:border-primary/40 transition-all placeholder:text-muted-foreground/30 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-primary transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-xs text-red-400/80" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-11 transition-all shadow-[0_0_20px_-8px_var(--primary)] mt-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Creating account...</span>
              </div>
            ) : (
              "Create Account"
            )}
          </Button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/6" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
              <span className="bg-transparent px-3 text-muted-foreground/40 backdrop-blur-sm">
                Or join with
              </span>
            </div>
          </div>

          <SocialAuthButton
            label="Sign up with Google"
            icon={(props: React.SVGProps<SVGSVGElement>) => (
              <svg role="img" viewBox="0 0 24 24" {...props}>
                <path
                  fill="currentColor"
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                />
              </svg>
            )}
            onClick={() => console.log("Google signup")}
          />
        </form>
      </Form>
    </AuthLayout>
  );
}
