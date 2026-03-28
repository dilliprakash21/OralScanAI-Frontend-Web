import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { ActionButton } from "@/components/ui/ActionButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { Lock, Eye, EyeOff, ChevronRight, ShieldAlert, ArrowLeft } from "lucide-react";

export default function ChangePasswordScreen() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [showPasswords, setShowPasswords] = useState(false);

    const [formData, setFormData] = useState({
        current_password: "",
        new_password: "",
        confirm_password: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.new_password !== formData.confirm_password) {
            toast({ title: "Validation Error", description: "Verification keys do not match.", variant: "destructive" });
            return;
        }
        if (formData.new_password.length < 6) {
            toast({ title: "Insufficient Complexity", description: "Key must be at least 6 characters.", variant: "destructive" });
            return;
        }

        setLoading(true);
        try {
            await api.auth.changePassword({
                current_password: formData.current_password,
                new_password: formData.new_password,
            });
            toast({ title: "Registry Synchronized", description: "Your verification key has been updated." });
            navigate("/settings");
        } catch (err: any) {
            toast({ title: "Update Failed", description: err.message || "Could not authorize credential change.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout 
            title="Credential Update" 
            subtitle="Securely synchronize a new verification key for your account."
        >
            <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex flex-col items-center justify-center py-2">
                    <div className="w-20 h-20 bg-primary/5 border-2 border-primary/20 rounded-[2rem] flex items-center justify-center mb-6 shadow-xl animate-pulse-slow">
                        <ShieldAlert className="w-10 h-10 text-primary" />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Current Verification Key</Label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                                type={showPasswords ? "text" : "password"}
                                required
                                value={formData.current_password}
                                onChange={(e) => setFormData({ ...formData, current_password: e.target.value })}
                                className="pl-12 pr-12 h-16 bg-secondary/5 border-2 border-border/50 focus:border-primary/50 rounded-2xl transition-all"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                onClick={() => setShowPasswords(!showPasswords)}
                            >
                                {showPasswords ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-border/30">
                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">New Verification Key</Label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input
                                    type={showPasswords ? "text" : "password"}
                                    required
                                    value={formData.new_password}
                                    onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
                                    className="pl-12 h-16 bg-secondary/5 border-2 border-border/50 focus:border-primary/50 rounded-2xl transition-all"
                                    placeholder="Minimum 6 characters"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Validate New Key</Label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input
                                    type={showPasswords ? "text" : "password"}
                                    required
                                    value={formData.confirm_password}
                                    onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                                    className="pl-12 h-16 bg-secondary/5 border-2 border-border/50 focus:border-primary/50 rounded-2xl transition-all"
                                    placeholder="Match new key"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    <ActionButton 
                        type="submit" 
                        loading={loading} 
                        fullWidth
                        className="h-20 text-lg font-black tracking-[0.2em] uppercase rounded-[1.5rem] shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                        icon={!loading && <ChevronRight className="w-6 h-6" />}
                    >
                        Update Registry
                    </ActionButton>
                </div>

                <div className="text-center pt-2">
                    <button 
                        onClick={() => navigate("/settings")}
                        className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-2 mx-auto"
                    >
                        <ArrowLeft className="w-3 h-3" /> Cancel Update
                    </button>
                </div>
            </form>
        </AuthLayout>
    );
}
