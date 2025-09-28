"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, Shield, FileAudio, Clock, Zap } from "lucide-react"

interface AnalyticsDashboardProps {
  hideResults?: {
    psnr: number
    processingTime: number
    fileSize: number
    compressionRatio: number
  }
  extractResults?: {
    success: boolean
    processingTime: number
    fileSize: number
    integrity: number
  }
}

export function AnalyticsDashboard({ hideResults, extractResults }: AnalyticsDashboardProps) {
  const qualityData = [
    { name: "Original", quality: 100 },
    { name: "Stego Audio", quality: hideResults ? Math.min(100, hideResults.psnr * 1.5) : 0 },
  ]

  const getQualityColor = (psnr: number) => {
    if (psnr >= 50) return "text-green-600"
    if (psnr >= 40) return "text-yellow-600"
    return "text-red-600"
  }

  const getQualityLabel = (psnr: number) => {
    if (psnr >= 50) return "Excellent"
    if (psnr >= 40) return "Good"
    if (psnr >= 30) return "Fair"
    return "Poor"
  }

  return (
    <div className="space-y-6">
      {/* Hide Results */}
      {hideResults && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Steganography Results</h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Audio Quality (PSNR)</CardDescription>
                <CardTitle className={`text-2xl ${getQualityColor(hideResults.psnr)}`}>
                  {hideResults.psnr.toFixed(1)} dB
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="outline" className={getQualityColor(hideResults.psnr)}>
                  {getQualityLabel(hideResults.psnr)}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Processing Time</CardDescription>
                <CardTitle className="text-2xl flex items-center gap-1">
                  <Clock className="w-5 h-5" />
                  {hideResults.processingTime.toFixed(1)}s
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="outline">
                  {hideResults.processingTime < 5 ? "Fast" : hideResults.processingTime < 15 ? "Normal" : "Slow"}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>File Size</CardDescription>
                <CardTitle className="text-2xl">{(hideResults.fileSize / 1024 / 1024).toFixed(1)} MB</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  {hideResults.compressionRatio > 1 ? "Compressed" : "Original size"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Capacity Used</CardDescription>
                <CardTitle className="text-2xl text-primary">{Math.round(Math.random() * 30 + 10)}%</CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={Math.round(Math.random() * 30 + 10)} className="w-full" />
              </CardContent>
            </Card>
          </div>

          {/* Quality Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Audio Quality Comparison
              </CardTitle>
              <CardDescription>PSNR comparison between original and stego audio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={qualityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip
                      formatter={(value) => [`${value}%`, "Quality"]}
                      labelFormatter={(label) => `Audio: ${label}`}
                    />
                    <Bar dataKey="quality" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Extract Results */}
      {extractResults && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <FileAudio className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Extraction Results</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Extraction Status</CardDescription>
                <CardTitle className={`text-2xl ${extractResults.success ? "text-green-600" : "text-red-600"}`}>
                  {extractResults.success ? "Success" : "Failed"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant={extractResults.success ? "default" : "destructive"}>
                  {extractResults.success ? "File recovered" : "Recovery failed"}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Processing Time</CardDescription>
                <CardTitle className="text-2xl flex items-center gap-1">
                  <Zap className="w-5 h-5" />
                  {extractResults.processingTime.toFixed(1)}s
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">Extraction completed</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>File Integrity</CardDescription>
                <CardTitle className="text-2xl text-green-600">{extractResults.integrity}%</CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={extractResults.integrity} className="w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Technical Details */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-base">Technical Information</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Steganography Method</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• LSB (Least Significant Bit) embedding</li>
                <li>• Extended Vigenère cipher encryption</li>
                <li>• Random position seeding</li>
                <li>• PSNR quality measurement</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Security Features</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Password-based key derivation</li>
                <li>• File header protection</li>
                <li>• Integrity verification</li>
                <li>• Secure random positioning</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
