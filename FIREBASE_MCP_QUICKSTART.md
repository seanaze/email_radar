# 🚀 Firebase MCP Quick Start Guide

## Immediate Steps to Fix Firebase MCP (5 minutes)

### 1. Install Firebase CLI (1 minute)
```bash
npm install -g firebase-tools@latest
```

### 2. Authenticate with Firebase (2 minutes)
```bash
firebase login
```
- This will open your browser
- Sign in with your Google account that has access to the Email Radar Firebase project
- Grant all requested permissions

### 3. Verify Authentication (30 seconds)
```bash
firebase projects:list
```
You should see your `email-radar` project listed.

### 4. Configure MCP in Cursor (1 minute)

#### Option A: Global Configuration (Recommended)
Find your Cursor MCP config file:
- **Linux**: `~/.config/Cursor/User/mcp.json`
- **macOS**: `~/Library/Application Support/Cursor/User/mcp.json`
- **Windows**: `%APPDATA%\Cursor\User\mcp.json`

Add this configuration:
```json
{
  "mcpServers": {
    "firebase": {
      "command": "npx",
      "args": [
        "-y",
        "firebase-tools@latest",
        "experimental:mcp"
      ]
    }
  }
}
```

#### Option B: Project Configuration (Already Done)
✅ I've already created `.cursor/mcp.json` in your project with the correct configuration.

### 5. Restart Cursor (30 seconds)
- **Important**: Completely exit Cursor (File → Exit or Cmd/Ctrl+Q)
- Don't just close the window, fully quit the application
- Reopen Cursor and your project

### 6. Verify MCP is Working
In Cursor chat, type:
```
What Firebase tools are available?
```

You should see 30+ tools including:
- `firebase_auth_list_users`
- `firestore_read`
- `firestore_write`
- `firestore_query`
- And many more...

## 🔧 If It's Still Not Working

### Check 1: Firebase CLI Version
```bash
firebase --version
```
Should be 13.x.x or higher. If not:
```bash
npm update -g firebase-tools
```

### Check 2: Authentication Status
```bash
firebase login:list
```
Should show your email. If not, re-authenticate:
```bash
firebase logout
firebase login --reauth
```

### Check 3: Cursor Developer Console
1. In Cursor: Help → Toggle Developer Tools
2. Go to Console tab
3. Look for:
   - "MCP Server started: firebase" ✅
   - Any error messages containing "firebase" or "mcp" ❌

### Check 4: Manual Test
```bash
npx -y firebase-tools@latest experimental:mcp
```
This should output JSON with available tools. If it errors, there's a Firebase CLI issue.

## 📞 Emergency Fixes

### Fix 1: Clear Cursor Cache
```bash
# Linux
rm -rf ~/.cursor-server/data/User/workspaceStorage/

# macOS
rm -rf ~/Library/Application\ Support/Cursor/User/workspaceStorage/

# Windows (in PowerShell as Admin)
Remove-Item -Recurse -Force "$env:APPDATA\Cursor\User\workspaceStorage"
```

### Fix 2: Use the Setup Script
```bash
bash scripts/setup-firebase-mcp.sh
```

### Fix 3: Manual Global Config
```bash
# Find where Cursor stores configs
ls -la ~/.config/Cursor/User/ 2>/dev/null || \
ls -la ~/Library/Application\ Support/Cursor/User/ 2>/dev/null || \
echo "Check %APPDATA%\Cursor\User\ on Windows"

# Create the mcp.json manually in that directory
```

## ✅ Success Indicators

When Firebase MCP is working correctly:
1. Cursor chat shows 30+ Firebase-specific tools
2. You can query Firestore directly: "Show all documents in the users collection"
3. You can manage auth: "List all authenticated users"
4. You can deploy functions: "Deploy my Cloud Functions"

## 🎯 Next Steps After It's Working

1. Test Firestore integration: "Create a test document in Firestore"
2. Check auth users: "Show me all users in Firebase Auth"
3. Explore available tools: "List all Firebase MCP tools with descriptions"

---

**Still having issues?** The full troubleshooting guide is in `_docs/firebase-mcp-setup-plan.md`