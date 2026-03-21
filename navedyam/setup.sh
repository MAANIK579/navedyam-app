#!/bin/bash
# setup.sh — Quick setup for Navedyam app

echo ""
echo "🍛  Navedyam Cloud Kitchen App — Setup"
echo "======================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
  echo "❌ Node.js not found. Please install from https://nodejs.org"
  exit 1
fi

NODE_VER=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VER" -lt 18 ]; then
  echo "❌ Node.js v18+ required. You have $(node -v)"
  exit 1
fi

echo "✅ Node.js $(node -v) found"

# Install backend dependencies
echo ""
echo "📦 Installing backend dependencies..."
cd backend && npm install
if [ $? -ne 0 ]; then
  echo "❌ Backend npm install failed"
  exit 1
fi
echo "✅ Backend dependencies installed"

# Install frontend dependencies
echo ""
echo "📦 Installing frontend dependencies..."
cd ../frontend && npm install
if [ $? -ne 0 ]; then
  echo "❌ Frontend npm install failed"
  exit 1
fi
echo "✅ Frontend dependencies installed"

# Check expo-cli
if ! command -v expo &> /dev/null; then
  echo ""
  echo "📦 Installing Expo CLI globally..."
  npm install -g expo-cli
fi

echo ""
echo "======================================="
echo "✅  Setup complete!"
echo ""
echo "Next steps:"
echo ""
echo "  1. Start the backend:"
echo "     cd backend && node server.js"
echo ""
echo "  2. In a NEW terminal, start the app:"
echo "     cd frontend && npx expo start"
echo ""
echo "  3. Scan the QR code with Expo Go on your phone"
echo ""
echo "  ⚠️  If using a real phone (not emulator):"
echo "     Edit frontend/src/api/client.js"
echo "     Replace 'localhost' with your machine's local IP"
echo "     (run 'ifconfig' or 'ipconfig' to find it)"
echo ""
