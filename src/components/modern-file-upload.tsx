"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, FileAudio, File, X, CheckCircle2, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface ModernFileUploadProps {
  accept?: string
  onFileSelect: (file: File | null) => void
  selectedFile?: File | null
  title: string
  description: string
  icon: React.ReactNode
  maxSize?: number
  className?: string
}

export function ModernFileUpload({
  accept,
  onFileSelect,
  selectedFile,
  title,
  description,
  icon,
  maxSize = 50 * 1024 * 1024, // 50MB default
  className,
}: ModernFileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelection(files[0])
    }
  }, [])

  const handleFileSelection = async (file: File) => {
    if (file.size > maxSize) {
      // Handle file too large error
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    const totalDuration = 1500
    const intervalTime = 50
    const increment = 100 / (totalDuration / intervalTime)

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        const next = prev + increment + Math.random() * 5
        if (next >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setIsUploading(false)
            onFileSelect(file)
          }, 200)
          return 100
        }
        return next
      })
    }, intervalTime)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelection(file)
    }
  }

  const removeFile = () => {
    onFileSelect(null)
    setUploadProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <Card
      className={cn(
        "group transition-all duration-500 hover:shadow-2xl glass border-0 overflow-hidden",
        selectedFile && "ring-2 ring-primary/20 shadow-lg shadow-primary/10",
        className,
      )}
    >
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "p-3 rounded-xl bg-gradient-to-br transition-all duration-500",
                selectedFile
                  ? "from-primary to-accent text-white shadow-lg shadow-primary/25 animate-glow"
                  : "from-primary/10 to-accent/10 text-primary group-hover:from-primary/20 group-hover:to-accent/20",
              )}
            >
              {selectedFile ? <CheckCircle2 className="w-6 h-6" /> : icon}
            </div>
            <div>
              <h3
                className={cn(
                  "font-semibold transition-colors duration-300",
                  selectedFile ? "text-primary" : "text-card-foreground",
                )}
              >
                {title}
              </h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>

          {!selectedFile ? (
            <div
              className={cn(
                "relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-500",
                "hover:border-primary hover:bg-gradient-to-br hover:from-primary/5 hover:to-accent/5 hover:scale-[1.02] hover:shadow-lg",
                isDragOver &&
                  "border-primary bg-gradient-to-br from-primary/10 to-accent/10 scale-[1.02] shadow-lg shadow-primary/20",
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                onChange={handleFileInputChange}
                className="hidden"
              />

              <div className="space-y-4">
                <div
                  className={cn(
                    "mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br flex items-center justify-center transition-all duration-500 relative",
                    isDragOver || isHovered
                      ? "from-primary/20 to-accent/20 scale-110 shadow-lg"
                      : "from-muted/50 to-muted/30 scale-100",
                  )}
                >
                  <Upload
                    className={cn(
                      "w-10 h-10 transition-all duration-500",
                      isDragOver || isHovered ? "text-primary scale-110" : "text-muted-foreground",
                    )}
                  />
                  {(isDragOver || isHovered) && (
                    <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-accent animate-pulse" />
                  )}
                </div>

                <div>
                  <p
                    className={cn(
                      "text-lg font-medium transition-colors duration-300",
                      isDragOver ? "text-primary" : "text-card-foreground",
                    )}
                  >
                    {isDragOver ? "Drop your file here" : "Drag & drop your file here"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    or <span className="text-primary font-medium hover:underline">browse files</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">Max size: {formatFileSize(maxSize)}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-slide-up">
              {isUploading ? (
                <div className="space-y-4 p-4 glass rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-pulse">
                      <File className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-card-foreground">{selectedFile.name}</p>
                      <p className="text-sm text-primary animate-pulse">Processing file...</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Progress value={uploadProgress} className="h-3 bg-muted/30" />
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-muted-foreground">{Math.round(uploadProgress)}% complete</p>
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            className="w-1 h-1 bg-primary rounded-full animate-pulse"
                            style={{ animationDelay: `${i * 0.2}s` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl border border-primary/20 animate-slide-up">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg animate-glow">
                    {selectedFile.type.startsWith("audio/") ? (
                      <FileAudio className="w-6 h-6 text-white" />
                    ) : (
                      <File className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-card-foreground">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-xs font-medium text-green-500">Ready</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removeFile}
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-300"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
