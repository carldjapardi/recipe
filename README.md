# Recipe

Convert Instagram cooking videos into written recipes using AI.

## Setup

```bash
npm install
brew install yt-dlp ffmpeg
```

Create `.env.local`:

```
OPENAI_API_KEY=your_api_key_here
```

## Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), paste an Instagram Reel URL, and get a structured recipe.
