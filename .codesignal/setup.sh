#!/bin/sh
# This script will be run when the environment is initialized.
# Add any setup logic here.

echo "Setting up environment…"

npm install
echo 'Environment setup complete!' >&2

npm start
