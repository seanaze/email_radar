# Firebase MCP Setup & Fix Plan

## 🎯 Executive Summary

Firebase MCP (Model Context Protocol) enables AI assistants like Cursor to directly interact with Firebase services through standardized tools. Your MCP is not showing tools because:

1. Firebase CLI is not properly installed globally
2. MCP server configuration is missing or incorrect
3. Authentication might not be properly configured

## 📋 Current State Assessment

### ✅ What You Have:
- Firebase project configuration files (firebase.json, firestore.rules, etc.)
- Firebase SDK initialized in your app (src/utils/firebase.ts)
- Environment variables in .env.local
- Firebase Functions scaffold (but no deployed functions)

### ❌ What's Missing:
- Firebase CLI installed globally
- Firebase MCP server configured in Cursor
- Firebase authentication via CLI
- Proper MCP JSON configuration

## 🚀 Step-by-Step Implementation Plan

### Phase 1: Firebase CLI Setup (Foundation)

#### 1.1 Install Firebase Tools Globally
```bash
npm install -g firebase-tools@latest
```

#### 1.2 Verify Installation
```bash
firebase --version
# Should output: 13.x.x or higher
```

#### 1.3 Authenticate Firebase CLI
```bash
firebase login
# This opens browser for Google authentication
# Grant all requested permissions
```

#### 1.4 Verify Project Connection
```bash
firebase projects:list
# Should show your Email Radar project
```

### Phase 2: Configure Firebase MCP in Cursor

#### 2.1 Locate Cursor MCP Configuration
The MCP configuration file should be at one of these locations:
- Windows: `%APPDATA%\Cursor\User\mcp.json`
- macOS: `~/Library/Application Support/Cursor/User/mcp.json`
- Linux: `~/.config/Cursor/User/mcp.json`

#### 2.2 Add Firebase MCP Server Configuration
Create or update the `mcp.json` file:

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

#### 2.3 Alternative: Project-Specific Configuration
If you want project-specific MCP, add to your workspace:
`.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "firebase": {
      "command": "npx",
      "args": [
        "-y",
        "firebase-tools@latest",
        "experimental:mcp",
        "--dir",
        "."
      ]
    }
  }
}
```

### Phase 3: Activate & Verify MCP Connection

#### 3.1 Restart Cursor
- Completely close Cursor (File → Exit or Cmd/Ctrl+Q)
- Reopen Cursor
- Open your Email Radar project

#### 3.2 Verify MCP Tools Available
In Cursor chat, ask: "What Firebase tools are available?"

Expected tools include:
- `firebase_init` - Initialize Firebase in directory
- `firebase_auth_list_users` - List auth users
- `firebase_auth_get_user` - Get user by ID/email
- `firebase_auth_set_custom_claims` - Set custom claims
- `firestore_read` - Read Firestore documents
- `firestore_write` - Write to Firestore
- `firestore_query` - Query collections
- `firestore_list_collections` - List collections
- `storage_generate_download_url` - Generate storage URLs
- `remote_config_get` - Get remote config
- `messaging_send` - Send FCM messages

#### 3.3 Test Basic Firebase Operations
```
"List all Firestore collections in my project"
```

### Phase 4: Enhanced Integration Setup

#### 4.1 Configure Functions for MCP
Update `functions/index.js`:

```javascript
const {onRequest} = require("firebase-functions/v2/https");
const {onDocumentCreated} = require("firebase-functions/v2/firestore");

// Health check endpoint for MCP
exports.healthCheck = onRequest((req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Example Firestore trigger
exports.onEmailCreated = onDocumentCreated("emails/{emailId}", (event) => {
  console.log("New email created:", event.params.emailId);
});
```

#### 4.2 Deploy Functions
```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

#### 4.3 Set Up Development Emulators
```bash
firebase init emulators
# Select: Functions, Firestore, Auth
firebase emulators:start
```

### Phase 5: Project-Specific MCP Extensions

#### 5.1 Create Custom MCP Tools
Create `mcp-extensions/email-radar-tools.js`:

```javascript
// Custom tools specific to Email Radar
export const emailRadarTools = {
  analyzeEmailGrammar: async (emailContent) => {
    // Integrate with your grammar checker
  },
  
  generateAISuggestions: async (emailContent, tone) => {
    // Call OpenAI for suggestions
  },
  
  syncWithGmail: async (userId) => {
    // Sync emails with Gmail API
  }
};
```

#### 5.2 Add Custom Tools to MCP Config
Update `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "firebase": {
      "command": "npx",
      "args": ["-y", "firebase-tools@latest", "experimental:mcp"]
    },
    "email-radar": {
      "command": "node",
      "args": ["./mcp-extensions/server.js"]
    }
  }
}
```

## 🔧 Troubleshooting Guide

### Issue: "No tools available" in Cursor

1. **Check Firebase CLI Authentication**
   ```bash
   firebase login:list
   # Should show your Google account
   ```

2. **Verify MCP Server Running**
   - Open Cursor Developer Tools: Help → Toggle Developer Tools
   - Check Console for MCP errors
   - Look for "MCP Server started: firebase"

3. **Clear Cursor Cache**
   ```bash
   # Linux/macOS
   rm -rf ~/.cursor-server/data/User/workspaceStorage/
   
   # Windows
   rmdir /s %APPDATA%\Cursor\User\workspaceStorage
   ```

### Issue: "Permission denied" errors

1. **Re-authenticate Firebase**
   ```bash
   firebase logout
   firebase login --reauth
   ```

2. **Check Project Permissions**
   - Go to Firebase Console → Project Settings → Users
   - Ensure your account has Owner/Editor role

### Issue: MCP server crashes

1. **Check Node.js Version**
   ```bash
   node --version
   # Should be v18.0.0 or higher
   ```

2. **Update Dependencies**
   ```bash
   npm update -g firebase-tools
   npm cache clean --force
   ```

## 📊 Verification Checklist

- [ ] Firebase CLI installed and authenticated
- [ ] MCP configuration file created
- [ ] Cursor restarted after configuration
- [ ] Firebase tools appear in Cursor chat
- [ ] Can list Firestore collections via MCP
- [ ] Can read/write Firestore documents
- [ ] Functions deployed successfully
- [ ] Emulators running locally

## 🚦 Next Steps After Setup

1. **Integrate MCP with Your Workflow**
   - Use MCP to manage user authentication
   - Query and update Firestore data directly
   - Deploy and test Cloud Functions

2. **Create Email Radar Specific Commands**
   - "Show all users who haven't configured Gmail"
   - "Create a test email document in Firestore"
   - "List all grammar suggestions for user X"

3. **Optimize for Development**
   - Set up staging/production environments
   - Create MCP shortcuts for common tasks
   - Document team-specific MCP usage

## 🔐 Security Best Practices

1. **Never commit MCP config with secrets**
   - Add `.cursor/` to `.gitignore`
   - Use environment variables for sensitive data

2. **Limit MCP Permissions**
   ```json
   {
     "mcpServers": {
       "firebase": {
         "command": "npx",
         "args": [
           "-y",
           "firebase-tools@latest",
           "experimental:mcp",
           "--only",
           "firestore,auth"
         ]
       }
     }
   }
   ```

3. **Regular Authentication Refresh**
   - Re-authenticate monthly
   - Rotate service account keys if used

## 📚 Additional Resources

- [Firebase MCP Official Docs](https://firebase.blog/posts/2025/05/firebase-mcp-server/)
- [Cursor MCP Integration Guide](https://docs.cursor.com/context/more/mcp)
- [Model Context Protocol Spec](https://modelcontextprotocol.io/)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)

## 🎯 Success Metrics

Once properly configured, you should be able to:
1. See 30+ Firebase tools in Cursor
2. Query Firestore data without leaving Cursor
3. Deploy functions with AI assistance
4. Manage authentication directly in chat
5. Get real-time Firebase insights while coding

This comprehensive plan ensures a robust, long-term Firebase MCP integration that scales with your Email Radar project needs.