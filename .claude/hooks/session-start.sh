#!/bin/bash
set -euo pipefail

# Only needed in remote (Claude Code on the web) sessions — local machines
# manage their own Shopify CLI install.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

# Installs @shopify/cli (theme dev/check/push/pull) from package.json.
# npm install is idempotent and benefits from the cached container state.
npm install --no-audit --no-fund

# Make `shopify` resolvable without the npx prefix for the whole session.
echo "export PATH=\"$CLAUDE_PROJECT_DIR/node_modules/.bin:\$PATH\"" >> "$CLAUDE_ENV_FILE"
