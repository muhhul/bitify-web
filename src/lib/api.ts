// API configuration and utility functions for Bitify Web

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface EmbedRequest {
  coverAudio: File;
  secretFile: File;
  password: string;
  lsbBits: number;
  enableEncryption: boolean;
  useRandomStart: boolean;
}

export interface EmbedResponse {
  success: boolean;
  stegoAudioUrl: string;
  stegoAudioBlob?: Blob;
  psnr: number;
  qualityScore: number;
  fileSize: number;
  message?: string;
}

export interface ExtractRequest {
  stegoAudio: File;
  password: string;
}

export interface ExtractResponse {
  success: boolean;
  extractedFileUrl: string;
  extractedFileBlob?: Blob;
  originalFileName: string;
  fileSizeBytes: number;
  fileType: string;
  message?: string;
}

export interface CapacityRequest {
  coverAudio: File;
  lsbBits: number;
}

export interface CapacityResponse {
  maxCapacityBytes: number;
  maxCapacityMB: number;
}

export interface ApiError {
  success: false;
  error: string;
  message: string;
}

/**
 * Embed a secret file into a cover audio using steganography
 */
export async function embedSecretFile(
  data: EmbedRequest
): Promise<EmbedResponse> {
  const formData = new FormData();
  formData.append("coverAudio", data.coverAudio);
  formData.append("secretFile", data.secretFile);
  formData.append("password", data.password);
  formData.append("lsbBits", data.lsbBits.toString());
  formData.append("enableEncryption", data.enableEncryption.toString());
  formData.append("useRandomStart", data.useRandomStart.toString());

  try {
    const response = await fetch(`${API_BASE_URL}/api/insert`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: "Unknown error" }));
      throw new Error(
        errorData.message || errorData.error || `HTTP ${response.status}`
      );
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Insertion API error:", error);
    throw error;
  }
}

/**
 * Extract a secret file from a stego-audio
 */
export async function extractSecretFile(
  data: ExtractRequest
): Promise<ExtractResponse> {
  const formData = new FormData();
  formData.append("stegoAudio", data.stegoAudio);
  formData.append("password", data.password);

  try {
    const response = await fetch(`${API_BASE_URL}/api/extract`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: "Unknown error" }));
      throw new Error(
        errorData.message || errorData.error || `HTTP ${response.status}`
      );
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Extraction API error:", error);
    throw error;
  }
}

/**
 * Check if the backend API is available
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: "GET",
    });
    return response.ok;
  } catch (error) {
    console.error("API health check failed:", error);
    return false;
  }
}

/**
 * Get the maximum file size allowed by the backend
 */
export async function getMaxFileSize(): Promise<number> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/config`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to get configuration");
    }

    const config = await response.json();
    return config.maxFileSize || 50 * 1024 * 1024; // Default 50MB
  } catch (error) {
    console.error("Failed to get max file size:", error);
    return 50 * 1024 * 1024; // Default 50MB
  }
}

/**
 * Validate file types and sizes before upload
 */
export function validateFiles(
  coverAudio: File,
  secretFile: File,
  maxSize: number = 50 * 1024 * 1024
) {
  const errors: string[] = [];

  // Validate cover audio
  if (
    !coverAudio.type.includes("audio/mpeg") &&
    !coverAudio.name.toLowerCase().endsWith(".mp3")
  ) {
    errors.push("Cover audio must be an MP3 file");
  }

  if (coverAudio.size > maxSize) {
    errors.push(
      `Cover audio file is too large (max ${Math.round(
        maxSize / 1024 / 1024
      )}MB)`
    );
  }

  // Validate secret file
  if (secretFile.size > maxSize) {
    errors.push(
      `Secret file is too large (max ${Math.round(maxSize / 1024 / 1024)}MB)`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Calculate capacity for steganography based on cover audio and LSB bits
 */
export async function calculateCapacity(
  data: CapacityRequest
): Promise<CapacityResponse> {
  try {
    const formData = new FormData();
    formData.append("coverAudio", data.coverAudio);
    formData.append("lsbBits", data.lsbBits.toString());

    const response = await fetch(`${API_BASE_URL}/api/capacity`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to calculate capacity");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Capacity calculation failed:", error);
    throw error;
  }
}

/**
 * Estimate capacity locally (fallback function for when API is not available)
 */
export function estimateCapacity(
  audioFileSizeBytes: number,
  lsbBits: number
): number {
  // Rough estimation: MP3 files are compressed, but we can estimate based on file size
  // This is a simplified calculation and should be refined based on actual audio analysis
  const estimatedSamples = audioFileSizeBytes * 8; // Very rough estimate
  const bitsPerSample = lsbBits;
  const capacityInBits = estimatedSamples * bitsPerSample;
  const capacityInBytes = Math.floor(capacityInBits / 8);

  // Reserve space for metadata (approximately 1KB)
  const metadataOverheadBytes = 1024;

  return Math.max(0, capacityInBytes - metadataOverheadBytes);
}
