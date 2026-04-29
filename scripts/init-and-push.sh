#!/usr/bin/env bash
# Run this on your Mac (NOT in the agent sandbox).
# It cleans up any stale state, makes the first commit, creates the GitHub repo
# under CodefiLabs, and pushes.
#
# Prereqs: gh authenticated and a member of the CodefiLabs org.
#   gh auth status         # confirm
#   gh auth refresh -h github.com -s repo,read:org   # if needed

set -euo pipefail

cd "$(dirname "$0")/.."

# 1. Clean up any sandbox detritus
rm -f .git/index.lock 2>/dev/null || true
rm -f vite.config.js.timestamp-*.mjs 2>/dev/null || true
rm -rf .svelte-kit build node_modules 2>/dev/null || true

# 2. Ensure git identity is set on this repo
git config user.email "kevin@codefiworks.com"
git config user.name  "Kevin Kirchner"

# 3. Stage + commit
git add -A
git commit -m "Initial commit — MyBench v0.1

One-page SvelteKit web app + skill bundle for skills.sh.

The web app explains what MyBench is, walks through the seven-principle
scoring methodology, and ships the master interview prompt with a
copy-to-clipboard button.

The skill at personal-benchmark/SKILL.md is auto-indexed by skills.sh as
CodefiLabs/mybench/personal-benchmark.

Inspired by Nate B. Jones' private benchmark approach (Dingo / Splash
Brothers / Artemis II). Scoring methodology imported from
PROJ-ai-judge-scoring (Don't Let the LLM Pick a Number)."

# 4. Create the GitHub repo in CodefiLabs and push
gh repo create CodefiLabs/mybench \
  --public \
  --source=. \
  --remote=origin \
  --description="Your personal AI benchmark. Hand the interview prompt to any AI agent and get a saturate-resistant benchmark suite tuned to your actual work." \
  --homepage="https://mybench.codefi.io" \
  --push

echo ""
echo "✓ Pushed to https://github.com/CodefiLabs/mybench"
echo "✓ skills.sh will index personal-benchmark/SKILL.md within ~24h at:"
echo "    https://skills.sh/CodefiLabs/mybench/personal-benchmark"
echo ""
echo "Next steps:"
echo "  1. npm install && npm run dev   # local preview at http://localhost:5173"
echo "  2. Set up Vercel / Netlify / Cloudflare Pages for mybench.codefi.io"
echo "  3. Add 'mybench' topic on the GitHub repo for discoverability"
