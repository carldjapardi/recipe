import { execFile } from "child_process";
import {
  mkdtempSync,
  existsSync,
  unlinkSync,
  readdirSync,
  readFileSync,
  rmdirSync,
} from "fs";
import { join } from "path";
import { tmpdir } from "os";

const INSTAGRAM_URL_RE =
  /^https?:\/\/(www\.)?instagram\.com\/(reel|p|reels)\/[\w-]+/;

export function isInstagramUrl(url: string): boolean {
  return INSTAGRAM_URL_RE.test(url);
}

export function downloadVideo(url: string): Promise<string> {
  const dir = mkdtempSync(join(tmpdir(), "recipe-"));
  const output = join(dir, "video.mp4");

  return new Promise((resolve, reject) => {
    execFile(
      "yt-dlp",
      [
        "-f", "worst[ext=mp4]/worst",
        "--merge-output-format", "mp4",
        "-o", output,
        "--no-playlist",
        url,
      ],
      { timeout: 60_000 },
      (error) => {
        if (error) {
          reject(new Error(`Failed to download video: ${error.message}`));
          return;
        }
        if (!existsSync(output)) {
          reject(new Error("Download completed but video file not found"));
          return;
        }
        resolve(output);
      }
    );
  });
}

export function extractFrames(videoPath: string): Promise<string[]> {
  const dir = mkdtempSync(join(tmpdir(), "recipe-frames-"));
  const pattern = join(dir, "frame_%03d.jpg");

  return new Promise((resolve, reject) => {
    execFile(
      "ffmpeg",
      // ["-i", videoPath, "-vf", "fps=1,scale=512:-2", "-q:v", "5", pattern],
      ["-i", videoPath, "-vf", "fps=0.5,scale=512:-2", "-q:v", "5",pattern,],
      { timeout: 30_000 },
      (error) => {
        if (error) {
          reject(new Error(`Failed to extract frames: ${error.message}`));
          return;
        }
        const files = readdirSync(dir)
          .filter((f) => f.endsWith(".jpg"))
          .sort()
          .map((f) => join(dir, f));

        if (files.length === 0) {
          reject(new Error("No frames extracted from video"));
          return;
        }
        resolve(files);
      }
    );
  });
}

export function extractAudio(videoPath: string): Promise<string> {
  const dir = mkdtempSync(join(tmpdir(), "recipe-audio-"));
  const output = join(dir, "audio.mp3");

  return new Promise((resolve, reject) => {
    execFile(
      "ffmpeg",
      [
        "-i", videoPath,
        "-vn",
        "-ac", "1",
        "-ar", "16000",
        "-acodec", "libmp3lame",
        "-q:a", "7",
        output,
      ],
      { timeout: 30_000 },
      (error) => {
        if (error) {
          reject(new Error(`Failed to extract audio: ${error.message}`));
          return;
        }
        if (!existsSync(output)) {
          reject(new Error("Audio extraction completed but file not found"));
          return;
        }
        resolve(output);
      }
    );
  });
}

export function readFramesAsBase64(framePaths: string[]): string[] {
  return framePaths.map((p) => readFileSync(p).toString("base64"));
}

export function cleanup(...paths: string[]): void {
  for (const p of paths) {
    try {
      if (!existsSync(p)) continue;
      if (p.endsWith(".mp4") || p.endsWith(".jpg") || p.endsWith(".mp3")) {
        unlinkSync(p);
      } else {
        readdirSync(p).forEach((f) => unlinkSync(join(p, f)));
        rmdirSync(p);
      }
    } catch {
      /* noop */
    }
  }
}
