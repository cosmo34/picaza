#!/bin/zsh
set -euo pipefail
cd "$(dirname "$0")"
IDENTITY="${MOBILECONFIG_IDENTITY:-iPhone Distribution: FLORENT JULIEN REMY (8RYST2PZHX)}"
PASS="${MOBILECONFIG_P12_PASS:-numers-sign-tmp}"
TMP="$(mktemp -d)"
export TMPDIR_SIGN="$TMP"
trap 'rm -rf "$TMP"' EXIT

security export -t identities -f pkcs12 -P "$PASS" -o "$TMP/id.p12"
openssl pkcs12 -in "$TMP/id.p12" -nodes -passin pass:"$PASS" -out "$TMP/all.pem" 2>/dev/null

python3 <<'PY'
from pathlib import Path
import os, subprocess
tmpdir = Path(os.environ["TMPDIR_SIGN"])
text = (tmpdir / "all.pem").read_bytes().decode("latin-1")
parts, buf, kind = [], [], None
for line in text.splitlines(True):
    if "BEGIN CERTIFICATE" in line:
        kind, buf = "cert", [line]
    elif "BEGIN" in line and "PRIVATE KEY" in line:
        kind, buf = "key", [line]
    elif kind == "cert" and "END CERTIFICATE" in line:
        buf.append(line)
        parts.append((kind, "".join(buf).encode("latin-1")))
        kind, buf = None, []
    elif kind == "key" and "END" in line and "PRIVATE" in line:
        buf.append(line)
        parts.append((kind, "".join(buf).encode("latin-1")))
        kind, buf = None, []
    elif buf:
        buf.append(line)
certs = [b for k, b in parts if k == "cert"]
keys = [b for k, b in parts if k == "key"]
dist = next(
    c for c in certs
    if b"iPhone Distribution: FLORENT JULIEN REMY" in subprocess.check_output(
        ["openssl", "x509", "-noout", "-subject"], input=c
    )
)
mod = subprocess.check_output(["openssl", "x509", "-noout", "-modulus"], input=dist)
key = next(
    k for k in keys
    if subprocess.check_output(["openssl", "rsa", "-noout", "-modulus"], input=k, stderr=subprocess.DEVNULL) == mod
)
(tmpdir / "dist.crt").write_bytes(dist)
(tmpdir / "dist.key").write_bytes(key)
PY

curl -fsSL -o "$TMP/AppleWWDRCAG3.cer" "https://www.apple.com/certificateauthority/AppleWWDRCAG3.cer"
curl -fsSL -o "$TMP/AppleRootCA.cer" "https://www.apple.com/appleca/AppleIncRootCertificate.cer"
openssl x509 -inform der -in "$TMP/AppleWWDRCAG3.cer" -out "$TMP/AppleWWDRCAG3.pem"
openssl x509 -inform der -in "$TMP/AppleRootCA.cer" -out "$TMP/AppleRootCA.pem"
cat "$TMP/AppleWWDRCAG3.pem" "$TMP/AppleRootCA.pem" > "$TMP/chain.pem"

for name in enroll enrolled; do
  openssl smime -sign \
    -signer "$TMP/dist.crt" \
    -inkey "$TMP/dist.key" \
    -certfile "$TMP/chain.pem" \
    -nodetach -binary -outform der -md sha256 \
    -in "${name}.unsigned.mobileconfig" \
    -out "${name}.mobileconfig"
  openssl cms -verify -inform DER -in "${name}.mobileconfig" -noverify >/dev/null
  echo "signé ${name}.mobileconfig (DER)"
done
