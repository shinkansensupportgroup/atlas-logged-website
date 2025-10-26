# Atlas Logged Release Videos

This directory contains feature overview videos for each major Atlas Logged release.

## Video Specifications

All videos should follow these guidelines:

### Technical Specs
- **Resolution:** 1080p (1920x1080) or 9:16 vertical (1080x1920) for mobile-first
- **Format:** MP4 (H.264 codec)
- **Bitrate:** 3-4 Mbps (target ~30-40MB for 60s video)
- **Audio:** AAC, 128 kbps
- **Duration:** 30-90 seconds recommended
- **Target Size:** < 50MB per video

### Optimization

Use ffmpeg to optimize videos before uploading:

```bash
ffmpeg -i input.mp4 \
  -c:v libx264 \
  -preset slow \
  -crf 23 \
  -maxrate 4M \
  -bufsize 8M \
  -vf "scale=1920:1080:force_original_aspect_ratio=decrease" \
  -c:a aac \
  -b:a 128k \
  -movflags +faststart \
  output.mp4
```

The `-movflags +faststart` flag is crucial - it enables progressive download so videos start playing before fully downloaded.

### Thumbnail Generation

Generate thumbnails for loading states:

```bash
# Extract frame at 2 seconds
ffmpeg -i v2.0.0.mp4 -ss 00:00:02 -vframes 1 -q:v 2 v2.0.0-thumb.jpg
```

## Git LFS

Videos are tracked with Git LFS (Large File Storage) to keep the repository size small.

- Videos are stored separately on GitHub LFS
- Only pointer files are committed to Git
- Clones automatically download current videos

**LFS Quota:** 1GB storage, 1GB bandwidth/month (free tier)

## Naming Convention

- **Videos:** `v{version}.mp4` (e.g., `v2.0.0.mp4`)
- **Thumbnails:** `v{version}-thumb.jpg` (e.g., `v2.0.0-thumb.jpg`)

## Directory Structure

```
videos/
└── releases/
    ├── v2.0.0.mp4
    ├── v2.0.0-thumb.jpg
    ├── v1.1.20.mp4
    ├── v1.1.20-thumb.jpg
    └── README.md (this file)
```

## Usage in App

Videos are referenced in the changelog.json:

```json
{
  "version": "2.0.0",
  "video": {
    "url": "https://atlaslogged.com/videos/releases/v2.0.0.mp4",
    "thumbnail": "https://atlaslogged.com/videos/releases/v2.0.0-thumb.jpg",
    "duration": 60,
    "size": 35000000
  }
}
```

## Adding New Videos

1. Optimize video using ffmpeg command above
2. Generate thumbnail
3. Add to this directory
4. Commit with git (LFS handles automatically)
5. Update changelog.json in app repo
6. GitHub Actions will sync everything

## Notes

- Keep videos focused on 3-5 key features
- Show real app interactions, not mockups
- Include captions for accessibility
- Test on slow connections before publishing
