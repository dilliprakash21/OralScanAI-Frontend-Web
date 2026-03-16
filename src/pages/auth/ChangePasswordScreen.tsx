import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { ActionButton } from "@/components/ui/ActionButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { Lock, Eye, EyeOff } from "lucide-react";

export default function ChangePasswordScreen() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);

    const [formData, setFormData] = useState({
        current_password: "",
        new_password: "",
        confirm_password: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.new_password !== formData.confirm_password) {
            toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
            return;
        }
        if (formData.new_password.length < 6) {
            toast({ title: "Error", description: "Password must be at least 6 characters", variant: "destructive" });
            return;
        }

        setLoading(true);
        try {
            await api.auth.changePassword({
                current_password: formData.current_password,
                new_password: formData.new_password,
            });
            toast({ title: "Success", description: "Password changed successfully" });
            navigate("/settings");
        } catch (err: any) {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <MobileLayout className="bg-background">
            <ScreenHeader title="Change Password" onBack={() => navigate("/settings")} />

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="flex flex-col items-center justify-center py-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <Lock className="w-8 h-8 text-primary" />
                    </div>
                    <p className="text-sm text-balance text-center text-muted-foreground">
                        Enter your current password and choose a new secure password.
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Current Password</Label>
                        <div className="relative">
                            <Input
                                type={showCurrent ? "text" : "password"}
                                required
                                value={formData.current_password}
                                onChange={(e) => setFormData({ ...formData, current_password: e.target.value })}
                                className="pr-10"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                onClick={() => setShowCurrent(!showCurrent)}
                            >
                                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>New Password</Label>
                        <div className="relative">
                            <Input
                                type={showNew ? "text" : "password"}
                                required
                                value={formData.new_password}
                                onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
                                className="pr-10"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                onClick={() => setShowNew(!showNew)}
                            >
                                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Confirm New Password</Label>
                        <Input
                            type="password"
                            required
                            value={formData.confirm_password}
                            onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                        />
                    </div>
                </div>

                <ActionButton type="submit" loading={loading} className="w-full mt-4">
                    Update Password
                </ActionButton>
            </form>
        </MobileLayout>
    );
}
