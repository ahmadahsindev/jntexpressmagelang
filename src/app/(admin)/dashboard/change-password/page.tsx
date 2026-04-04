"use client";

import { useState } from "react";
import { Eye, EyeOff, Save, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { updateUserPassword } from "@/lib/firebase/auth";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const passwordSchema = z.object({
  password: z.string().min(8, "Password minimal 8 karakter"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Konfirmasi password tidak cocok",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function ChangePasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema)
  });

  const onSubmit = async (values: PasswordFormValues) => {
    setIsLoading(true);
    const { error } = await updateUserPassword(values.password);
    setIsLoading(false);
    
    if (error) {
       if (error.includes("requires-recent-login")) {
          toast.error("Demi keamanan, silakan keluar lalu masuk kembali sebelum mengganti password.");
       } else {
          toast.error(error);
       }
      return;
    }
    
    toast.success("Password berhasil diperbarui!");
    reset();
  };

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black font-headline text-on-surface">Akun & Keamanan</h1>
        <p className="text-on-surface-variant mt-1">Kelola kredensial akses admin Anda di sini.</p>
      </div>

      <Card className="shadow-sm border-border overflow-hidden">
        <CardHeader className="border-b border-border pb-6">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Lock size={20} />
             </div>
             <div>
                <CardTitle className="font-headline font-black text-xl">Ganti Password Akun Anda</CardTitle>
             </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-on-surface" htmlFor="password">Password Baru</label>
              <div className="relative">
                <input 
                  {...register("password")}
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  className={`w-full px-4 py-3 rounded-md bg-white border ${errors.password ? 'border-destructive' : 'border-border'} focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm pr-12 shadow-sm`}
                  placeholder="Minimal 8 karakter"
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
              {errors.password && <p className="text-xs text-destructive mt-1 font-medium">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-on-surface" htmlFor="confirmPassword">Konfirmasi Password Baru</label>
              <input 
                {...register("confirmPassword")}
                id="confirmPassword" 
                type={showPassword ? "text" : "password"} 
                className={`w-full px-4 py-3 rounded-md bg-white border ${errors.confirmPassword ? 'border-destructive' : 'border-border'} focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm shadow-sm`}
                placeholder="Ulangi password baru"
              />
              {errors.confirmPassword && <p className="text-xs text-destructive mt-1 font-medium">{errors.confirmPassword.message}</p>}
            </div>

            <div className="pt-4 border-t border-border mt-8 flex justify-end">
              <button 
                type="submit" 
                disabled={isLoading}
                className="kinetic-authority-gradient text-white px-8 py-3 rounded-md font-bold tracking-wide flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 shadow-md uppercase text-sm"
              >
                {isLoading ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent animate-spin rounded-full" />
                ) : <Save size={18} />}
                {isLoading ? "Memperbarui..." : "Simpan Kata Sandi"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
