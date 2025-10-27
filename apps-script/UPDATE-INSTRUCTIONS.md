# How to Update Apps Script

After making changes to `Code.gs`, you need to update your deployed Apps Script:

## Steps:

1. **Open your Apps Script:**
   - Go to https://script.google.com
   - Open "Atlas Logged - Roadmap & Features"

2. **Replace the code:**
   - Select all existing code (Cmd+A)
   - Delete it
   - Open `/apps-script/Code.gs` in VS Code
   - Copy all the code (Cmd+A, Cmd+C)
   - Paste into Apps Script (Cmd+V)

3. **Save:**
   - Click Save (Cmd+S or disk icon)

4. **Deploy new version:**
   - Click Deploy → Manage deployments
   - Click ✏️ Edit (pencil icon) next to your deployment
   - Under "Version", select "New version"
   - Click Deploy
   - Copy the new URL (if it changed)

**NOTE:** The URL usually stays the same, but if it changes, update it in `/js/roadmap-api.js` on line 6!

## What Changed in This Update:

- Added `handleUnvote()` function for removing votes
- Modified `doGet()` to handle 'unvote' action
- Users can now click "✅ Voted" to unvote
- Vote count decrements in Google Sheet
- localStorage updated to remove vote
