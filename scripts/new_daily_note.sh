#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
TEMPLATE_FILE="$ROOT_DIR/06_templates/daily_note.md"
INPUT_DATE="${1:-$(date +%F)}"

if [[ ! "$INPUT_DATE" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]]; then
  echo "Date must be in YYYY-MM-DD format." >&2
  exit 1
fi

YEAR="${INPUT_DATE:0:4}"
MONTH="${INPUT_DATE:0:7}"
TARGET_DIR="$ROOT_DIR/01_daily/$YEAR/$MONTH"
TARGET_FILE="$TARGET_DIR/$INPUT_DATE.md"

if [[ -f "$TARGET_FILE" ]]; then
  echo "Daily note already exists: $TARGET_FILE"
  exit 0
fi

mkdir -p "$TARGET_DIR"

if WEEKDAY="$(date -j -f "%Y-%m-%d" "$INPUT_DATE" "+%A" 2>/dev/null)"; then
  :
else
  WEEKDAY="$(date -d "$INPUT_DATE" "+%A")"
fi

sed \
  -e "s/{{DATE}}/$INPUT_DATE/g" \
  -e "s/{{WEEKDAY}}/$WEEKDAY/g" \
  "$TEMPLATE_FILE" > "$TARGET_FILE"

echo "Created: $TARGET_FILE"
