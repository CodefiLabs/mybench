<script>
	import { INTERVIEW_PROMPT } from '$lib/prompt.js';

	let copyState = $state('idle'); // idle | copied | error
	let installCopyState = $state('idle');

	const INSTALL_CMD = 'npx skills add CodefiLabs/mybench';

	async function copyPrompt() {
		try {
			await navigator.clipboard.writeText(INTERVIEW_PROMPT);
			copyState = 'copied';
			setTimeout(() => (copyState = 'idle'), 2200);
		} catch (e) {
			copyState = 'error';
			setTimeout(() => (copyState = 'idle'), 2200);
		}
	}

	async function copyInstall() {
		try {
			await navigator.clipboard.writeText(INSTALL_CMD);
			installCopyState = 'copied';
			setTimeout(() => (installCopyState = 'idle'), 2200);
		} catch (e) {
			installCopyState = 'error';
			setTimeout(() => (installCopyState = 'idle'), 2200);
		}
	}

	const principles = [
		{ n: 1, title: 'Separate observation from scoring', body: 'The LLM finds evidence. A formula — not the LLM — produces the score.' },
		{ n: 2, title: 'Confidence = evidence density', body: 'How much evidence the scorer found, not how sure the scorer feels.' },
		{ n: 3, title: 'Discrete impact items', body: 'Every piece of evidence gets one of {+5, +3, +2, +1, -1, -2, -3, -5}. Forces commitment.' },
		{ n: 4, title: 'Diminishing returns (sqrt)', body: 'normalized = net_impact / sqrt(total_items). The 40th item adds less than the 4th.' },
		{ n: 5, title: 'Regress toward the mean', body: 'Sparse-evidence runs are pulled toward 50. Multiplier never exceeds 1.0.' },
		{ n: 6, title: 'Force multiple perspectives', body: '5 perspectives × 5 criteria. Single-lens bias is structurally prevented.' },
		{ n: 7, title: 'Cross-modal adversarial synthesis', body: 'Independent passes by different model families catch contradictions.' }
	];

	const perspectives = ['requester', 'sme', 'end_user', 'production', 'adversary'];
	const criteria = [
		{ key: 'brief_fidelity', label: 'brief fidelity' },
		{ key: 'trap_handling', label: 'trap handling' },
		{ key: 'production_correctness', label: 'production' },
		{ key: 'domain_judgment', label: 'domain judgment' },
		{ key: 'long_horizon_carry', label: 'long-horizon carry' }
	];

	const archetypes = [
		{
			name: 'Dingo',
			subtitle: 'executive judgment + production discipline',
			body: 'A 23-deliverable launch package for a fictional, ethically-fraught Anchorage pet-tech startup. Tests judgment: does the model understand legal posture, regulatory risk, and produce real .pptx / .xlsx artifacts that pass a board review?'
		},
		{
			name: 'Splash Brothers',
			subtitle: 'backend correctness',
			body: '465 dirty files from a fictional car-wash. Mickey Mouse is a planted fake customer. A $25k payment is fake. 7 duplicate pairs, 13 typo records. Tests: do you reject the fakes, merge the dups, preserve provenance, build a deterministic re-run?'
		},
		{
			name: 'Artemis II',
			subtitle: 'research + taste',
			body: 'Build an interactive 3D visualization of NASA Artemis II from a blank brief. No facts provided, no tech stack specified. Tests: research, visual scale, info density, working interactivity, no Apollo-confusion hallucinations.'
		}
	];

	const harnesses = [
		'Claude Code',
		'Codex',
		'Gemini CLI',
		'Cursor',
		'pi.dev',
		'OpenCode',
		'Paperclip',
		'OpenClaw',
		'raw API',
		'raw chat'
	];
</script>

<svelte:head>
	<title>MyBench — your personal AI benchmark</title>
</svelte:head>

<!-- ╭──────────────────────────────────────────────────────────────╮
     │ HERO                                                          │
     ╰──────────────────────────────────────────────────────────────╯ -->
<header class="relative overflow-hidden border-b border-ink-800">
	<div class="absolute inset-0 bg-gradient-to-br from-ink-900 via-ink-900 to-ink-800 opacity-60"></div>
	<div
		class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-500/50 to-transparent"
	></div>

	<div class="container-prose relative pt-12 pb-20 lg:pt-20 lg:pb-32">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-3">
				<div
					class="flex h-9 w-9 items-center justify-center rounded-md bg-accent-500 font-mono text-base font-black text-ink-900"
				>
					M
				</div>
				<span class="font-mono text-sm font-semibold tracking-wider text-ink-200">MYBENCH</span>
			</div>
			<nav class="flex items-center gap-6 text-sm">
				<a class="text-ink-300 transition hover:text-ink-100" href="#how">How it works</a>
				<a class="text-ink-300 transition hover:text-ink-100" href="#methodology">Methodology</a>
				<a class="text-ink-300 transition hover:text-ink-100" href="#prompt">Get the prompt</a>
				<a
					class="hidden md:inline text-ink-300 transition hover:text-ink-100"
					href="https://github.com/CodefiLabs/mybench"
					target="_blank"
					rel="noopener">GitHub</a
				>
			</nav>
		</div>

		<div class="mt-16 max-w-3xl lg:mt-24">
			<span class="tag">Inspired by Nate B. Jones · Dingo / Splash Brothers / Artemis II</span>
			<h1
				class="mt-8 text-display font-bold text-ink-50"
			>
				Stop reading model reviews.<br />
				<span class="text-accent-500">Build your own benchmark.</span>
			</h1>
			<p class="mt-6 text-lg leading-relaxed text-ink-300 lg:text-xl">
				Public benchmarks tell you which model is best at average tasks. They saturate fast and they
				don't tell you which one to reach for when <em>your</em> messy work hits <em>your</em> desk on
				Tuesday. MyBench is a 45-minute interview that turns your actual work into a private benchmark
				suite — and runs it across <span class="font-mono text-ink-100">model × harness</span> combos
				so you know what to use, when.
			</p>

			<div class="mt-10 flex flex-wrap items-center gap-3">
				<a href="#prompt" class="btn btn-primary">
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
						><path d="M5 12h14M12 5l7 7-7 7" /></svg
					>
					Get the prompt
				</a>
				<a
					href="https://github.com/CodefiLabs/mybench"
					target="_blank"
					rel="noopener"
					class="btn btn-ghost"
				>
					<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"
						><path
							d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.18-.02-2.13-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.27-1.69-1.27-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.69 1.24 3.34.95.1-.74.4-1.24.72-1.53-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11 11 0 015.79 0c2.21-1.5 3.18-1.18 3.18-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.06.78 2.13 0 1.54-.01 2.78-.01 3.16 0 .31.21.67.8.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z"
						/></svg
					>
					View on GitHub
				</a>
				<a href="#how" class="text-sm text-ink-300 underline-offset-4 hover:text-ink-100 hover:underline">
					or, see how it works ↓
				</a>
			</div>
		</div>
	</div>
</header>

<!-- ╭──────────────────────────────────────────────────────────────╮
     │ PROBLEM                                                       │
     ╰──────────────────────────────────────────────────────────────╯ -->
<section class="border-b border-ink-800 bg-ink-900 py-20">
	<div class="container-prose">
		<div class="grid gap-10 lg:grid-cols-3">
			<div>
				<div class="mb-3 font-mono text-xs uppercase tracking-wider text-ink-400">The problem</div>
				<h2 class="text-2xl font-semibold leading-[1.15] text-ink-50">
					Every model release is a swarm of percentage points.
				</h2>
				<p class="mt-4 text-ink-300">
					87.3 vs 67.0 vs 49.8. The numbers come from public benchmarks the labs train against. By
					the time the leaderboard publishes, the test is half-saturated.
				</p>
			</div>
			<div>
				<div class="mb-3 font-mono text-xs uppercase tracking-wider text-ink-400">The miss</div>
				<h2 class="text-2xl font-semibold leading-[1.15] text-ink-50">None of it tells you which one to reach for.</h2>
				<p class="mt-4 text-ink-300">
					Easy benchmarks make all frontier models look interchangeable. The differences only show
					up on real work — underspecified briefs, messy files, traps in the data, ugly judgment
					calls.
				</p>
			</div>
			<div>
				<div class="mb-3 font-mono text-xs uppercase tracking-wider text-ink-400">The fix</div>
				<h2 class="text-2xl font-semibold leading-[1.15] text-ink-50">A private benchmark, tuned to your work.</h2>
				<p class="mt-4 text-ink-300">
					Three to five tests designed to fail the current frontier. Real artifacts. Planted traps.
					Re-run weekly when a new model ships. <em>Then</em> you know.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- ╭──────────────────────────────────────────────────────────────╮
     │ HOW IT WORKS                                                  │
     ╰──────────────────────────────────────────────────────────────╯ -->
<section id="how" class="border-b border-ink-800 bg-ink-800/30 py-20">
	<div class="container-prose">
		<div class="mb-3 font-mono text-xs uppercase tracking-wider text-accent-500">How it works</div>
		<h2 class="text-section font-semibold text-ink-50">
			One prompt. Forty-five minutes. A benchmark suite that's yours.
		</h2>

		<ol class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
			{#each [
				{ n: '01', title: 'Copy the prompt', body: 'Or install it as a skill. Hand it to any AI agent with shell access — Claude Code, Codex, Cursor, Paperclip.' },
				{ n: '02', title: 'Answer the interview', body: 'Six sections covering your real work, your messy data, your taste, your standards. ~45 min.' },
				{ n: '03', title: 'Get a benchmark suite', body: 'Three to five tests with prompts, input files, planted traps, and an evidence guide for scoring.' },
				{ n: '04', title: 'Run model × harness', body: 'Same suite across the combinations you care about. Score using the seven-principle formula.' }
			] as step}
				<li class="rounded-lg border border-ink-800 bg-ink-900 p-6 transition hover:border-ink-700">
					<div class="font-mono text-sm font-semibold text-accent-500">{step.n}</div>
					<h3 class="mt-2 text-lg font-semibold text-ink-50">{step.title}</h3>
					<p class="mt-2 text-sm leading-relaxed text-ink-300">{step.body}</p>
				</li>
			{/each}
		</ol>
	</div>
</section>

<!-- ╭──────────────────────────────────────────────────────────────╮
     │ ARCHETYPES — Nate's three                                     │
     ╰──────────────────────────────────────────────────────────────╯ -->
<section class="border-b border-ink-800 bg-ink-900 py-20">
	<div class="container-prose">
		<div class="mb-3 font-mono text-xs uppercase tracking-wider text-ink-400">The archetypes</div>
		<h2 class="text-section font-semibold text-ink-50">
			Three tests, designed to fail.
		</h2>
		<p class="mt-4 max-w-3xl text-ink-300">
			Nate B. Jones' private bench has three: an executive launch, a dirty data migration, and a 3D
			interactive build. Each tests a different capability. Together they tell a story no single
			benchmark can. Yours will look different — different work, different traps, different
			deliverables — but the shape is the same.
		</p>

		<div class="mt-10 grid gap-5 lg:grid-cols-3">
			{#each archetypes as a}
				<article class="rounded-lg border border-ink-800 bg-ink-800/30 p-6">
					<header class="flex items-baseline justify-between">
						<h3 class="text-xl font-semibold text-ink-50">{a.name}</h3>
						<span class="font-mono text-[10px] uppercase tracking-wider text-ink-400">archetype</span>
					</header>
					<p class="mt-1 text-sm font-medium text-accent-500">{a.subtitle}</p>
					<p class="mt-4 text-sm leading-relaxed text-ink-300">{a.body}</p>
				</article>
			{/each}
		</div>
	</div>
</section>

<!-- ╭──────────────────────────────────────────────────────────────╮
     │ TWO DIMENSIONS                                                │
     ╰──────────────────────────────────────────────────────────────╯ -->
<section class="border-b border-ink-800 bg-ink-800/30 py-20">
	<div class="container-prose">
		<div class="mb-3 font-mono text-xs uppercase tracking-wider text-ink-400">Two dimensions</div>
		<h2 class="text-section font-semibold text-ink-50">
			Score <span class="font-mono text-accent-500">model × harness</span>, not just model.
		</h2>
		<p class="mt-4 max-w-3xl text-ink-300">
			GPT-5.5 in Codex is a different product than GPT-5.5 in chat. Claude Opus in Claude Code is a
			different product than Claude Opus on the API. The harness is half the answer. MyBench scores
			both axes.
		</p>

		<div class="mt-10 flex flex-wrap gap-2">
			{#each harnesses as h}
				<span class="tag font-mono">{h}</span>
			{/each}
		</div>
	</div>
</section>

<!-- ╭──────────────────────────────────────────────────────────────╮
     │ METHODOLOGY                                                   │
     ╰──────────────────────────────────────────────────────────────╯ -->
<section id="methodology" class="border-b border-ink-800 bg-ink-900 py-20">
	<div class="container-prose">
		<div class="mb-3 font-mono text-xs uppercase tracking-wider text-accent-500">Scoring methodology</div>
		<h2 class="text-section font-semibold text-ink-50">
			The LLM never picks a number.
		</h2>
		<p class="mt-4 max-w-3xl text-ink-300">
			MyBench imports the seven-principle scoring methodology from
			<a class="text-accent-500 underline-offset-4 hover:underline" href="https://github.com/CodefiLabs/mybench" target="_blank" rel="noopener">PROJ-ai-judge-scoring</a>: the LLM finds discrete-impact evidence items, math computes the score. Calibrated on 18 hackathon submissions and 342 BLS occupations across 9 models. Validated. Reused here unchanged.
		</p>

		<!-- 7 principles -->
		<ul class="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each principles as p}
				<li class="rounded-lg border border-ink-800 bg-ink-800/30 p-5 transition hover:border-ink-700">
					<div class="flex items-start gap-3">
						<div
							class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-500/10 font-mono text-xs font-bold text-accent-500"
						>
							{p.n}
						</div>
						<div>
							<h3 class="text-sm font-semibold leading-snug text-ink-50">{p.title}</h3>
							<p class="mt-2 text-sm leading-relaxed text-ink-300">{p.body}</p>
						</div>
					</div>
				</li>
			{/each}
		</ul>

		<!-- 5x5 matrix -->
		<div class="mt-16">
			<div class="mb-3 font-mono text-xs uppercase tracking-wider text-ink-400">The 5×5 matrix</div>
			<h3 class="text-2xl font-semibold leading-[1.15] text-ink-50">Five perspectives × five criteria.</h3>
			<p class="mt-3 max-w-3xl text-ink-300">
				Every benchmark scores against this matrix. Customizable per benchmark when the domain
				demands. The formula runs once per criterion; the overall score is a weighted average.
			</p>

			<div class="mt-8 overflow-x-auto rounded-lg border border-ink-800">
				<table class="w-full min-w-[640px] border-collapse text-left text-xs">
					<thead class="bg-ink-800">
						<tr>
							<th class="border-b border-r border-ink-800 px-3 py-3 font-mono text-ink-400"
								>perspective ↓ / criterion →</th
							>
							{#each criteria as c}
								<th class="border-b border-ink-800 px-3 py-3 font-mono text-accent-500">{c.label}</th>
							{/each}
						</tr>
					</thead>
					<tbody class="bg-ink-900">
						{#each perspectives as p, rowIdx}
							<tr class={rowIdx % 2 === 0 ? '' : 'bg-ink-800/30'}>
								<td class="border-r border-ink-800 px-3 py-3 font-mono font-semibold text-ink-200">
									{p}
								</td>
								{#each criteria as _}
									<td class="px-3 py-3 text-ink-500">
										<span class="inline-block h-2 w-2 rounded-full bg-ink-700"></span>
									</td>
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>

		<!-- Formula -->
		<div class="mt-16">
			<div class="mb-3 font-mono text-xs uppercase tracking-wider text-ink-400">The formula</div>
			<h3 class="text-2xl font-semibold leading-[1.15] text-ink-50">Discrete impact → diminishing returns → confidence-weighted.</h3>

			<div class="mt-6 grid gap-4 lg:grid-cols-2">
				<pre
					class="overflow-x-auto rounded-lg border border-ink-800 bg-ink-800/40 p-5 font-mono text-xs leading-relaxed text-ink-200"><code
						>{`# Per criterion (runs 5 times)
net_impact         = sum(item.impact for item in items)
total_items        = len(items)
normalized         = net_impact / sqrt(total_items)
raw                = clamp(50 + normalized * 8.0, 0, 100)
density            = total_items / 20
multiplier         = 0.75 + 0.25 * clamp(density, 0, 1)
final              = round(50 + (raw - 50) * multiplier)
confidence         = clamp(density, 0, 1)`}</code
					></pre>

				<pre
					class="overflow-x-auto rounded-lg border border-ink-800 bg-ink-800/40 p-5 font-mono text-xs leading-relaxed text-ink-200"><code
						>{`# Across criteria (overall)
overall_score       = round(sum(c.final * c.weight))
overall_confidence  = min(c.confidence for c in criteria)
self_check_span     = max(c.final) - min(c.final)
                      # must be >= 20`}</code
					></pre>
			</div>

			<p class="mt-4 text-sm text-ink-400">
				Discrete impact set: <span class="font-mono text-ink-200">{`{+5, +3, +2, +1, -1, -2, -3, -5}`}</span>. Hard cap 5
				items per perspective per criterion per pass. The multiplier never exceeds 1.0 (confirms,
				never amplifies). Sparse evidence is visibly low-confidence, not silently confident.
			</p>
		</div>
	</div>
</section>

<!-- ╭──────────────────────────────────────────────────────────────╮
     │ GET THE PROMPT                                                │
     ╰──────────────────────────────────────────────────────────────╯ -->
<section id="prompt" class="border-b border-ink-800 bg-ink-800/30 py-20">
	<div class="container-prose">
		<div class="mb-3 font-mono text-xs uppercase tracking-wider text-accent-500">Get it</div>
		<h2 class="text-section font-semibold text-ink-50">
			Two ways to start.
		</h2>

		<div class="mt-10 grid gap-6 lg:grid-cols-2">
			<!-- Option A: copy prompt -->
			<div class="rounded-lg border border-ink-800 bg-ink-900 p-6">
				<div class="flex items-baseline justify-between">
					<h3 class="text-lg font-semibold text-ink-50">A · Copy the prompt</h3>
					<span class="font-mono text-[10px] uppercase tracking-wider text-ink-400">simple</span>
				</div>
				<p class="mt-2 text-sm text-ink-300">
					Paste it into Claude Code, Codex CLI, Cursor, Paperclip, or any AI with shell + file
					access. The agent runs the interview and writes the benchmark suite to your working
					directory.
				</p>

				<button onclick={copyPrompt} class="btn btn-primary mt-5 w-full">
					{#if copyState === 'copied'}
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
							><path d="M20 6L9 17l-5-5" /></svg
						>
						Copied — go paste it
					{:else if copyState === 'error'}
						Couldn't copy — select manually below
					{:else}
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
							><rect x="9" y="9" width="13" height="13" rx="2" /><path
								d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"
							/></svg
						>
						Copy interview prompt
					{/if}
				</button>

				<details class="group mt-5 rounded-md border border-ink-800 bg-ink-800/40">
					<summary
						class="cursor-pointer select-none px-4 py-3 font-mono text-xs uppercase tracking-wider text-ink-400 transition hover:text-ink-200"
					>
						Preview the full prompt ↓
					</summary>
					<pre
						class="max-h-96 overflow-auto border-t border-ink-800 p-4 font-mono text-[11px] leading-relaxed text-ink-200"><code
							>{INTERVIEW_PROMPT}</code
						></pre>
				</details>
			</div>

			<!-- Option B: install as skill -->
			<div class="rounded-lg border border-accent-500/30 bg-ink-900 p-6 ring-1 ring-accent-500/10">
				<div class="flex items-baseline justify-between">
					<h3 class="text-lg font-semibold text-ink-50">B · Install as a skill</h3>
					<span class="font-mono text-[10px] uppercase tracking-wider text-accent-500">via skills.sh</span>
				</div>
				<p class="mt-2 text-sm text-ink-300">
					If your agent supports the
					<a class="underline-offset-4 hover:underline" href="https://skills.sh" target="_blank" rel="noopener"
						>skills</a
					> ecosystem (Claude Code, Cursor, Goose, OpenCode, and many others), one command installs MyBench
					as a callable skill.
				</p>

				<div class="mt-5">
					<button
						onclick={copyInstall}
						class="group flex w-full items-center justify-between rounded-md border border-ink-700 bg-ink-800 px-4 py-3 font-mono text-sm text-ink-100 transition hover:border-ink-500"
					>
						<span><span class="text-ink-400">$</span> {INSTALL_CMD}</span>
						{#if installCopyState === 'copied'}
							<span class="text-accent-500">✓ copied</span>
						{:else}
							<svg
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								class="text-ink-400 transition group-hover:text-ink-100"
								><rect x="9" y="9" width="13" height="13" rx="2" /><path
									d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"
								/></svg
							>
						{/if}
					</button>
					<p class="mt-3 text-xs text-ink-400">
						Lists at <a
							class="underline-offset-4 hover:text-ink-200 hover:underline"
							href="https://skills.sh/CodefiLabs/mybench/personal-benchmark"
							target="_blank"
							rel="noopener">skills.sh/CodefiLabs/mybench/personal-benchmark</a
						>.
					</p>
				</div>

				<div class="mt-6 grid grid-cols-2 gap-3 text-xs">
					<div class="rounded-md border border-ink-800 bg-ink-800/40 p-3">
						<div class="font-mono text-[10px] uppercase tracking-wider text-ink-400">Updates</div>
						<div class="mt-1 text-ink-200">Re-install pulls latest</div>
					</div>
					<div class="rounded-md border border-ink-800 bg-ink-800/40 p-3">
						<div class="font-mono text-[10px] uppercase tracking-wider text-ink-400">Open source</div>
						<div class="mt-1 text-ink-200">MIT, fork freely</div>
					</div>
				</div>
			</div>
		</div>

		<!-- After the prompt -->
		<div class="mt-12 rounded-lg border border-ink-800 bg-ink-900 p-6">
			<h3 class="text-lg font-semibold text-ink-50">After the interview</h3>
			<p class="mt-2 text-sm text-ink-300">
				Your benchmark suite lands in <code class="font-mono text-ink-100">benchmarks/</code> in your
				working directory. Each folder has a prompt, input files, planted traps, and an evidence
				guide. Run a benchmark by handing the prompt to a runner (any model + any harness). Score it
				with the seven-principle method. Compare cells in your <span class="font-mono">model × harness</span> grid.
				Re-run weekly when a new model lands.
			</p>
		</div>
	</div>
</section>

<!-- ╭──────────────────────────────────────────────────────────────╮
     │ FOOTER                                                        │
     ╰──────────────────────────────────────────────────────────────╯ -->
<footer class="bg-ink-900 py-12">
	<div class="container-prose">
		<div class="flex flex-col gap-6 border-t border-ink-800 pt-10 sm:flex-row sm:items-center sm:justify-between">
			<div class="flex items-center gap-3">
				<div
					class="flex h-7 w-7 items-center justify-center rounded bg-accent-500 font-mono text-xs font-black text-ink-900"
				>
					M
				</div>
				<span class="font-mono text-xs tracking-wider text-ink-300">MYBENCH · CODEFILABS</span>
			</div>

			<div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
				<a class="text-ink-400 transition hover:text-ink-100" href="https://github.com/CodefiLabs/mybench" target="_blank" rel="noopener">GitHub</a>
				<a class="text-ink-400 transition hover:text-ink-100" href="https://skills.sh/CodefiLabs/mybench/personal-benchmark" target="_blank" rel="noopener">skills.sh</a>
				<a class="text-ink-400 transition hover:text-ink-100" href="https://www.youtube.com/watch?v=9aIYhjeYxzM" target="_blank" rel="noopener">Source video</a>
				<span class="text-ink-500">·</span>
				<span class="text-ink-500">MIT</span>
			</div>
		</div>

		<p class="mt-8 max-w-2xl text-xs leading-relaxed text-ink-500">
			Built on the seven-principle scoring methodology from <em>Don't Let the LLM Pick a Number</em>.
			The methodology is calibrated on 18 hackathon submissions and 342 BLS occupations across 9
			models. Inspired by Nate B. Jones' private benchmark approach. The pairwise scoring layer
			borrows from lechmazur/writing-style. Real artifact format-as-test is borrowed directly from
			Nate.
		</p>
	</div>
</footer>
