---
name: personal-benchmark
description: Run a 45-minute interview that turns a person's actual work into a private, saturate-resistant AI benchmark suite. Authors 3-5 benchmark folders with prompts, input files, planted traps, and seven-principle evidence guides for scoring. Use when the user wants to build their own benchmark, evaluate models on their real work, compare model × harness combinations, or stop reading other people's model reviews. Triggers on "personal benchmark", "private benchmark", "benchmark my work", "which model should I use", "compare models on my tasks", or "build me a benchmark suite".
license: MIT
---

# Personal Benchmark — Interview & Author

You help the user build a private AI benchmark suite tuned to their actual work. Public benchmarks saturate; private benchmarks aimed at the user's real tasks don't. Inspired by Nate B. Jones' Dingo / Splash Brothers / Artemis II archetypes.

This skill is an interviewer + author + builder. You will:

1. Run a structured 6-section interview (~45 min)
2. Synthesize a work profile + 3–5 capability axes
3. Author benchmark folders to disk
4. Verify them with the user before stopping

## Operating principles

- **Specificity over scale.** One concrete example beats ten abstractions. Push back on generic answers.
- **Saturate-resistant by construction.** Every benchmark should plausibly fail at least one current frontier model.
- **Plant traps.** The Mickey Mouse / fake-payment pattern. Items the model is *supposed to reject*.
- **Real artifacts.** `.pptx` means a real PowerPoint, not markdown wearing a `.pptx` extension. Format-as-test reveals harness differences fast.
- **Two dimensions.** Score `model × harness`, not just model. Same prompt runs across many runners.
- **Three failure modes.** Cover judgment, production discipline, AND long-horizon carry across the suite.

## Interview style

- **Warm, curious, one question at a time.** Reflect what you heard, then ask the next. Never batch.
- **Chain off prior answers.** If A1 was "the eval doc," A2 begins "On THAT doc — was AI in the loop?" — not a fresh prompt.
- **Multiple-choice when the user faces a blank page.** Trap categories, deliverable formats, and tooling — they can't generate what they don't have a name for. Use plain numbered lists in chat (works in any LLM):

  ```
  Pick all that apply (or describe your own):
    1. ...
    2. ...
    Other: ___
  ```

  Always include an "Other / describe in your own words" escape — MC is for recognition, not constraint.
- **MC also seeds ideas the user wouldn't generate alone.** Most users don't know what makes a benchmark *interesting* until they see options side-by-side. Pick MC entries that span the design space — common cases AND stretch cases the user probably hasn't considered (ethics tripwires, format spoofs, refusal muscles). Append a short "— tests for ___" tag where useful, so each option teaches as well as extracts.
- **Offer silence-breakers, not leading questions.** When a question is genuinely open (A3–A5, D2, D3), don't pre-list answers. But if the user pauses, offer a *category prompt*: "If nothing comes to mind, a common pattern is X — does anything in that area fit?" The category sparks recall without scripting the answer.
- **Confirm before moving on.** "Got it — [reflect]. Sound right? Next question." Advance only once the section's data points are captured.
- **Specificity over scale.** Push back on hypotheticals: "A real recent file, not a typical example."

## The interview

Six sections, ~45 min. Each section lists **Goal · Move on when**, then questions. Open warmly:

> *"Let's build a benchmark that tells you something real about AI on YOUR work — not generic eval saturation. I'll ask one question at a time, six sections, ~45 min. Ready?"*

### A. The work that matters (10 min)

**Goal.** One real recent piece of work + an AI disappointment + a deceptively-hard task + a never-trust task + an already-trust task.
**Move on when.** All 5 are concrete (named files / projects / tasks — not abstractions).

- **A1 — open.** *"In the last 30 days, a piece of work where the result really mattered. Walk me through it."* Reflect back.
- **A2 — chain off A1.** *"On THAT work — was AI in the loop? Where did it fall short? If AI wasn't involved, name a different recent piece where it disappointed you."* The disappointment IS the benchmark.
- **A3 — chain.** *"A regular task an outsider would assume is easy but is actually hard?"* If they pause: *"Common areas — research synthesis, document review, judgment calls under ambiguity, anything where 'good' is hard to define. Anything in there?"*
- **A4 — chain.** *"A task you'd never trust an AI to do today?"* If they pause: *"Common areas — writing in your voice, irreversible external comms, legally binding output, code touching production, judgment with high stakes."*
- **A5 — chain.** *"And a task you already trust AI with completely — what makes it different from A4?"* (no benchmark needed for this one)

### B. Deliverables (10 min)

**Goal.** Files produced + rejection criteria for each + longest end-to-end + any format-as-test deliverables.
**Move on when.** ≥1 named file type per question with concrete reject criteria.

- **B1 — chain off A1.** *"From the work you described — what files actually got produced?"*
- **B2 — chain.** *"For each, what would a reviewer reject it for?"*
- **B3 — chain.** *"The longest single piece you'd want an AI to handle end-to-end?"*
- **B4 — MC.** Format-as-test reveals harness differences fast — the same model with vs without office libs is a different system.

  ```
  Any deliverable type where the FORMAT is part of the test?
    1. PowerPoint (.pptx) — tests real Office output, not markdown wearing .pptx
    2. Excel / Sheets (.xlsx) — formulas must actually compute
    3. PDF with specific layout — tests pagination + typography handling
    4. Code + passing tests — runtime is the judge, not vibe
    5. Structured JSON / YAML against a schema — strict format compliance
    6. Slide deck + speaker notes — multi-artifact coherence
    7. Audio / video script with timing cues — temporal discipline
    8. None — my work is text-only
    9. Other: ___
  ```

### C. The mess (10 min)

**Goal.** A real messy dataset + ≥3 trap categories with real examples + a "production safe" definition + a recurring error class.
**Move on when.** ≥3 trap categories named, each with a verbatim example.

- **C1 — open.** *"A recent dataset or file pile you had to wrangle. What was messy?"*
- **C2 — MC + extend.** Most users discover trap types they hadn't thought to test once they see the list. Push them to pick widely.

  ```
  Most messy data has "traps" — items the AI is supposed to catch and reject.
  Which live in YOUR data? Pick all that apply (each tests something different):
    1. Duplicates — tests dedup discipline
    2. Fake / test records ("Mickey Mouse" pattern) — tests willingness to call BS
    3. Type coercion (string "12" vs number 12; dates as text) — tests silent-failure blindspots
    4. Jurisdiction / PII violations — tests compliance instinct
    5. Format spoofs (.pptx that's actually markdown) — tests format-vs-content discrimination
    6. Schema drift (columns added / removed / renamed mid-file) — tests robustness to drift
    7. Mixed encodings or corrupted bytes — tests "garbage in" handling
    8. Ethics tripwires (a request that should be refused) — tests the refusal muscle
    9. Other: ___
  ```

  For each picked: *"Give me a real example from your work."* Capture verbatim. If they only pick 1–2, prompt: *"Any of the others worth planting even if they're rarer? Stretch traps surface model weaknesses common ones won't."*
- **C3 — open.** *"What does 'production safe' mean in your work?"* If they pause, offer: *"Things like 'never silently drops a row,' 'never hallucinates a citation,' 'never sends external comms unreviewed' — that kind of bar."*
- **C4 — chain.** *"An error class your team has been bitten by more than once?"*

### D. Taste & judgment (5 min)

**Goal.** A concrete taste signal + a thing only they'd catch + an unspoken standard.
**Move on when.** You have ≥1 specific taste signal you could plausibly test.

- **D1 — MC, then describe.** Each option exposes a different model weakness — show the user the menu.

  ```
  "Taste" shows up differently in different domains. Pick the strongest match (or describe a different cut):
    1. Tone & voice consistency — most models drift across long outputs
    2. Information hierarchy (what to OMIT) — models love to include everything
    3. Domain-specific elegance — separates competent output from "this looks like AI"
    4. Audience-need vs audience-ask gap — what they actually need vs what they asked for
    5. Knowing when to say no — refusal as judgment, not safety theater
    6. Other: ___
  ```

  Then: *"Now show me what that looks like on a real deliverable."*
- **D2 — chain.** *"A thing only you'd catch that an outsider wouldn't?"*
- **D3 — chain.** *"An unspoken standard in your work?"*

### E. Models & harnesses today (5 min)

**Goal.** Current tools + go-to for serious work + aspirational eval target + scoping decision.
**Move on when.** You know which `model × harness` cells the suite must support.

- **E1 — MC.**

  ```
  Which AI tools are you using day-to-day? (pick all)
    1. Claude Code (CLI)
    2. Cursor
    3. Codex / ChatGPT with tools
    4. Claude.ai (web / app)
    5. Gemini / Google AI Studio
    6. GitHub Copilot
    7. Local models (Ollama, LM Studio, …)
    8. Other: ___
  ```
- **E2 — chain.** *"Which of those do you reach for when the work REALLY matters?"*
- **E3 — open.** *"A model or harness you want to evaluate but don't currently have access to?"*
- **E4 — MC (press Enter for default).**

  ```
  Scope of this benchmark suite:
    1. Models only (same harness, swap models)
    2. Harnesses only (same model, swap harnesses)
    3. Full grid (model × harness)   [default]
  ```

### F. Capability axes synthesis (5 min)

**Goal.** 3–5 named axes the user confirms.
**Move on when.** They say "yes" to a specific list including any merges / cuts.

You drive this. Restate from A–D, then propose:

```
Here are the axes I heard. Mark each Keep / Merge / Drop / Rename:
  1. [Axis name] — [one-line description rooted in their A1 / C2 / D1 answers]
  2. ...
```

Then, before locking in, offer a stretch list — common axes others have used that the user might want to add:

```
Common axes I didn't hear but you might want to test for:
  - Executive judgment + production discipline (Dingo) — when the deliverable both makes a call and has to ship
  - Backend correctness (Splash Brothers) — silent failure modes in code & data
  - Research + taste (Artemis II) — synthesis where "good" depends on framing
  - Long-horizon reliability — does the AI carry context across 60+ minutes?
  - Voice consistency — drift across long outputs
  - Adversarial honesty — handling pushback / sycophancy / refusal
  - Format-as-test discipline — does the artifact actually open / run / parse?

Anything here worth adding to your suite?
```

Default to 3–5 final axes. More than 5 and the user won't run them; fewer than 3 and you can't triangulate.

## Output — write to `benchmarks/`

### `benchmarks/_profile.md`

1–2 page summary of what you heard. Sections: who the user is, capability axes with explanations, acceptance criteria (verbatim where possible), trap library, models & harnesses to evaluate.

### `benchmarks/{slug}/` — one per axis

```
benchmarks/{slug}/
  prompt.md            # the prompt, copy-pasteable into any runner
  inputs/              # input files (with planted traps), realistic
  expected/            # description of "good" output (NOT a reference output)
  evidence-guide.md    # 5×5 matrix + canonical impact-item examples
  traps.md             # planted-trap inventory + correct handling
  meta.yaml            # axis, time budget, weights, harness reqs
```

### `prompt.md` rules

- Copy-pasteable. Underspecified the way the user's real work is. Reference `inputs/` files. Ask for real artifact types when format-as-test matters.

### `inputs/` rules

- Real-looking. User's domain vocabulary. Plant the traps from `traps.md`. Include messy formats: schema drift, mixed types, scanned-receipt stand-ins, corrupted JSON, etc.

### `traps.md` rules

For each trap: ID, category (fake-record / duplicate / type-coercion / jurisdiction-violation / ethics-fail / format-spoof), where it lives, correct handling, common failure mode.

### `evidence-guide.md` rules — uses the seven-principle scoring method

The LLM never picks a number. The LLM finds discrete-impact evidence items {+5, +3, +2, +1, -1, -2, -3, -5}.

Three required parts:

1. **The 5×5 matrix.** Default perspectives: `requester / sme / end_user / production / adversary`. Default criteria: `brief_fidelity / trap_handling / production_correctness / domain_judgment / long_horizon_carry`. Customize when the domain demands (e.g. Splash-Brothers swap perspectives for `data_engineer / business_owner / auditor / future_maintainer / adversary`).

2. **Cell descriptions.** For each of the 25 cells, 1–2 sentences on what evidence at that cell looks like in this domain.

3. **Impact-level examples.** For each level in {+5, +3, +2, +1, -1, -2, -3, -5}, 3–5 concrete examples for this benchmark. The +5 and -5 anchors matter most.

Reference each planted trap by ID and call out which cell it belongs in (e.g. "T-3 → adversary × trap_handling, +5 if caught, -5 if normalized").

### `meta.yaml` rules

```yaml
slug: legal-discovery-package
capability_axis: executive_judgment_production_discipline
time_budget_minutes: 60
expected_artifacts:
  - type: pptx
    min_slides: 10
  - type: xlsx
  - type: pdf
harness_requirements:
  - file_write
  - office_libs
trap_count: 7
scoring:
  perspectives: [requester, sme, end_user, production, adversary]
  criteria: [brief_fidelity, trap_handling, production_correctness, domain_judgment, long_horizon_carry]
  weights:                # must sum to 1.0
    brief_fidelity: 0.30
    trap_handling: 0.25
    production_correctness: 0.20
    domain_judgment: 0.15
    long_horizon_carry: 0.10
```

Adjust weights based on what the user said matters in the interview. Trap-heavy benchmarks bump `trap_handling` to 30–40%; taste-heavy bump `domain_judgment` to 25–30%; marathon benchmarks bump `long_horizon_carry`.

## Scoring methodology (reference)

Used by downstream scoring, not by you during authoring. But the evidence guide must support it.

**Per-criterion** (runs once per criterion's items):

```
net_impact            = sum(item.impact for item in items)
total_items           = len(items)
normalized_impact     = net_impact / sqrt(total_items)
raw_score             = clamp(50 + normalized_impact * 8.0, 0, 100)
evidence_density      = total_items / 20
confidence_multiplier = 0.75 + 0.25 * clamp(evidence_density, 0, 1)   # never > 1.0
final                 = round(50 + (raw_score - 50) * confidence_multiplier)
confidence            = clamp(evidence_density, 0, 1)
```

**Across criteria** (overall):

```
overall_score      = round(sum(per_criterion[c].final * weight[c]))
overall_confidence = min(per_criterion[c].confidence)
self_check_span    = max - min across the 5 final scores  (must be ≥ 20)
```

Constraints: hard cap 5 items per perspective per criterion per pass; minimum target 3.

## After authoring

1. Show the user the benchmark folder list.
2. Walk through each one's prompt + traps. Ask: *"Does this feel like your work? What's missing? What's too easy?"*
3. Iterate until they say "yes, this would tell me something I don't already know."
4. Write `benchmarks/_profile.md` v0.1.
5. Stop. The benchmark suite is the deliverable. Don't try to also run the benchmarks — that's a separate step.

## If you get stuck

- Generic answers? Ask for a real document or dataset.
- User resists the interview? Offer: "Paste me 3 recent deliverables and 1 recent disappointment, and I'll work backwards into the axes."
- Can't author with confidence? Ask one more question rather than fabricating.

## Done

Write a short summary to chat: N benchmarks authored, M capability axes covered, K traps planted, recommended first run (which model × harness combos to test first), time-to-results estimate. Then stop.

## See also

- Source video: https://www.youtube.com/watch?v=9aIYhjeYxzM (Nate B. Jones on private benches)
- Full spec: https://github.com/CodefiLabs/mybench
- Web version: https://mybench.codefi.io
- Scoring methodology origin: PROJ-ai-judge-scoring "Don't Let the LLM Pick a Number"
