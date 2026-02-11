import { NextRequest, NextResponse } from "next/server";
import { isInstagramUrl } from "@/lib/instagram";
import {
  downloadVideo,
  extractFrames,
  extractAudio,
  readFramesAsBase64,
  cleanup,
} from "@/lib/video";
import { transcribeAudio, extractRecipe } from "@/lib/openai";
import { dirname } from "path";

export const maxDuration = 120;

export async function POST(request: NextRequest) {
  let videoPath: string | null = null;
  let framesDir: string | null = null;
  let audioPath: string | null = null;

  try {
    const { url } = await request.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    if (!isInstagramUrl(url)) {
      return NextResponse.json(
        { error: "Please provide a valid Instagram Reel URL" },
        { status: 400 }
      );
    }

    videoPath = await downloadVideo(url);

    const [framePaths, audioFile] = await Promise.all([
      extractFrames(videoPath),
      extractAudio(videoPath),
    ]);

    framesDir = dirname(framePaths[0]);
    audioPath = audioFile;

    const base64Frames = readFramesAsBase64(framePaths);
    const transcript = await transcribeAudio(audioFile);

    const recipe = await extractRecipe(base64Frames, transcript);

    return NextResponse.json(recipe);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Something went wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    if (videoPath) cleanup(videoPath, dirname(videoPath));
    if (framesDir) cleanup(framesDir);
    if (audioPath) cleanup(audioPath, dirname(audioPath));
  }
}
