import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { ActionButton } from "@/components/ui/ActionButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";

export default function EditProfileScreen() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile, refresh } = useAuth();

  const [name, setName] = useState(profile?.name ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [clinic, setClinic] = useState(profile?.clinic ?? "");
  const [location, setLocation] = useState(profile?.location ?? "");
  const [hospital, setHospital] = useState(profile?.hospital ?? "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? "");
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setName(profile?.name ?? "");
    setPhone(profile?.phone ?? "");
    setClinic(profile?.clinic ?? "");
    setLocation(profile?.location ?? "");
    setHospital(profile?.hospital ?? "");
    setAvatarUrl(profile?.avatar_url ?? "");
  }, [profile]);

  const handlePick = () => fileRef.current?.click();

  const handleUpload = async (file: File) => {
    try {
      const res = await api.profile.uploadAvatar(file);
      setAvatarUrl(res.avatar_url);
      toast({ title: "Avatar uploaded" });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err?.message, variant: "destructive" });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.profile.update({
        name: name.trim() || null,
        phone: phone.trim() || null,
        clinic: clinic.trim() || null,
        location: location.trim() || null,
        hospital: hospital.trim() || null,
        avatar_url: avatarUrl || null,
      });
      await refresh();
      toast({ title: "Profile updated" });
      navigate("/profile");
    } catch (err: any) {
      toast({ title: "Save failed", description: err?.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <MobileLayout>
      <ScreenHeader title="Edit Profile" onBack={() => navigate("/profile")} />

      <div className="p-4 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-muted overflow-hidden flex items-center justify-center">
            {avatarUrl ? (
              <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-sm text-muted-foreground">No photo</span>
            )}
          </div>
          <div>
            <button className="text-sm text-primary underline underline-offset-4" onClick={handlePick} type="button">
              Change photo
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleUpload(f);
                e.currentTarget.value = "";
              }}
            />
            <p className="text-xs text-muted-foreground mt-1">Stored on your Node server (/uploads)</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Full name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label>Phone</Label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label>Clinic</Label>
          <Input value={clinic} onChange={(e) => setClinic(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label>Location</Label>
          <Input value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label>Hospital</Label>
          <Input value={hospital} onChange={(e) => setHospital(e.target.value)} />
        </div>

        <ActionButton onClick={handleSave} fullWidth disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </ActionButton>
      </div>
    </MobileLayout>
  );
}
