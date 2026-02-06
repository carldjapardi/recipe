import { NextRequest, NextResponse } from "next/server";
import {
  isInstagramUrl,
  downloadVideo,
  extractFrames,
  readFramesAsBase64,
  cleanup,
} from "@/lib/video";
import { extractRecipe } from "@/lib/openai";
import { dirname } from "path";

export const maxDuration = 120;

export async function POST(request: NextRequest) {
  let videoPath: string | null = null;
  let framesDir: string | null = null;

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
    const framePaths = await extractFrames(videoPath);
    framesDir = dirname(framePaths[0]);
    const base64Frames = readFramesAsBase64(framePaths);
    const recipe = await extractRecipe(base64Frames);

    return NextResponse.json(recipe);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Something went wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    if (videoPath) cleanup(videoPath, dirname(videoPath));
    if (framesDir) cleanup(framesDir);
  }
}
