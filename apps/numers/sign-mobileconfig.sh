#!/bin/zsh
set -euo pipefail
cd "$(dirname "$0")"
IDENTITY="${MOBILECONFIG_IDENTITY:-iPhone Distribution: FLORENT JULIEN REMY (8RYST2PZHX)}"
for name in enroll enrolled; do
  unsigned="${name}.unsigned.mobileconfig"
  signed="${name}.mobileconfig"
  [[ -f "$unsigned" ]] || { echo "manque $unsigned"; exit 1; }
  security cms -S -H SHA256 -u 6 -G -N "$IDENTITY" -i "$unsigned" -o "$signed"
  openssl cms -verify -inform DER -in "$signed" -noverify >/dev/null
  echo "signé $signed"
done
