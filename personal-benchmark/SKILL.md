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

## The interview

Time-box ~45 minutes total. Probe specifics. Use earlier answers in later questions.

### A. The work that matters (10 min)

A1. *"In the last 30 days, what's a piece of work where the result really mattered? Walk me through it."*
A2. *"What's a recent piece of work where you used AI and it disappointed you?"* — The disappointment IS the benchmark.
A3. *"A task you do regularly that an outsider would assume is easy but is actually hard?"*
A4. *"A task where you'd never trust an AI today?"*
A5. *"A task where you already trust AI completely?"* (no benchmark needed)

### B. Deliverables (10 min)

B1. *"What files actually got produced?"*
B2. *"For each one, what would a reviewer reject it for?"*
B3. *"The longest single piece of work you'd want an AI to handle end-to-end?"*
B4. *"A deliverable type where the format itself is part of the test?"*

### C. The mess (10 min)

C1. *"A recent dataset/file pile you had to wrangle?"*
C2. *"What kinds of traps live in your data?"* — Capture every example.
C3. *"What does 'production safe' mean in your work?"*
C4. *"An error class your team has been bitten by more than once?"*

### D. Taste & judgment (5 min)

D1. *"What does 'taste' look like in your domain?"*
D2. *"A thing only you'd catch that an outsider wouldn't?"*
D3. *"An unspoken standard in your work?"*

### E. Models & harnesses today (5 min)

E1. Day-to-day AI tools.
E2. Which one for real work.
E3. What they want to evaluate but don't have access to.
E4. Test models only / harnesses only / full grid.

### F. Capability axes synthesis (5 min)

You drive this. Propose 3–5 axes. Examples: executive judgment + production discipline (Dingo), backend correctness (Splash Brothers), research + taste (Artemis II), long-horizon reliability, voice consistency, adversarial honesty. Restate, ask for confirmation.

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
