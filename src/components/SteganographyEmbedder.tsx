"use client";

import type React from "react";

import { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Upload,
  FileAudio,
  File,
  Lock,
  Settings,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { AudioPlayer } from "@/components/AudioPlayer";

interface EmbeddingState {
  coverFile: File | null;
  secretFile: File | null;
  password: string;
  lsbBits: string;
  encrypt: boolean;
  randomStart: boolean;
  processing: boolean;
  result: {
    success: boolean;
    message: string;
    stegoFile?: Blob;
    psnr?: number;
  } | null;
}

export function SteganographyEmbedder() {
  const [state, setState] = useState<EmbeddingState>({
    coverFile: null,
    secretFile: null,
    password: "",
    lsbBits: "2",
    encrypt: false,
    randomStart: false,
    processing: false,
    result: null,
  });

  const coverFileRef = useRef<HTMLInputElement>(null);
  const secretFileRef = useRef<HTMLInputElement>(null);

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("audio/")) {
      setState((prev) => ({ ...prev, coverFile: file, result: null }));
    }
  };

  const handleSecretFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setState((prev) => ({ ...prev, secretFile: file, result: null }));
    }
  };

  const calculateCapacity = () => {
    if (!state.coverFile) return 0;
    // Rough estimation: MP3 files typically have ~1.4MB per minute
    // With LSB steganography, capacity depends on sample rate and LSB bits used
    const estimatedSamples = (state.coverFile.size / 1000) * 44100; // Rough estimate
    const bitsPerSample = Number.parseInt(state.lsbBits);
    return Math.floor((estimatedSamples * bitsPerSample) / 8); // Convert to bytes
  };

  const canHideFile = () => {
    if (!state.coverFile || !state.secretFile) return false;
    const capacity = calculateCapacity();
    return state.secretFile.size <= capacity;
  };

  const handleHideFile = async () => {
    if (!state.coverFile || !state.secretFile || !state.password) return;

    setState((prev) => ({ ...prev, processing: true, result: null }));

    try {
      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In a real implementation, this would call your Python backend
      // For demo purposes, we'll simulate success
      const mockPsnr = Math.random() * 20 + 40; // Random PSNR between 40-60 dB

      setState((prev) => ({
        ...prev,
        processing: false,
        result: {
          success: true,
          message: `File successfully hidden! PSNR: ${mockPsnr.toFixed(2)} dB`,
          stegoFile: new Blob([new ArrayBuffer(state.coverFile!.size)], {
            type: "audio/mpeg",
          }),
          psnr: mockPsnr,
        },
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        processing: false,
        result: {
          success: false,
          message:
            "Failed to hide file. Please check your inputs and try again.",
        },
      }));
    }
  };

  const downloadStegoFile = () => {
    if (!state.result?.stegoFile) return;

    const url = URL.createObjectURL(state.result.stegoFile);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stego_${state.coverFile?.name || "audio.mp3"}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* File Upload Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Cover Audio File */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileAudio className="w-5 h-5" />
              Cover Audio File
            </CardTitle>
            <CardDescription>
              Select an MP3 file to use as cover audio (mono or stereo)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div
                className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
                onClick={() => coverFileRef.current?.click()}
              >
                {state.coverFile ? (
                  <div className="space-y-2">
                    <FileAudio className="w-8 h-8 text-primary mx-auto" />
                    <p className="font-medium">{state.coverFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(state.coverFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto" />
                    <p className="text-muted-foreground">
                      Click to upload MP3 file
                    </p>
                  </div>
                )}
              </div>
              <input
                ref={coverFileRef}
                type="file"
                accept="audio/mpeg,audio/mp3"
                onChange={handleCoverFileChange}
                className="hidden"
              />
              {state.coverFile && (
                <AudioPlayer file={state.coverFile} title="Cover Audio" />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Secret File */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <File className="w-5 h-5" />
              Secret File
            </CardTitle>
            <CardDescription>
              Select any file to hide inside the audio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div
                className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
                onClick={() => secretFileRef.current?.click()}
              >
                {state.secretFile ? (
                  <div className="space-y-2">
                    <File className="w-8 h-8 text-primary mx-auto" />
                    <p className="font-medium">{state.secretFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(state.secretFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto" />
                    <p className="text-muted-foreground">
                      Click to upload any file
                    </p>
                  </div>
                )}
              </div>
              <input
                ref={secretFileRef}
                type="file"
                onChange={handleSecretFileChange}
                className="hidden"
              />

              {/* Capacity Check */}
              {state.coverFile && state.secretFile && (
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span>Capacity Check:</span>
                    {canHideFile() ? (
                      <span className="text-green-600 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        File fits
                      </span>
                    ) : (
                      <span className="text-destructive flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        File too large
                      </span>
                    )}
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Estimated capacity:{" "}
                    {(calculateCapacity() / 1024).toFixed(2)} KB
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Settings Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Steganography Settings
          </CardTitle>
          <CardDescription>
            Configure encryption and LSB settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password (Stego Key)</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter a strong password"
              value={state.password}
              onChange={(e) =>
                setState((prev) => ({ ...prev, password: e.target.value }))
              }
            />
          </div>

          {/* LSB Bits */}
          <div className="space-y-2">
            <Label htmlFor="lsb-bits">LSB Bits (1-4)</Label>
            <Select
              value={state.lsbBits}
              onValueChange={(value) =>
                setState((prev) => ({ ...prev, lsbBits: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">
                  1 bit (highest quality, lowest capacity)
                </SelectItem>
                <SelectItem value="2">2 bits (balanced)</SelectItem>
                <SelectItem value="3">
                  3 bits (lower quality, higher capacity)
                </SelectItem>
                <SelectItem value="4">
                  4 bits (lowest quality, highest capacity)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Options */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="encrypt"
                checked={state.encrypt}
                onCheckedChange={(checked) =>
                  setState((prev) => ({ ...prev, encrypt: !!checked }))
                }
              />
              <Label htmlFor="encrypt" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Encrypt the file before hiding
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="random-start"
                checked={state.randomStart}
                onCheckedChange={(checked) =>
                  setState((prev) => ({ ...prev, randomStart: !!checked }))
                }
              />
              <Label htmlFor="random-start">
                Start hiding at a random position
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleHideFile}
          disabled={
            !state.coverFile ||
            !state.secretFile ||
            !state.password ||
            !canHideFile() ||
            state.processing
          }
          size="lg"
          className="min-w-48"
        >
          {state.processing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
              Processing...
            </>
          ) : (
            "Hide File in Audio"
          )}
        </Button>
      </div>

      {/* Processing Progress */}
      {state.processing && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing steganography...</span>
                <span>Please wait</span>
              </div>
              <Progress value={undefined} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {state.result && (
        <Alert
          className={
            state.result.success
              ? "border-green-200 bg-green-50"
              : "border-destructive bg-destructive/10"
          }
        >
          <div className="flex items-start gap-2">
            {state.result.success ? (
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
            )}
            <div className="flex-1">
              <AlertDescription
                className={
                  state.result.success ? "text-green-800" : "text-destructive"
                }
              >
                {state.result.message}
              </AlertDescription>
              {state.result.success && state.result.stegoFile && (
                <div className="mt-4 flex gap-3">
                  <Button
                    onClick={downloadStegoFile}
                    variant="outline"
                    size="sm"
                  >
                    Download Stego Audio
                  </Button>
                  <AudioPlayer
                    file={state.result.stegoFile}
                    title="Stego Audio"
                  />
                </div>
              )}
            </div>
          </div>
        </Alert>
      )}
    </div>
  );
}
