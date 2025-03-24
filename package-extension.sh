#!/bin/bash

# Compile the extension
echo "Compiling the extension..."
npm run compile

# Install vsce if needed
echo "Installing vsce packaging tool..."
npm install -g @vscode/vsce

# Package the extension
echo "Packaging extension..."
vsce package

echo ""
echo "Extension packaged! To install it in Cursor:"
echo "1. Open Cursor"
echo "2. Go to Extensions view (Cmd+Shift+X)"
echo "3. Click on the '...' menu (top-right of Extensions view)"
echo "4. Select 'Install from VSIX...'"
echo "5. Choose the .vsix file in this directory" 