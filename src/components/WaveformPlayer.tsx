"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  Music,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WaveformPlayerProps {
  file: File | Blob;
  title?: string;
  className?: string;
}

export function WaveformPlayer({
  file,
  title = "Audio",
  className,
}: WaveformPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const [isHovered, setIsHovered] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    generateWaveform();

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };
    const handleEnded = () => setIsPlaying(false);
    const handleLoadStart = () => setIsLoading(true);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("loadstart", handleLoadStart);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("loadstart", handleLoadStart);
    };
  }, [audioUrl]);

  const generateWaveform = () => {
    const data = Array.from({ length: 120 }, (_, i) => {
      const base = Math.sin(i * 0.1) * 50 + 50;
      const noise = Math.random() * 30;
      return Math.max(10, Math.min(100, base + noise));
    });
    setWaveformData(data);
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = value[0];
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newVolume = value[0];
    audio.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const handleWaveformClick = (index: number) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const clickPosition = index / waveformData.length;
    const newTime = clickPosition * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <Card
      className={cn(
        "glass overflow-hidden transition-all duration-500 hover:shadow-2xl border-0 group",
        isPlaying && "ring-2 ring-primary/30 shadow-lg shadow-primary/10",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-8">
        {audioUrl && <audio ref={audioRef} src={audioUrl} preload="metadata" />}

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center transition-all duration-500",
                isPlaying
                  ? "from-primary to-accent shadow-lg shadow-primary/25 animate-glow scale-110"
                  : "from-primary/10 to-accent/10 group-hover:from-primary/20 group-hover:to-accent/20"
              )}
            >
              <Music
                className={cn(
                  "w-7 h-7 transition-colors duration-300",
                  isPlaying ? "text-white" : "text-primary"
                )}
              />
            </div>
            <div>
              <h3 className="text-xl font-bold text-card-foreground">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isLoading
                  ? "Loading..."
                  : `${formatTime(duration)} • High Quality`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex items-center gap-2 px-3 py-1 rounded-full transition-all duration-300",
                isPlaying
                  ? "bg-primary/10 text-primary"
                  : "bg-muted/30 text-muted-foreground"
              )}
            >
              <div
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  isPlaying ? "bg-primary animate-pulse" : "bg-muted-foreground"
                )}
              />
              <span className="text-xs font-medium">
                {isPlaying ? "Playing" : "Paused"}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="relative h-20 bg-gradient-to-r from-muted/20 via-muted/30 to-muted/20 rounded-2xl overflow-hidden p-2">
            <div className="flex items-end justify-between h-full w-full px-2">
              {waveformData.map((height, index) => {
                const isActive = index < (progress / 100) * waveformData.length;
                return (
                  <div
                    key={index}
                    className={cn(
                      "w-1 rounded-full transition-all duration-300 cursor-pointer hover:scale-110",
                      isActive
                        ? "bg-gradient-to-t from-primary via-primary to-accent shadow-sm"
                        : "bg-gradient-to-t from-muted-foreground/40 to-muted-foreground/20 hover:from-primary/50 hover:to-accent/50"
                    )}
                    style={{
                      height: `${Math.max(height * 0.7, 8)}%`,
                      animationDelay: `${index * 10}ms`,
                    }}
                    onClick={() => handleWaveformClick(index)}
                  />
                );
              })}
            </div>

            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary/10 via-primary/20 to-accent/10 transition-all duration-100 rounded-2xl"
              style={{ width: `${progress + 0.5}%` }}
            />
          </div>
        </div>

        <div className="space-y-3 mb-8">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={1}
            onValueChange={handleSeek}
            className="w-full"
            disabled={isLoading}
          />
          <div className="flex justify-between text-sm">
            <span className="text-primary font-medium">
              {formatTime(currentTime)}
            </span>
            <span className="text-muted-foreground">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              disabled={isLoading}
              className="hover:bg-primary/10 hover:text-primary transition-all duration-300"
            >
              <Shuffle className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={isLoading}
              className="hover:bg-primary/10 hover:text-primary transition-all duration-300"
            >
              <SkipBack className="w-4 h-4" />
            </Button>
            <Button
              onClick={togglePlay}
              disabled={!audioUrl || isLoading}
              size="lg"
              className={cn(
                "w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-500 shadow-lg",
                isPlaying
                  ? "scale-110 shadow-xl shadow-primary/30"
                  : "hover:scale-105"
              )}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 text-white ml-1" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={isLoading}
              className="hover:bg-primary/10 hover:text-primary transition-all duration-300"
            >
              <SkipForward className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={isLoading}
              className="hover:bg-primary/10 hover:text-primary transition-all duration-300"
            >
              <Repeat className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMute}
              className="hover:bg-primary/10 hover:text-primary transition-all duration-300"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </Button>
            <div className="flex items-center gap-2">
              <Slider
                value={[isMuted ? 0 : volume]}
                max={1}
                step={0.1}
                onValueChange={handleVolumeChange}
                className="w-24"
              />
              <span className="text-xs text-muted-foreground w-8">
                {Math.round((isMuted ? 0 : volume) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
