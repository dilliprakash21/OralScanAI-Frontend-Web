import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { User, Camera, Loader2, CheckCircle } from "lucide-react";
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
    <DashboardLayout>
      <div className="max-w-5xl mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-foreground mb-1">Edit Clinical Profile</h1>
            <p className="text-muted-foreground font-medium">Keep your professional identity and facility information up to date</p>
          </div>
          <button 
            onClick={() => navigate("/profile")}
            className="px-6 py-3 rounded-2xl bg-secondary/50 font-black text-muted-foreground hover:bg-secondary transition-all"
          >
            CANCEL CHANGES
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-fade-in">
          {/* Left: Avatar & Identity Summary */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-card border border-border/50 rounded-[2.5rem] p-10 shadow-sm text-center space-y-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5">
                  <User className="w-32 h-32 text-primary" />
               </div>
               
               <div className="relative z-10 space-y-6">
                  <div className="relative inline-block group">
                     <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                     <div className="relative w-32 h-32 rounded-full border-4 border-background shadow-2xl overflow-hidden bg-secondary/50 flex items-center justify-center mx-auto">
                        {avatarUrl ? (
                          <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-16 h-16 text-primary" />
                        )}
                     </div>
                     <button 
                       onClick={handlePick}
                       className="absolute bottom-1 right-1 w-12 h-12 bg-primary text-white rounded-full border-4 border-background flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer"
                       title="Change Photo"
                     >
                        <Camera className="w-6 h-6" />
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
                  </div>
                  
                  <div className="space-y-2">
                     <h3 className="text-xl font-black text-foreground">Profile Image</h3>
                     <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                        Recommended: Square image, 400x400px. <br/>
                        Uploaded to global CDN infrastructure.
                     </p>
                  </div>
               </div>
            </div>

            <div className="p-8 bg-info/5 border-2 border-info/10 rounded-[2rem] space-y-4">
               <h5 className="font-black text-foreground flex items-center gap-2 uppercase tracking-widest text-xs">
                  <div className="w-1.5 h-4 bg-info rounded-full" />
                  Clinical Data Sovereignty
               </h5>
               <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                  Changes to your profile are synchronized across the OralScan AI network 
                  and will reflect on all generated clinical reports.
               </p>
            </div>
          </div>

          {/* Right: Detailed Form */}
          <div className="lg:col-span-8 space-y-8">
             <div className="bg-card border border-border/50 rounded-[2.5rem] p-8 md:p-12 shadow-sm space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-3">
                      <Label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest ml-1">Full Professional Name</Label>
                      <Input 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        className="h-14 rounded-2xl border-2 border-border/80 focus:border-primary bg-secondary/5 px-6 text-base font-bold transition-all outline-none"
                        placeholder="Dr. Jane Doe"
                      />
                   </div>
                   <div className="space-y-3">
                      <Label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest ml-1">Contact Phone</Label>
                      <Input 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                        className="h-14 rounded-2xl border-2 border-border/80 focus:border-primary bg-secondary/5 px-6 text-base font-bold transition-all outline-none"
                        placeholder="+91 00000 00000"
                      />
                   </div>
                   <div className="space-y-3">
                      <Label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest ml-1">Primary Clinic/Unit</Label>
                      <Input 
                        value={clinic} 
                        onChange={(e) => setClinic(e.target.value)} 
                        className="h-14 rounded-2xl border-2 border-border/80 focus:border-primary bg-secondary/5 px-6 text-base font-bold transition-all outline-none"
                        placeholder="Dental Care Unit A"
                      />
                   </div>
                   <div className="space-y-3">
                      <Label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest ml-1">Facility Hospital</Label>
                      <Input 
                        value={hospital} 
                        onChange={(e) => setHospital(e.target.value)} 
                        className="h-14 rounded-2xl border-2 border-border/80 focus:border-primary bg-secondary/5 px-6 text-base font-bold transition-all outline-none"
                        placeholder="Central District Hospital"
                      />
                   </div>
                </div>

                <div className="space-y-3">
                   <Label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest ml-1">Operational Location (City/Region)</Label>
                   <Input 
                     value={location} 
                     onChange={(e) => setLocation(e.target.value)} 
                     className="h-14 rounded-2xl border-2 border-border/80 focus:border-primary bg-secondary/5 px-6 text-base font-bold transition-all outline-none w-full"
                     placeholder="Nagpur, Maharashtra"
                   />
                </div>

                <div className="pt-6 border-t border-border/50">
                   <button 
                     onClick={handleSave} 
                     disabled={saving}
                     className="w-full py-5 rounded-[1.5rem] bg-primary text-primary-foreground font-black tracking-widest uppercase hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50"
                   >
                     {saving ? (
                        <>
                           <Loader2 className="w-6 h-6 animate-spin" />
                           SYNCHRONIZING PROFILE...
                        </>
                     ) : (
                        <>
                           <CheckCircle className="w-6 h-6" />
                           COMMIT CHANGES
                        </>
                     )}
                   </button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
