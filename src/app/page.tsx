"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FileUpload } from "@/components/FileUpload";
import { WaveformPlayer } from "@/components/WaveformPlayer";
import {
  Shield,
  FileAudio,
  File,
  Lock,
  BarChart3,
  Zap,
  Eye,
  Download,
  Settings,
  Star,
  Crown,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function BitifyApp() {
  const [activeTab, setActiveTab] = useState("hide");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [secretFile, setSecretFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState("");
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const handleCoverFileSelect = (file: File | null) => {
    setCoverFile(file);
    if (file && secretFile) {
      // Smooth transition to show both files are ready
      setTimeout(() => {
        const element = document.querySelector(".ready-indicator");
        element?.classList.add("animate-bounce");
      }, 300);
    }
  };

  const handleSecretFileSelect = (file: File | null) => {
    setSecretFile(file);
    if (file && coverFile) {
      // Smooth transition to show both files are ready
      setTimeout(() => {
        const element = document.querySelector(".ready-indicator");
        element?.classList.add("animate-bounce");
      }, 300);
    }
  };

  const handleHideFile = async () => {
    setIsProcessing(true);
    setProgress(0);

    const steps = [
      { step: "Analyzing audio file...", duration: 1000 },
      { step: "Preparing secret file...", duration: 800 },
      { step: "Applying LSB steganography...", duration: 1500 },
      { step: "Encrypting data...", duration: 1200 },
      { step: "Finalizing output...", duration: 800 },
    ];

    for (let i = 0; i < steps.length; i++) {
      setProcessingStep(steps[i].step);
      await new Promise((resolve) => setTimeout(resolve, steps[i].duration));
      setProgress((i + 1) * 20);
    }

    setIsComplete(true);
    setIsProcessing(false);

    // Auto transition to results tab
    setTimeout(() => {
      setActiveTab("results");
    }, 1000);
  };

  useEffect(() => {
    const createParticle = () => {
      const particle = document.createElement("div");
      particle.className = "particle";
      particle.style.left = Math.random() * 100 + "%";
      particle.style.animationDelay = Math.random() * 15 + "s";
      particle.style.animationDuration = Math.random() * 10 + 10 + "s";

      const particles = document.querySelector(".particles");
      if (particles) {
        particles.appendChild(particle);

        setTimeout(() => {
          particle.remove();
        }, 25000);
      }
    };

    const interval = setInterval(createParticle, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="particles" />

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 premium-gradient rounded-full blur-3xl opacity-20 animate-float" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-accent to-secondary rounded-full blur-3xl opacity-20 animate-float-delayed" />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-2xl animate-pulse-slow" />
        <div
          className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-tl from-secondary/10 to-primary/10 rounded-full blur-2xl animate-pulse-slow"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <header className="relative border-b border-border/30 glass luxury-shadow">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="flex items-center justify-center w-16 h-16 premium-gradient rounded-2xl luxury-shadow animate-glow">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-accent to-secondary rounded-full animate-pulse flex items-center justify-center">
                  <Crown className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold premium-text-gradient mb-1">
                  Bitify
                </h1>
                <p className="text-muted-foreground font-medium">
                  Audio Steganography Platform
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative container mx-auto px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 animate-slide-up">
            <div className="inline-flex items-center gap-3 px-6 py-3 glass rounded-full text-primary text-base font-semibold mb-8 hover-lift">
              <Zap className="w-5 h-5" />
              Next-Generation Steganography Technology
            </div>
            <h2 className="text-6xl font-bold text-foreground mb-8 text-balance leading-tight">
              Hide Files in Audio,{" "}
              <span className="premium-text-gradient">
                Extract Them Securely
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto text-pretty leading-relaxed mb-12">
              Experience the pinnacle of digital steganography with our advanced
              platform that seamlessly embeds secret files into MP3 audio files
              using encryption and customizable LSB settings. Redefine digital
              privacy with unparalleled sophistication.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {[
                "Encryption",
                "Advanced LSB Technology",
                "Real-time Quality Analysis",
                "Zero Quality Loss",
              ].map((feature, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="glass bg-white/50 border-primary/20 text-primary px-4 py-2 hover-lift"
                >
                  {feature}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-10 mb-20">
            {[
              {
                icon: <FileAudio className="w-7 h-7" />,
                title: "Hide Files",
                description:
                  "Embed any file type into MP3 audio with customizable LSB settings and optional encryption",
                color: "from-primary via-primary/80 to-accent",
                accent: "primary",
              },
              {
                icon: <Lock className="w-7 h-7" />,
                title: "Extract Files",
                description:
                  "Retrieve hidden files from stego-audio MP3s using the correct password and settings",
                color: "from-accent via-accent/80 to-secondary",
                accent: "accent",
              },
              {
                icon: <BarChart3 className="w-7 h-7" />,
                title: "Quality Analysis",
                description:
                  "Monitor audio quality with PSNR measurements and processing performance metrics",
                color: "from-secondary via-secondary/80 to-primary",
                accent: "secondary",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="group glass hover:glass-dark luxury-shadow hover-lift animate-slide-up border-0"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <CardHeader className="p-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={cn(
                        "p-4 rounded-2xl bg-gradient-to-br text-white luxury-shadow group-hover:scale-110 transition-all duration-500 animate-glow",
                        feature.color
                      )}
                    >
                      {feature.icon}
                    </div>
                    <CardTitle className="text-2xl font-bold">
                      {feature.title}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-base leading-relaxed text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <Card className="glass luxury-shadow animate-scale-in border-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
            <CardContent className="p-10 relative">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3 mb-8 glass p-2 h-16 border-0">
                  <TabsTrigger
                    value="hide"
                    className="text-lg font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-secondary data-[state=active]:to-primary data-[state=active]:text-white transition-all duration-500 rounded-xl hover:bg-gradient-to-r hover:from-secondary/20 hover:to-primary/20 hover:scale-105 hover:shadow-lg"
                  >
                    <Eye className="w-5 h-5 mr-3" />
                    Hide Files
                  </TabsTrigger>
                  <TabsTrigger
                    value="extract"
                    className="text-lg font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-secondary data-[state=active]:to-primary data-[state=active]:text-white transition-all duration-500 rounded-xl hover:bg-gradient-to-r hover:from-secondary/20 hover:to-primary/20 hover:scale-105 hover:shadow-lg"
                  >
                    <Download className="w-5 h-5 mr-3" />
                    Extract Files
                  </TabsTrigger>
                  <TabsTrigger
                    value="results"
                    className="text-lg font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-secondary data-[state=active]:to-primary data-[state=active]:text-white transition-all duration-500 rounded-xl hover:bg-gradient-to-r hover:from-secondary/20 hover:to-primary/20 hover:scale-105 hover:shadow-lg"
                  >
                    <BarChart3 className="w-5 h-5 mr-3" />
                    Results
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="hide" className="mt-12 space-y-12">
                  <div className="grid lg:grid-cols-2 gap-12">
                    <FileUpload
                      accept="audio/mpeg,audio/mp3"
                      onFileSelect={handleCoverFileSelect}
                      selectedFile={coverFile}
                      title="Cover Audio File"
                      description="Select an MP3 file to use as cover audio"
                      icon={<FileAudio className="w-6 h-6" />}
                      maxSize={100 * 1024 * 1024}
                    />

                    <FileUpload
                      onFileSelect={handleSecretFileSelect}
                      selectedFile={secretFile}
                      title="Secret File"
                      description="Select any file to hide inside the audio"
                      icon={<File className="w-6 h-6" />}
                      maxSize={10 * 1024 * 1024}
                    />
                  </div>

                  {coverFile && secretFile && (
                    <div className="ready-indicator flex items-center justify-center gap-4 p-6 glass rounded-2xl animate-slide-up">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                      <span className="text-lg font-semibold text-green-500">
                        Files Ready for Processing
                      </span>
                      <ArrowRight className="w-5 h-5 text-green-500 animate-pulse" />
                    </div>
                  )}

                  {coverFile && (
                    <WaveformPlayer
                      file={coverFile}
                      title="Cover Audio Preview"
                      className="animate-slide-up"
                    />
                  )}

                  {isProcessing && (
                    <div
                      className="fixed bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center animate-fade-in"
                      style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: -100,
                      }}
                    >
                      <Card className="glass luxury-shadow p-12 max-w-md w-full mx-4 animate-scale-in">
                        <div className="text-center space-y-6">
                          <div className="w-20 h-20 premium-gradient rounded-full flex items-center justify-center mx-auto animate-spin">
                            <Shield className="w-10 h-10 text-white" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold mb-2">
                              Processing Files
                            </h3>
                            <p className="text-muted-foreground mb-6">
                              {processingStep}
                            </p>
                            <Progress value={progress} className="w-full h-3" />
                            <p className="text-sm text-muted-foreground mt-2">
                              {progress}% Complete
                            </p>
                          </div>
                        </div>
                      </Card>
                    </div>
                  )}

                  <div className="flex justify-center pt-8">
                    <Button
                      size="lg"
                      className="px-16 py-8 text-xl premium-gradient hover:opacity-90 luxury-shadow hover-lift transition-all duration-500 rounded-2xl"
                      disabled={!coverFile || !secretFile || isProcessing}
                      onClick={handleHideFile}
                    >
                      <Shield className="w-6 h-6 mr-3" />
                      {isProcessing ? "Processing..." : "Hide File in Audio"}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="extract" className="mt-12">
                  <div className="text-center py-20">
                    <div className="w-32 h-32 glass rounded-full flex items-center justify-center mx-auto mb-8 luxury-shadow animate-glow">
                      <Download className="w-16 h-16 text-accent" />
                    </div>
                    <h3 className="text-3xl font-bold mb-6 premium-text-gradient">
                      Extract Hidden Files
                    </h3>
                    <p className="text-muted-foreground mb-12 max-w-lg mx-auto text-lg leading-relaxed">
                      Upload a stego-audio file to extract the hidden content
                      with the correct password.
                    </p>
                    <Button
                      variant="outline"
                      size="lg"
                      className="glass bg-transparent hover-lift px-8 py-4 text-lg"
                    >
                      Coming Soon
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="results" className="mt-12">
                  {isComplete ? (
                    <div className="text-center py-20 animate-slide-up">
                      <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 luxury-shadow animate-bounce">
                        <CheckCircle className="w-16 h-16 text-white" />
                      </div>
                      <h3 className="text-3xl font-bold mb-6 premium-text-gradient">
                        File Successfully Hidden!
                      </h3>
                      <p className="text-muted-foreground mb-12 max-w-lg mx-auto text-lg leading-relaxed">
                        Your secret file has been successfully embedded into the
                        audio file with zero quality loss.
                      </p>
                      <div className="flex gap-4 justify-center">
                        <Button
                          size="lg"
                          className="premium-gradient hover:opacity-90 luxury-shadow hover-lift px-8 py-4 text-lg"
                        >
                          <Download className="w-5 h-5 mr-2" />
                          Download Result
                        </Button>
                        <Button
                          variant="outline"
                          size="lg"
                          className="glass bg-transparent hover-lift px-8 py-4 text-lg"
                          onClick={() => {
                            setIsComplete(false);
                            setCoverFile(null);
                            setSecretFile(null);
                            setActiveTab("hide");
                          }}
                        >
                          Process Another File
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-20">
                      <div className="w-32 h-32 glass rounded-full flex items-center justify-center mx-auto mb-8 luxury-shadow animate-glow">
                        <BarChart3 className="w-16 h-16 text-secondary" />
                      </div>
                      <h3 className="text-3xl font-bold mb-6 premium-text-gradient">
                        Analysis Results
                      </h3>
                      <p className="text-muted-foreground mb-12 max-w-lg mx-auto text-lg leading-relaxed">
                        View detailed quality metrics and performance analysis
                        of your steganography operations.
                      </p>
                      <Button
                        variant="outline"
                        size="lg"
                        className="glass bg-transparent hover-lift px-8 py-4 text-lg"
                      >
                        No Results Yet
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
