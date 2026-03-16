import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { ActionButton } from "@/components/ui/ActionButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { Lock, Eye, EyeOff, CheckCircle2, ArrowRight } from "lucide-react";

export default function ResetPasswordScreen() {
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();

    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get("email") || "";
    const code = queryParams.get("code") || "";

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!email || !code) {
            toast({ title: "Invalid access", description: "Missing email or verification code.", variant: "destructive" });
            navigate("/forgot-password");
        }
    }, [email, code, navigate, toast]);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast({ title: "Passwords mismatch", description: "Please ensure both passwords match.", variant: "destructive" });
            return;
        }
        if (password.length < 6) {
            toast({ title: "Password too short", description: "Minimum 6 characters required.", variant: "destructive" });
            return;
        }

        setLoading(true);
        try {
            await api.auth.resetPassword({ email, code, password });
            setSuccess(true);
            toast({ title: "Password updated", description: "Your password has been reset successfully." });
        } catch (err: any) {
            toast({
                title: "Reset failed",
                description: err?.message || "Could not update password.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <MobileLayout centered className="bg-background">
                <div className="w-full max-w-sm mx-auto space-y-8 text-center animate-fade-in">
                    <div className="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold">Password Reset!</h1>
                        <p className="text-muted-foreground px-4">
                            Your password has been successfully updated. You can now login with your new password.
                        </p>
                    </div>
                    <ActionButton onClick={() => navigate("/login")} fullWidth className="h-12 flex items-center justify-center gap-2">
                        Go to Login <ArrowRight className="w-4 h-4" />
                    </ActionButton>
                </div>
            </MobileLayout>
        );
    }

    return (
        <MobileLayout centered className="bg-background">
            <div className="w-full max-w-sm mx-auto space-y-8 py-10">
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-20 h-20 bg-card rounded-2xl p-4 shadow-lg border border-border/50">
                        <img src="/logo.png" alt="OralScan AI" className="w-full h-full object-contain" />
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">Set New Password</h1>
                        <p className="text-sm text-muted-foreground px-4">
                            Please choose a strong password to protect your account.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleReset} className="space-y-6 animate-slide-up">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">New Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    className="pl-9 pr-10 h-12"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="confirmPassword"
                                    type={showPassword ? "text" : "password"}
                                    className="pl-9 h-12"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>

                    <ActionButton type="submit" fullWidth loading={loading} className="h-12 shadow-lg shadow-primary/20">
                        Reset Password
                    </ActionButton>

                    <div className="text-center">
                        <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-primary">
                            Cancel and return to login
                        </Link>
                    </div>
                </form>
            </div>
        </MobileLayout>
    );
}
