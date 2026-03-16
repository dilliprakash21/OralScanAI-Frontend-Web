import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { ActionButton } from "@/components/ui/ActionButton";
import { ProgressSteps } from "@/components/layout/ProgressSteps";
import { useScreening } from "@/contexts/ScreeningContext";
import { Camera, Upload, RefreshCw, CheckCircle, VideoOff } from "lucide-react";
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
    <MobileLayout className="pb-6">
      <ScreenHeader title="Image Capture" onBack={() => { stopCamera(); navigate("/screening/capture-guide"); }} />
      <ProgressSteps currentStep={5} totalSteps={8} />
      <canvas ref={canvasRef} className="hidden" />

      <div className="px-4 pt-4 space-y-5 animate-fade-in">
        {/* Camera Preview / Captured Image */}
        <div className="bg-black rounded-2xl aspect-[4/3] flex items-center justify-center border-2 border-primary/30 relative overflow-hidden">
          {showCamera ? (
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          ) : capturedImage ? (
            <>
              <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
              <div className="absolute top-3 right-3 bg-success rounded-full p-1">
                <CheckCircle className="w-5 h-5 text-success-foreground" />
              </div>
            </>
          ) : cameraError ? (
            <div className="text-center text-muted-foreground px-4">
              <VideoOff className="w-10 h-10 text-destructive/60 mx-auto mb-2" />
              <p className="text-white/60 text-sm">{cameraError}</p>
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3">
                <Camera className="w-8 h-8 text-white/60" />
              </div>
              <p className="text-white/60 text-sm">No image captured</p>
              <p className="text-white/40 text-xs mt-1">Use camera or upload from gallery</p>
            </div>
          )}
        </div>

        {/* Capture/Take Photo Buttons */}
        {showCamera ? (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleCapture}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-primary bg-primary/5 hover:bg-primary/10 transition-colors"
            >
              <Camera className="w-6 h-6 text-primary" />
              <span className="text-sm font-semibold text-primary">Take Photo</span>
            </button>
            <button
              onClick={stopCamera}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-border hover:border-destructive/50 transition-colors"
            >
              <VideoOff className="w-6 h-6 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">Cancel</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleOpenCamera}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-primary bg-primary/5 hover:bg-primary/10 transition-colors"
            >
              <Camera className="w-6 h-6 text-primary" />
              <span className="text-sm font-semibold text-primary">Open Camera</span>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-border hover:border-primary/50 transition-colors"
            >
              <Upload className="w-6 h-6 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">Upload Photo</span>
            </button>
          </div>
        )}

        {/* Hidden file input - gallery only */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
        />

        {capturedImage && !showCamera && (
          <button
            onClick={() => setCapturedImage(null)}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-border text-sm text-muted-foreground hover:bg-muted/50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Retake / Replace Image
          </button>
        )}

        <ActionButton onClick={handleProceed} disabled={!capturedImage || showCamera}>
          Analyse Image
        </ActionButton>
      </div>
    </MobileLayout>
  );
}
