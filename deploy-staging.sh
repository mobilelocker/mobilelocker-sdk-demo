#!/bin/bash

source $HOME/.mobilelocker
PRESENTATION_ID=37976
if ! [[ "$PRESENTATION_ID" =~ ^[0-9]+$ ]]; then
  echo "Error: PRESENTATION_ID must be an integer (got: '$PRESENTATION_ID')"
  exit 1
fi
API_URL="https://app.mobilelocker.com/api/presentations/$PRESENTATION_ID/upload"
clear
#read -p "Press ENTER to continue."

./package-presentation.sh

echo "Uploading presentation.zip"

# Scan the presentation to Mobile Locker using your API TOKEN
AUTH_HEADER="Authorization: Bearer $ML_API_TOKEN"
curl \
    --header "$AUTH_HEADER" \
    --form file=@presentation.zip \
    "$API_URL"

echo ""
echo "COMPLETE"
