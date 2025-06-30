#!/bin/bash

# Firebase MCP Setup Script for Email Radar
# This script automates the Firebase MCP setup process

set -e  # Exit on error

echo "🚀 Firebase MCP Setup Script for Email Radar"
echo "==========================================="

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Step 1: Check Node.js version
echo -e "\n📋 Checking prerequisites..."
NODE_VERSION=$(node -v 2>/dev/null | cut -d'v' -f2 | cut -d'.' -f1)
if [ -z "$NODE_VERSION" ] || [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js 18+ is required. Please install Node.js 18 or higher."
    exit 1
else
    print_status "Node.js version check passed (v$NODE_VERSION)"
fi

# Step 2: Install Firebase CLI globally
echo -e "\n📦 Installing Firebase CLI..."
if ! command -v firebase &> /dev/null; then
    npm install -g firebase-tools@latest
    print_status "Firebase CLI installed successfully"
else
    FIREBASE_VERSION=$(firebase --version)
    print_status "Firebase CLI already installed (version: $FIREBASE_VERSION)"
    print_warning "Updating to latest version..."
    npm update -g firebase-tools@latest
fi

# Step 3: Check Firebase authentication
echo -e "\n🔐 Checking Firebase authentication..."
if firebase projects:list &> /dev/null; then
    print_status "Firebase authentication is active"
else
    print_warning "You need to authenticate with Firebase"
    echo "Please run: firebase login"
    echo "After authentication, run this script again."
    exit 1
fi

# Step 4: Create Cursor MCP configuration directory
echo -e "\n📁 Setting up Cursor MCP configuration..."
CURSOR_CONFIG_DIR=""

# Detect OS and set appropriate config directory
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    CURSOR_CONFIG_DIR="$HOME/.config/Cursor/User"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    CURSOR_CONFIG_DIR="$HOME/Library/Application Support/Cursor/User"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    CURSOR_CONFIG_DIR="$APPDATA/Cursor/User"
else
    print_error "Unsupported operating system: $OSTYPE"
    exit 1
fi

# Create directory if it doesn't exist
mkdir -p "$CURSOR_CONFIG_DIR"

# Step 5: Create MCP configuration
MCP_CONFIG_FILE="$CURSOR_CONFIG_DIR/mcp.json"
echo -e "\n✏️  Creating MCP configuration..."

# Check if mcp.json exists and backup if needed
if [ -f "$MCP_CONFIG_FILE" ]; then
    print_warning "Existing mcp.json found. Creating backup..."
    cp "$MCP_CONFIG_FILE" "$MCP_CONFIG_FILE.backup.$(date +%Y%m%d_%H%M%S)"
fi

# Create new MCP configuration
cat > "$MCP_CONFIG_FILE" << 'EOF'
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
EOF

print_status "MCP configuration created at: $MCP_CONFIG_FILE"

# Step 6: Create project-specific MCP configuration
echo -e "\n📝 Creating project-specific MCP configuration..."
mkdir -p .cursor
cat > .cursor/mcp.json << 'EOF'
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
EOF

print_status "Project-specific MCP configuration created"

# Step 7: Update .gitignore
echo -e "\n📄 Updating .gitignore..."
if ! grep -q "^.cursor/" .gitignore 2>/dev/null; then
    echo -e "\n# Cursor MCP configuration\n.cursor/" >> .gitignore
    print_status "Added .cursor/ to .gitignore"
else
    print_status ".cursor/ already in .gitignore"
fi

# Step 8: Initialize Firebase emulators if not already done
echo -e "\n🔥 Checking Firebase emulator configuration..."
if ! grep -q "\"functions\"" firebase.json; then
    print_warning "Firebase Functions not configured. Initializing..."
    firebase init functions --project email-radar
fi

# Step 9: Create test function
echo -e "\n🛠️  Setting up test Firebase function..."
cat > functions/src/test-mcp.ts << 'EOF'
/**
 * @fileoverview Test function for Firebase MCP verification
 */

import * as functions from 'firebase-functions';

export const testMCP = functions.https.onRequest((request, response) => {
  response.json({
    status: 'success',
    message: 'Firebase MCP test function is working!',
    timestamp: new Date().toISOString(),
    project: process.env.GCLOUD_PROJECT
  });
});
EOF

print_status "Test function created"

# Step 10: Install function dependencies
echo -e "\n📦 Installing Firebase Functions dependencies..."
cd functions
npm install
cd ..
print_status "Dependencies installed"

# Step 11: Create verification script
echo -e "\n✅ Creating MCP verification script..."
cat > scripts/verify-firebase-mcp.js << 'EOF'
#!/usr/bin/env node

/**
 * Firebase MCP Verification Script
 * Run this after restarting Cursor to verify MCP is working
 */

const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

async function verifyMCP() {
  console.log('🔍 Verifying Firebase MCP Setup...\n');
  
  const checks = [
    {
      name: 'Firebase CLI',
      command: 'firebase --version',
      expectedPattern: /\d+\.\d+\.\d+/
    },
    {
      name: 'Firebase Authentication',
      command: 'firebase projects:list',
      expectedPattern: /Project ID/
    },
    {
      name: 'Node.js Version',
      command: 'node --version',
      expectedPattern: /v1[89]\.|v2[0-9]\./
    }
  ];
  
  let allPassed = true;
  
  for (const check of checks) {
    try {
      const { stdout } = await execPromise(check.command);
      if (check.expectedPattern.test(stdout)) {
        console.log(`✅ ${check.name}: PASSED`);
      } else {
        console.log(`❌ ${check.name}: FAILED - Unexpected output`);
        allPassed = false;
      }
    } catch (error) {
      console.log(`❌ ${check.name}: FAILED - ${error.message}`);
      allPassed = false;
    }
  }
  
  console.log('\n' + '='.repeat(50));
  
  if (allPassed) {
    console.log('✅ All checks passed! Firebase MCP should be working.');
    console.log('\nNext steps:');
    console.log('1. Restart Cursor completely (File → Exit)');
    console.log('2. Open your project in Cursor');
    console.log('3. In the chat, ask: "What Firebase tools are available?"');
    console.log('4. You should see 30+ Firebase-specific tools listed');
  } else {
    console.log('❌ Some checks failed. Please fix the issues above.');
  }
}

verifyMCP().catch(console.error);
EOF

chmod +x scripts/verify-firebase-mcp.js
print_status "Verification script created"

# Final summary
echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Firebase MCP Setup Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "\n📋 Next Steps:"
echo -e "1. ${YELLOW}Restart Cursor completely${NC} (File → Exit or Cmd/Ctrl+Q)"
echo -e "2. Open your Email Radar project in Cursor"
echo -e "3. In Cursor chat, test by asking: ${YELLOW}\"What Firebase tools are available?\"${NC}"
echo -e "4. Run ${YELLOW}node scripts/verify-firebase-mcp.js${NC} to verify setup"
echo -e "\n📚 Troubleshooting:"
echo -e "- If no tools appear, check Cursor Developer Tools (Help → Toggle Developer Tools)"
echo -e "- Look for 'MCP Server started: firebase' in the console"
echo -e "- Full documentation: ${YELLOW}_docs/firebase-mcp-setup-plan.md${NC}"
echo -e "\n🎉 Happy coding with Firebase MCP!"