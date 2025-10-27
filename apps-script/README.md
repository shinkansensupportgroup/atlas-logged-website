# Apps Script API

Google Apps Script backend for the Atlas Logged roadmap voting system.

## Quick Start

### Option 1: Manual Deployment (Current Method)

1. Open https://script.google.com
2. Open "Atlas Logged - Roadmap & Features"
3. Copy `Code.gs` contents
4. Paste into web editor
5. Save and deploy

See [UPDATE-INSTRUCTIONS.md](./UPDATE-INSTRUCTIONS.md) for detailed steps.

### Option 2: Automated with Clasp (Recommended)

Set up once, then push changes with one command:

```bash
# One-time setup
npm install -g @google/clasp
clasp login
cp .clasp.json.template .clasp.json
# Edit .clasp.json with your Script ID

# Daily workflow
clasp push    # Upload Code.gs to Apps Script
clasp deploy  # Create new deployment
```

See [CLASP-SETUP.md](./CLASP-SETUP.md) for complete setup guide.

## Files

- **Code.gs** - Main Apps Script code (backend API)
- **UPDATE-INSTRUCTIONS.md** - Manual deployment guide
- **CLASP-SETUP.md** - Automated deployment setup
- **.clasp.json.template** - Template for clasp configuration
- **.claspignore** - Files to exclude from Apps Script upload

## Features

- ✅ Feature voting with rate limiting
- ✅ Feature submission with spam protection
- ✅ Unvoting support
- ✅ Server-side caching (5 min TTL)
- ✅ CORS support for cross-origin requests
- ✅ Google Sheets as database

## API Endpoints

### GET (Fetch Features)
```
https://script.google.com/macros/s/{DEPLOYMENT_ID}/exec
```

### POST (Submit Feature)
```
POST https://script.google.com/macros/s/{DEPLOYMENT_ID}/exec
Content-Type: application/json

{
  "title": "Feature title",
  "description": "Feature description",
  "email": "optional@email.com"
}
```

### GET (Vote)
```
https://script.google.com/macros/s/{DEPLOYMENT_ID}/exec?action=vote&id=1
```

### GET (Unvote)
```
https://script.google.com/macros/s/{DEPLOYMENT_ID}/exec?action=unvote&id=1
```

## Development

Test API locally by updating the URL in `/js/roadmap-api.js` line 6.

## Caching Strategy

- Feature list cached for 5 minutes
- Cache invalidated on: vote, unvote, new submission
- Reduces Google Sheets reads by ~90%

## Rate Limits

- Vote: Once per feature per 24 hours (per user)
- Submit: Once per hour (per user)
- User identity: MD5 hash of userAgent + IP
