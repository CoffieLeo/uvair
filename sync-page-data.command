#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

cd "$SCRIPT_DIR" || exit 1

echo "Syncing data/page.json to js/page-data.js..."
node scripts/sync-page-data.mjs
STATUS=$?

if [ $STATUS -eq 0 ]; then
    echo
    echo "Sync completed."
else
    echo
    echo "Sync failed."
fi

echo
read -r -p "Press Enter to close..."
exit $STATUS
