import OpenAI from "openai";
import fs from "fs";
import { Recipe } from "@/types/recipe";

function getClient() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
}

export async function transcribeAudio(audioPath: string): Promise<string> {
  const transcription = await getClient().audio.transcriptions.create({
    file: fs.createReadStream(audioPath),
    model: "whisper-1",
  });
  return transcription.text;
}

function buildPrompt(transcript: string): string {
  return `These are frames extracted from a cooking video (1 frame per second).
The audio from the video has been transcribed below.

AUDIO TRANSCRIPT:
${transcript}

Using both the visual frames and the audio transcript, extract the complete recipe.
Return ONLY valid JSON matching this exact structure (no markdown, no code fences):
{
  "title": "Recipe name",
  "description": "Brief one-sentence description",
  "servings": "Number of servings",
  "prepTime": "Prep time",
  "cookTime": "Cook time",
  "ingredients": ["ingredient 1", "ingredient 2"],
  "steps": ["Step 1 description", "Step 2 description"]
}
If you cannot determine a field, use a reasonable estimate or "Not specified".
Be thorough with ingredients — include quantities when visible or mentioned.
Write steps as clear, concise instructions.`;
}

export async function extractRecipe(
  frames: string[],
  transcript: string
): Promise<Recipe> {
  const imageInputs = frames.map((base64) => ({
    type: "input_image" as const,
    image_url: `data:image/jpeg;base64,${base64}`,
    detail: "low" as const,
  }));

  const response = await getClient().responses.create({
    model: "gpt-4.1-mini",
    input: [
      {
        role: "user",
        content: [
          ...imageInputs,
          { type: "input_text" as const, text: buildPrompt(transcript) },
        ],
      },
    ],
  });

  const text = response.output_text?.trim() ?? "";
  const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();

  const recipe: Recipe = JSON.parse(cleaned);
  return recipe;
}
