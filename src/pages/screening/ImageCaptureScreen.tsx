import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProgressSteps } from "@/components/layout/ProgressSteps";
import { useScreening } from "@/contexts/ScreeningContext";
import { Camera, Upload, RefreshCw, CheckCircle, VideoOff, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function ImageCaptureScreen() {
  const navigate = useNavigate();
  const { data: screeningData, updateData } = useScreening();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Check that patient details exist
  useEffect(() => {
    if (!screeningData.patientId) {
      toast.error("Please complete patient details first");
      navigate("/screening/patient-details");
    }
  }, []);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) { toast.error("Please select an image file"); return; }
    if (file.size > 10 * 1024 * 1024) { toast.error("Image must be under 10MB"); return; }
    const reader = new FileReader();
    reader.onload = (e) => setCapturedImage(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleOpenCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 960 } },
      });
      streamRef.current = stream;
      setShowCamera(true);
      // Attach to video after state update
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 100);
    } catch (error) {
      if (error instanceof Error && error.name === "NotAllowedError") {
        setCameraError("Camera access denied. Please allow camera permission in your browser settings.");
        toast.error("Camera access denied. Please check browser permissions.");
      } else {
        setCameraError("Failed to open camera. Your device may not support camera access.");
        toast.error("Failed to open camera.");
      }
    }
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    const imageData = canvas.toDataURL("image/jpeg", 0.9);
    setCapturedImage(imageData);
    stopCamera();
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  useEffect(() => {
    return () => { stopCamera(); };
  }, []);

  const handleProceed = () => {
    if (!capturedImage) { toast.error("Please capture or upload an image first"); return; }
    updateData({ imageUrl: capturedImage });
    navigate("/screening/processing");
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-foreground uppercase tracking-tight">Image Acquisition</h1>
            <p className="text-muted-foreground font-medium text-lg">Synchronizing clinical visual assets for multi-modal AI inference.</p>
          </div>
          <div className="w-full md:max-w-xs text-right">
             <ProgressSteps currentStep={5} totalSteps={7} />
          </div>
        </div>

        <canvas ref={canvasRef} className="hidden" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-fade-in">
          {/* Left: Interactive Viewfinder */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative group perspective-1000">
               <div className="absolute -inset-1 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-[3rem] blur-xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
               <div className="relative bg-slate-950 rounded-[3rem] aspect-square flex items-center justify-center border-[6px] border-slate-900 overflow-hidden shadow-2xl ring-1 ring-white/10">
                 {showCamera ? (
                   <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                 ) : capturedImage ? (
                   <div className="relative w-full h-full animate-in zoom-in-110 duration-500">
                     <img src={capturedImage} alt="Captured Clinical Asset" className="w-full h-full object-cover" />
                     <div className="absolute inset-0 bg-black/20" />
                     <div className="absolute top-8 right-8 bg-success text-white rounded-2xl px-4 py-2 flex items-center gap-2 shadow-2xl font-black text-[10px] uppercase tracking-widest animate-in slide-in-from-top-4 duration-700">
                       <CheckCircle className="w-4 h-4" />
                       Asset Validated
                     </div>
                   </div>
                 ) : cameraError ? (
                   <div className="text-center p-12 space-y-6 animate-in fade-in duration-700">
                     <div className="w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center mx-auto border border-destructive/20 relative">
                        <VideoOff className="w-10 h-10 text-destructive" />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-destructive flex items-center justify-center shadow-lg">
                           <AlertCircle className="w-4 h-4 text-white" />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <p className="text-white font-black uppercase tracking-widest text-sm">Hardware Link Failure</p>
                        <p className="text-white/40 text-xs leading-relaxed max-w-xs mx-auto">{cameraError}</p>
                     </div>
                     <button 
                        onClick={handleOpenCamera}
                        className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-black text-[10px] uppercase tracking-widest transition-all"
                     >
                        Retry Hardware Initialization
                     </button>
                   </div>
                 ) : (
                   <div className="text-center p-12 space-y-8 animate-in fade-in duration-1000">
                     <div className="relative">
                        <div className="w-32 h-32 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-center mx-auto transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110">
                           <Camera className="w-12 h-12 text-white/20" />
                        </div>
                        <div className="absolute -inset-4 bg-primary/20 blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-1000" />
                     </div>
                     <div className="space-y-2">
                        <p className="text-white font-black uppercase tracking-[0.2em] text-sm">System Ready for Acquisition</p>
                        <p className="text-white/30 text-[10px] font-medium max-w-xs mx-auto leading-relaxed">
                           Awaiting clinical operator engagement to begin visual telemetry processing.
                        </p>
                     </div>
                   </div>
                 )}

                 {/* Viewfinder Overlays */}
                 <div className="absolute inset-0 pointer-events-none overflow-hidden">
                   {/* Rule of Thirds Grid */}
                   <div className="absolute inset-0 opacity-10">
                      <div className="absolute inset-y-0 left-1/3 w-px bg-white" />
                      <div className="absolute inset-y-0 left-2/3 w-px bg-white" />
                      <div className="absolute inset-x-0 top-1/3 h-px bg-white" />
                      <div className="absolute inset-x-0 top-2/3 h-px bg-white" />
                   </div>

                   {/* Corner Accents */}
                   <div className="absolute top-10 left-10 w-12 h-12 border-t-4 border-l-4 border-white/20 rounded-tl-xl" />
                   <div className="absolute top-10 right-10 w-12 h-12 border-t-4 border-r-4 border-white/20 rounded-tr-xl" />
                   <div className="absolute bottom-10 left-10 w-12 h-12 border-b-4 border-l-4 border-white/20 rounded-bl-xl" />
                   <div className="absolute bottom-10 right-10 w-12 h-12 border-b-4 border-r-4 border-white/20 rounded-br-xl" />

                   {/* Scanning Beam (Active Camera Only) */}
                   {showCamera && (
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 animate-scan" />
                   )}
                 </div>
               </div>
            </div>

            <div className="flex items-center justify-between px-8 py-4 bg-secondary/10 rounded-2xl border border-border/40">
               <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${showCamera ? "bg-destructive animate-pulse" : "bg-muted"}`} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                     {showCamera ? "Live Telemetry Feed" : "Acquired Snapshot State"}
                  </span>
               </div>
               <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                  Res: 1280 x 960 • RGB 8-bit
               </p>
            </div>
          </div>

          {/* Right: Operations Control */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="space-y-12">
               <div className="space-y-4">
                  <h3 className="text-3xl font-black text-foreground uppercase tracking-tight">Control Interface</h3>
                  <p className="text-muted-foreground font-medium text-lg leading-relaxed">
                     Select input methodology for clinical asset ingestion.
                  </p>
               </div>

               <div className="space-y-6">
                 {showCamera ? (
                   <div className="grid grid-cols-1 gap-4">
                     <button
                       onClick={handleCapture}
                       className="group relative h-24 rounded-[2rem] bg-primary text-primary-foreground overflow-hidden shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                     >
                       <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                       <div className="relative flex items-center justify-center gap-4">
                          <Camera className="w-8 h-8 transition-transform group-hover:scale-110" />
                          <span className="text-xl font-black tracking-[0.2em] uppercase">Capture Frame</span>
                       </div>
                     </button>
                     <button
                       onClick={stopCamera}
                       className="h-20 rounded-[2rem] border-2 border-border bg-secondary/5 text-foreground font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-secondary/20 transition-all"
                     >
                        <VideoOff className="w-5 h-5 opacity-40" />
                        Terminate Feed
                     </button>
                   </div>
                 ) : (
                   <div className="grid grid-cols-1 gap-4">
                     <button
                       onClick={handleOpenCamera}
                       className="group h-24 rounded-[2rem] border-2 border-primary bg-primary/5 text-primary flex items-center justify-between px-10 hover:bg-primary hover:text-white transition-all duration-500 shadow-lg shadow-primary/10"
                     >
                       <div className="text-left">
                          <p className="text-lg font-black uppercase tracking-widest">Active Camera</p>
                          <p className="text-[10px] font-black opacity-60 uppercase tracking-widest">Direct Hardware Access</p>
                       </div>
                       <Camera className="w-10 h-10 group-hover:rotate-12 transition-transform" />
                     </button>
                     <button
                       onClick={() => fileInputRef.current?.click()}
                       className="group h-24 rounded-[2rem] border-2 border-border bg-secondary/5 text-foreground flex items-center justify-between px-10 hover:border-primary/50 transition-all duration-500"
                     >
                       <div className="text-left">
                          <p className="text-lg font-black uppercase tracking-widest">Digital Upload</p>
                          <p className="text-[10px] font-black opacity-40 uppercase tracking-widest">Local Asset Explorer</p>
                       </div>
                       <Upload className="w-10 h-10 text-muted-foreground group-hover:text-primary transition-all" />
                     </button>
                   </div>
                 )}

                 {capturedImage && !showCamera && (
                   <button
                     onClick={() => setCapturedImage(null)}
                     className="w-full h-16 rounded-2xl border-2 border-dashed border-border flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:bg-secondary/20 hover:border-primary/40 transition-all"
                   >
                     <RefreshCw className="w-4 h-4" />
                     Dispose Current Asset & Retry
                   </button>
                 )}
               </div>

               <div className="space-y-6">
                  <div className="p-8 bg-info/5 border-2 border-info/10 rounded-[2.5rem] space-y-4">
                     <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-info rounded-full" />
                        <h4 className="text-[10px] font-black text-info uppercase tracking-widest">Clinical Advisory</h4>
                     </div>
                     <p className="text-xs text-muted-foreground font-medium leading-relaxed italic">
                        "For AI-assisted lesion segmentation, ensure the FOV is centered on the suspected region 
                        with macro focal engagement."
                     </p>
                  </div>
               </div>
            </div>

            <div className="pt-12 flex items-center justify-between gap-6 border-t border-border/40 mt-12">
               <button 
                onClick={() => { stopCamera(); navigate("/screening/capture-guide"); }}
                className="px-8 py-5 rounded-2xl font-black text-muted-foreground hover:bg-secondary transition-all text-xs uppercase tracking-widest"
              >
                RETURN TO GUIDE
              </button>
              <button 
                onClick={handleProceed} 
                disabled={!capturedImage || showCamera}
                className={`flex-1 py-6 rounded-[2rem] font-black tracking-[0.3em] uppercase transition-all shadow-2xl shadow-primary/30 ${
                  capturedImage && !showCamera
                    ? "bg-primary text-primary-foreground hover:scale-[1.02] active:scale-[0.98]" 
                    : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                }`}
              >
                ANALYSE ASSET
              </button>
            </div>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
        />
      </div>
    </DashboardLayout>
  );
}
