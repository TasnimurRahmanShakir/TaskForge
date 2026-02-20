import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { Camera, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useAuthStore } from "@/store/useAuthStore";
import { api } from "@/lib/api";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "MEMBER",
    },
  });

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (file: File | null) => void,
  ) => {
    const file = e.target.files?.[0] || null;
    onChange(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  async function onSubmit(values: SignupFormValues) {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("role", values.role || "MEMBER");
      if (values.profileImage) {
        formData.append("profileImage", values.profileImage);
      }

      await api.post("/auth/register", formData);

      // Auto-login after signup
      const loginRes: any = await api.post("/auth/login", {
        email: values.email,
        password: values.password,
      });

      setAuth(loginRes.user, loginRes.accessToken, loginRes.accessToken);
      navigate("/dashboard");
    } catch (error) {
      console.error("Signup failed:", error);
    } finally {
      setIsLoading(false);
    }
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
          <div className="flex flex-col items-center gap-4 mb-6">
            <FormField
              control={form.control}
              name="profileImage"
              render={({ field: { onChange, value: _value, ...field } }) => (
                <FormItem className="flex flex-col items-center">
                  <div className="relative group">
                    <Avatar className="h-24 w-24 border-2 border-white/10 group-hover:border-primary/50 transition-all duration-300 shadow-xl overflow-hidden bg-[#0d0d1a]">
                      <AvatarImage
                        src={imagePreview || ""}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-primary/5 text-primary text-2xl font-black">
                        {form.watch("name")?.substring(0, 2).toUpperCase() ||
                          "AM"}
                      </AvatarFallback>
                    </Avatar>
                    <label
                      htmlFor="profileImage"
                      className="absolute bottom-0 right-0 h-8 w-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-transform duration-200 border-2 border-[#0d0d1a]"
                    >
                      <Camera className="h-4 w-4" />
                      <input
                        id="profileImage"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        {...field}
                        value=""
                        onChange={(e) => handleImageChange(e, onChange)}
                      />
                    </label>
                  </div>
                  <FormMessage className="text-xs text-red-400/80" />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground/90 font-medium">
                    Join as
                  </FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="flex h-11 w-full rounded-md border border-white/10 bg-white/3 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 focus:border-primary/40 transition-all text-white appearance-none cursor-pointer"
                    >
                      <option value="MEMBER" className="bg-[#0d0d1a]">
                        Member
                      </option>
                      <option value="PROJECT_MANAGER" className="bg-[#0d0d1a]">
                        Project Manager
                      </option>
                      <option value="SUPER_USER" className="bg-[#0d0d1a]">
                        Super User
                      </option>
                    </select>
                  </FormControl>
                  <FormMessage className="text-xs text-red-400/80" />
                </FormItem>
              )}
            />
          </div>

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
