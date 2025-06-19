#!/bin/bash

# Exit on any error
set -e

# Print commands before executing
set -x

# Get current user and group ID
CURRENT_UID=$(id -u)
CURRENT_GID=$(id -g)

echo "Setting up test environment with user ID: $CURRENT_UID and group ID: $CURRENT_GID"

# Check if we have sudo access
SUDO_CMD=""
if command -v sudo >/dev/null 2>&1; then
    SUDO_CMD="sudo"
fi

# Create necessary directories
if [ ! -d "backend-data/prisma" ]; then
    echo "Creating directory structure..."
    mkdir -p backend-data/prisma
fi

# Set ownership to current user
echo "Setting correct ownership..."
$SUDO_CMD chown -R $CURRENT_UID:$CURRENT_GID backend-data || {
    echo "Warning: Could not change ownership. Continuing anyway..."
}

# Set directory permissions (755 = user:rwx group:r-x others:r-x)
echo "Setting directory permissions..."
$SUDO_CMD chmod -R 755 backend-data || {
    echo "Warning: Could not change permissions. Continuing anyway..."
}

# Ensure .gitkeep exists
echo "Creating .gitkeep file..."
touch backend-data/prisma/.gitkeep
$SUDO_CMD chown $CURRENT_UID:$CURRENT_GID backend-data/prisma/.gitkeep || {
    echo "Warning: Could not change .gitkeep ownership. Continuing anyway..."
}

# Verify permissions
echo "Verifying permissions..."
ls -la backend-data
ls -la backend-data/prisma

echo "Test environment setup completed successfully"
echo "You can now run: docker-compose up" 