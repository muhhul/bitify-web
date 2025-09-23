"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileAudio, Download, Key, CheckCircle, AlertCircle, FileText } from "lucide-react"
import { AudioPlayer } from "@/components/audio-player"

interface FileExtractState {
  stegoFile: File | null
  password: string
  processing: boolean
  result: {
    success: boolean
    message: string
    extractedFile?: {
      name: string
      size: number
      blob: Blob
      type: string
    }
    metadata?: {
      originalName: string
      wasEncrypted: boolean
      extractionTime: number
    }
  } | null
}

export function FileExtractInterface() {
  const [state, setState] = useState<FileExtractState>({
    stegoFile: null,
    password: "",
    processing: false,
    result: null,
  })

  const stegoFileRef = useRef<HTMLInputElement>(null)

  const handleStegoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("audio/")) {
      setState((prev) => ({ ...prev, stegoFile: file, result: null }))
    }
  }

  const handleExtractFile = async () => {
    if (!state.stegoFile || !state.password) return

    setState((prev) => ({ ...prev, processing: true, result: null }))

    try {
      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 2500))

      // In a real implementation, this would call your Python backend
      // For demo purposes, we'll simulate successful extraction
      const mockExtractedFile = {
        name: "secret-document.pdf",
        size: 245760, // ~240 KB
        blob: new Blob(["Mock extracted file content"], { type: "application/pdf" }),
        type: "application/pdf",
      }

      const mockMetadata = {
        originalName: "secret-document.pdf",
        wasEncrypted: Math.random() > 0.5, // Random for demo
        extractionTime: Date.now(),
      }

      setState((prev) => ({
        ...prev,
        processing: false,
        result: {
          success: true,
          message: "File successfully extracted from stego audio!",
          extractedFile: mockExtractedFile,
          metadata: mockMetadata,
        },
      }))
    } catch (error) {
      setState((prev) => ({
        ...prev,
        processing: false,
        result: {
          success: false,
          message: "Failed to extract file. Please check your password and try again.",
        },
      }))
    }
  }

  const downloadExtractedFile = () => {
    if (!state.result?.extractedFile) return

    const url = URL.createObjectURL(state.result.extractedFile.blob)
    const a = document.createElement("a")
    a.href = url
    a.download = state.result.extractedFile.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return "🖼️"
    if (type.startsWith("text/")) return "📄"
    if (type.includes("pdf")) return "📕"
    if (type.includes("word")) return "📘"
    if (type.includes("excel")) return "📊"
    return "📁"
  }

  return (
    <div className="space-y-6">
      {/* Stego Audio File Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileAudio className="w-5 h-5" />
            Stego Audio File
          </CardTitle>
          <CardDescription>Select the MP3 file that contains hidden data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div
              className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
              onClick={() => stegoFileRef.current?.click()}
            >
              {state.stegoFile ? (
                <div className="space-y-3">
                  <FileAudio className="w-12 h-12 text-primary mx-auto" />
                  <div>
                    <p className="font-medium text-lg">{state.stegoFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(state.stegoFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto" />
                  <div>
                    <p className="text-lg font-medium text-muted-foreground">Drop your stego audio file here</p>
                    <p className="text-sm text-muted-foreground">or click to browse</p>
                  </div>
                </div>
              )}
            </div>
            <input
              ref={stegoFileRef}
              type="file"
              accept="audio/mpeg,audio/mp3"
              onChange={handleStegoFileChange}
              className="hidden"
            />
            {state.stegoFile && <AudioPlayer file={state.stegoFile} title="Stego Audio" />}
          </div>
        </CardContent>
      </Card>

      {/* Password Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Authentication
          </CardTitle>
          <CardDescription>Enter the same password used to hide the file</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="extract-password">Password (Stego Key)</Label>
            <Input
              id="extract-password"
              type="password"
              placeholder="Enter the password used during hiding"
              value={state.password}
              onChange={(e) => setState((prev) => ({ ...prev, password: e.target.value }))}
              className="text-lg py-3"
            />
            <p className="text-sm text-muted-foreground">This must match the password used when hiding the file</p>
          </div>
        </CardContent>
      </Card>

      {/* Action Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleExtractFile}
          disabled={!state.stegoFile || !state.password || state.processing}
          size="lg"
          className="min-w-48"
        >
          {state.processing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
              Extracting...
            </>
          ) : (
            "Extract Hidden File"
          )}
        </Button>
      </div>

      {/* Processing Progress */}
      {state.processing && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Analyzing stego audio...</span>
                <span>Please wait</span>
              </div>
              <Progress value={undefined} className="w-full" />
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Reading LSB data from audio samples</p>
                <p>• Reconstructing file header</p>
                <p>• Decrypting data (if encrypted)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {state.result && (
        <Alert
          className={state.result.success ? "border-green-200 bg-green-50" : "border-destructive bg-destructive/10"}
        >
          <div className="flex items-start gap-3">
            {state.result.success ? (
              <CheckCircle className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-6 h-6 text-destructive mt-0.5 flex-shrink-0" />
            )}
            <div className="flex-1 space-y-3">
              <AlertDescription className={state.result.success ? "text-green-800" : "text-destructive"}>
                {state.result.message}
              </AlertDescription>

              {state.result.success && state.result.extractedFile && (
                <div className="space-y-4">
                  {/* File Info */}
                  <Card className="bg-white border-green-200">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{getFileIcon(state.result.extractedFile.type)}</div>
                        <div className="flex-1">
                          <p className="font-medium text-green-800">{state.result.extractedFile.name}</p>
                          <p className="text-sm text-green-600">
                            {(state.result.extractedFile.size / 1024).toFixed(2)} KB • {state.result.extractedFile.type}
                          </p>
                        </div>
                        <Button onClick={downloadExtractedFile} size="sm" className="bg-green-600 hover:bg-green-700">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Metadata */}
                  {state.result.metadata && (
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-green-700">
                        <FileText className="w-4 h-4" />
                        <span>Original name: {state.result.metadata.originalName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-green-700">
                        {state.result.metadata.wasEncrypted ? (
                          <>
                            <Key className="w-4 h-4" />
                            <span>File was encrypted</span>
                          </>
                        ) : (
                          <>
                            <FileText className="w-4 h-4" />
                            <span>File was not encrypted</span>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </Alert>
      )}

      {/* Help Section */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-base">Extraction Tips</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>• Make sure you're using the exact same password that was used to hide the file</p>
          <p>• The stego audio file should be the output from the "Hide Files" process</p>
          <p>• If extraction fails, verify the file hasn't been compressed or modified</p>
          <p>• Large files may take longer to extract depending on the LSB settings used</p>
        </CardContent>
      </Card>
    </div>
  )
}
