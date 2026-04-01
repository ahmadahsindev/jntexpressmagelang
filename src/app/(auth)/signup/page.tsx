"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { registerUser } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const signupSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter")
});

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema)
  });

  const onSubmit = async (values: z.infer<typeof signupSchema>) => {
    setIsLoading(true);
    const { user, error } = await registerUser(values.email, values.password);
    setIsLoading(false);
    
    if (error) {
      toast.error(error);
      return;
    }
    
    toast.success("Berhasil mendaftar! Anda sekarang adalah admin.");
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-container-low p-6">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-xl p-8 tonal-shift-bottom border border-border">
        <div className="text-center mb-8">
          <h1 className="font-headline font-black text-3xl text-primary tracking-tight mb-2">Daftar Admin</h1>
          <p className="text-on-surface-variant text-sm">Buat akun untuk akses kontrol sistem</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-on-surface" htmlFor="email">Email</label>
            <input 
              {...register("email")}
              id="email" 
              type="email" 
              className={`w-full px-4 py-3 rounded-md bg-surface-container-low border ${errors.email ? 'border-destructive' : 'border-transparent'} focus:border-primary focus:bg-white focus:ring-1 focus:ring-primary transition-colors text-sm`}
            />
            {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
          </div>

          <div className="space-y-2 relative">
            <label className="text-sm font-bold text-on-surface" htmlFor="password">Password</label>
            <div className="relative">
              <input 
                {...register("password")}
                id="password" 
                type={showPassword ? "text" : "password"} 
                className={`w-full px-4 py-3 rounded-md bg-surface-container-low border ${errors.password ? 'border-destructive' : 'border-transparent'} focus:border-primary focus:bg-white focus:ring-1 focus:ring-primary transition-colors text-sm pr-12`}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-slate-800 text-white py-3 rounded-md font-bold tracking-wide uppercase hover:bg-black transition-colors disabled:opacity-50"
          >
            {isLoading ? "Mendaftarkan..." : "Buat Akun"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-on-surface-variant">
          Sudah punya akun? <Link href="/login" className="text-primary font-bold hover:underline">Kembali ke Login</Link>
        </div>
      </div>
    </div>
  );
}
