# MyBench

> Stop reading model reviews. Build your own benchmark.

**MyBench** is a 45-minute interview that turns your actual work into a private, saturate-resistant AI benchmark suite — and a methodology for running it across `model × harness` combinations so you know what to use, when.

Inspired by [Nate B. Jones' private benchmark](https://youtu.be/9aIYhjeYxzM) (Dingo / Splash Brothers / Artemis II). Built on the seven-principle scoring methodology from [*Don't Let the LLM Pick a Number*](https://github.com/Codefilabs/pickanumber). By [Codefi](https://codefiworks.com).

## Quickstart

### Option A — Copy the prompt

Open `personal-benchmark/SKILL.md` (or visit [mybench.codefi.io](https://mybench.codefi.io)), paste the interview prompt into any AI agent with shell + file access (Claude Code, Codex, Cursor, Paperclip, OpenCode, …), and answer the interview. The agent writes a benchmark suite to your working directory.

### Option B — Install as a skill via skills.sh

```bash
npx skills add CodefiLabs/mybench
```

Now any [skills-aware](https://skills.sh) agent (Claude Code, Cursor, Goose, OpenCode, …) can invoke MyBench by name.

## What you get

After the interview, your working directory has:

```
benchmarks/
  _profile.md
  {your-benchmark-1}/
    prompt.md
    inputs/
    expected/
    evidence-guide.md
    traps.md
    meta.yaml
  {your-benchmark-2}/
    ...
```

Three to five benchmarks tuned to *your* work, each with a copy-pasteable prompt, realistic input files (with planted traps), an evidence guide for scoring, and a meta.yaml that captures the capability axis and criterion weights.

## How scoring works

The LLM never picks a number. Scoring LLMs find discrete-impact evidence items from `{+5, +3, +2, +1, -1, -2, -3, -5}`, organized in a 5-perspective × 5-criterion matrix. The formula computes the score:

```
# per criterion
normalized = net_impact / sqrt(total_items)
raw        = clamp(50 + normalized * 8.0, 0, 100)
multiplier = 0.75 + 0.25 * clamp(total_items / 20, 0, 1)   # never > 1.0
final      = round(50 + (raw - 50) * multiplier)
confidence = clamp(total_items / 20, 0, 1)

# overall
overall_score      = sum(c.final * c.weight for c in criteria)
overall_confidence = min(c.confidence for c in criteria)
```

Sparse evidence is *visibly* low-confidence. Sqrt normalization punishes evidence farming. The 5×5 matrix forces multi-stakeholder evaluation. Independent passes by different model families catch contradictions.

Full methodology: [Codefilabs/pickanumber](https://github.com/Codefilabs/pickanumber).

## Two dimensions

MyBench scores `model × harness`, not just model:

| | Claude Code | Codex | Cursor | pi.dev | OpenCode | Paperclip | OpenClaw | raw API | raw chat |
|---|---|---|---|---|---|---|---|---|---|
| Claude Opus | | | | | | | | | |
| GPT-5.5 | | | | | | | | | |
| Gemini 3.1 Pro | | | | | | | | | |

The same prompt across the grid. The leaderboard tells you which combination to reach for when *your* messy work hits *your* desk on Tuesday.

## Repo layout

```
mybench/
├── personal-benchmark/        # the skill (skills.sh indexes this folder)
│   └── SKILL.md
├── src/                       # SvelteKit web app (mybench.codefi.io)
│   ├── routes/+page.svelte
│   └── lib/prompt.js          # the interview prompt, single source of truth
├── static/
├── package.json
└── README.md
```

## Develop

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # static build → ./build
npm run preview      # serve the production build
```

The site is static — `@sveltejs/adapter-static` builds to `build/` and deploys anywhere.

## Credits

- **Source video** — Nate B. Jones, [GPT-5.5 vs Claude vs Gemini: The Real Difference Nobody's Talking About](https://www.youtube.com/watch?v=9aIYhjeYxzM)
- **Scoring methodology** — [*Don't Let the LLM Pick a Number*](https://github.com/Codefilabs/pickanumber), calibrated on 18 hackathon submissions and 342 BLS occupations across 9 models
- **Built by** — [Codefi](https://codefiworks.com)
- **Pairwise diagnostic pattern** — borrows from lechmazur/writing-style
- **Skill ecosystem** — [skills.sh](https://skills.sh)

## License

MIT — see [LICENSE](./LICENSE).
