#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3100}"
PHOTO="${PHOTO:-assets/img/mike/kitchens/IMG_2837.jpeg}"
EMAIL="${EMAIL:-test@example.com}"
PHONE="${PHONE:-9545551212}"

if [[ ! -f "$PHOTO" ]]; then
  echo "Missing test photo: $PHOTO" >&2
  exit 1
fi

answers='{"layout":"preserve","dislikes":["old island","dark cabinets"],"style":"modern warm luxury","materials":["quartz","white oak"],"color":"cream, walnut, lime accent","budget":"planning","timeline":"60-90 days"}'

echo "1. POST /kitchen/preview"
preview_json="$(curl -sS -X POST "$BASE_URL/kitchen/preview" \
  -H "Expect:" \
  -F "photo=@${PHOTO}" \
  -F "answers=${answers}" \
  -F "source_page=/kitchen-vision.html" \
  -F "referrer=local-smoke" \
  -F "utm=codex-smoke")"
node -e "const x=JSON.parse(process.argv[1]); delete x.previewDataUrl; console.log(JSON.stringify(x, null, 2))" "$preview_json"
job_id="$(node -e "const x=JSON.parse(process.argv[1]); if(!x.jobId){process.exit(1)}; console.log(x.jobId)" "$preview_json")"
preview_path="$(node -e "const x=JSON.parse(process.argv[1]); console.log(x.previewUrl)" "$preview_json")"

echo "1b. GET previewUrl"
curl -sSI -H "Expect:" "$BASE_URL$preview_path" | sed -n '1,6p'

echo "2. POST /kitchen/verify-email/start"
start_json="$(curl -sS -X POST "$BASE_URL/kitchen/verify-email/start" \
  -H "Expect:" \
  -H "Content-Type: application/json" \
  -d "{\"jobId\":\"${job_id}\",\"email\":\"${EMAIL}\"}")"
echo "$start_json"
code="$(node -e "const x=JSON.parse(process.argv[1]); console.log(x.devCode || '')" "$start_json")"
if [[ -z "$code" ]]; then
  echo "Set KITCHEN_DEV_RETURN_OTP=true for local smoke tests." >&2
  exit 1
fi

echo "3. POST /kitchen/verify-email/confirm"
curl -sS -X POST "$BASE_URL/kitchen/verify-email/confirm" \
  -H "Expect:" \
  -H "Content-Type: application/json" \
  -d "{\"jobId\":\"${job_id}\",\"code\":\"${code}\"}"
echo

echo "4. POST /kitchen/submit"
curl -sS -X POST "$BASE_URL/kitchen/submit" \
  -H "Expect:" \
  -H "Content-Type: application/json" \
  -d "{\"jobId\":\"${job_id}\",\"name\":\"Smoke Test\",\"phone\":\"${PHONE}\",\"email\":\"${EMAIL}\"}"
echo
