#!/bin/bash

# Compile the extension
echo "Compiling the extension..."
npm run compile

# Start Cursor with the extension on macOS
echo "Opening Cursor with the extension..."
/Applications/Cursor.app/Contents/MacOS/Cursor --new-window --extensionDevelopmentPath="$(pwd)"

echo "Test the extension with these steps:"
echo "1. Open a Git repository"
echo "2. Create/check out a branch with a JIRA issue ID (e.g., feature/PROJECT-123-something)"
echo "3. Open the Source Control view (Ctrl+Shift+G or Cmd+Shift+G)"
echo "4. Look for the JIRA ID in the commit message input box"
echo "5. Try clicking the extension's icon to manually insert the JIRA ID"
echo "6. Configure settings in Cursor Settings (search for 'JIRA Commit Message')" 