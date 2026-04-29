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
<header class="border-b border-rule">
	<div class="container-prose pt-12 pb-20 lg:pt-20 lg:pb-32">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-3">
				<div
					class="flex h-9 w-9 items-center justify-center rounded-md border-[1.5px] border-ink-strong text-base font-bold text-ink-strong"
				>
					M
				</div>
				<span class="font-mono text-sm font-semibold tracking-wider text-ink">MYBENCH</span>
			</div>
			<nav class="flex items-center gap-6 text-sm">
				<a class="text-ink-soft transition hover:text-ink" href="#how">How it works</a>
				<a class="text-ink-soft transition hover:text-ink" href="#methodology">Methodology</a>
				<a class="text-ink-soft transition hover:text-ink" href="#prompt">Get the prompt</a>
				<a
					class="hidden md:inline text-ink-soft transition hover:text-ink"
					href="https://github.com/CodefiLabs/mybench"
					target="_blank"
					rel="noopener">GitHub</a
				>
			</nav>
		</div>

		<div class="mt-16 max-w-3xl lg:mt-24">
			<p class="text-sm text-ink-faint">After Nate B. Jones' private bench: Dingo, Splash Brothers, Artemis II.</p>
			<h1
				class="mt-8 text-display font-bold text-ink-strong"
			>
				Stop reading model reviews.<br />
				<span class="text-mark">Build your own benchmark.</span>
			</h1>
			<p class="mt-6 text-lg leading-relaxed text-ink-soft lg:text-xl">
				Public benchmarks tell you which model is best at average tasks. They saturate fast and they
				don't tell you which one to reach for when <em>your</em> messy work hits <em>your</em> desk on
				Tuesday. MyBench is a 45-minute interview that turns your actual work into a private benchmark
				suite — and runs it across <span class="font-mono text-ink">model × harness</span> combos
				so you know what to use, when.
			</p>

			<div class="mt-12 flex flex-wrap items-baseline gap-x-8 gap-y-3">
				<a href="#prompt" class="btn btn-primary">
					Get the prompt
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
						><path d="M5 12h14M12 5l7 7-7 7" /></svg
					>
				</a>
				<a href="#how" class="text-sm text-ink-soft underline underline-offset-[6px] decoration-rule hover:decoration-ink-strong hover:text-ink-strong">
					see how it works ↓
				</a>
			</div>
		</div>
	</div>
</header>

<!-- ╭──────────────────────────────────────────────────────────────╮
     │ PROBLEM                                                       │
     ╰──────────────────────────────────────────────────────────────╯ -->
<section class="border-b border-rule py-16 lg:py-20">
	<div class="container-prose">
		<div class="grid gap-x-10 gap-y-12 lg:grid-cols-3">
			<div>
				<h2 class="text-2xl font-semibold leading-[1.15] text-ink-strong">
					Every model release is a swarm of percentage points.
				</h2>
				<p class="mt-4 text-ink-soft">
					87.3 vs 67.0 vs 49.8. The numbers come from public benchmarks the labs train against. By
					the time the leaderboard publishes, the test is half-saturated.
				</p>
			</div>
			<div>
				<h2 class="text-2xl font-semibold leading-[1.15] text-ink-strong">None of it tells you which one to reach for.</h2>
				<p class="mt-4 text-ink-soft">
					Easy benchmarks make all frontier models look interchangeable. The differences only show
					up on real work — underspecified briefs, messy files, traps in the data, ugly judgment
					calls.
				</p>
			</div>
			<div>
				<h2 class="text-2xl font-semibold leading-[1.15] text-ink-strong">A private benchmark, tuned to your work.</h2>
				<p class="mt-4 text-ink-soft">
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
<section id="how" class="border-b border-rule py-20 lg:py-24">
	<div class="container-prose">
		<h2 class="text-section font-semibold text-ink-strong">
			One prompt. Forty-five minutes. A benchmark suite that's yours.
		</h2>

		<ol class="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
			{#each [
				{ n: '01', title: 'Copy the prompt', body: 'Or install it as a skill. Hand it to any AI agent with shell access — Claude Code, Codex, Cursor, Paperclip.' },
				{ n: '02', title: 'Answer the interview', body: 'Six sections covering your real work, your messy data, your taste, your standards. ~45 min.' },
				{ n: '03', title: 'Get a benchmark suite', body: 'Three to five tests with prompts, input files, planted traps, and an evidence guide for scoring.' },
				{ n: '04', title: 'Run model × harness', body: 'Same suite across the combinations you care about. Score using the seven-principle formula.' }
			] as step}
				<li class="border-t border-rule pt-4">
					<div class="font-mono text-3xl font-semibold text-ink-strong">{step.n}</div>
					<h3 class="mt-3 text-lg font-semibold text-ink-strong">{step.title}</h3>
					<p class="mt-2 text-sm leading-relaxed text-ink-soft">{step.body}</p>
				</li>
			{/each}
		</ol>
	</div>
</section>

<!-- ╭──────────────────────────────────────────────────────────────╮
     │ ARCHETYPES — Nate's three                                     │
     ╰──────────────────────────────────────────────────────────────╯ -->
<section class="border-b border-rule py-24 lg:py-32">
	<div class="container-prose">
		<h2 class="text-section font-semibold text-ink-strong">
			Three tests, designed to fail.
		</h2>
		<p class="mt-4 max-w-3xl text-ink-soft">
			Nate B. Jones' private bench has three: an executive launch, a dirty data migration, and a 3D
			interactive build. Each tests a different capability. Together they tell a story no single
			benchmark can. Yours will look different — different work, different traps, different
			deliverables — but the shape is the same.
		</p>

		<div class="mt-14 divide-y divide-rule border-t border-rule">
			{#each archetypes as a}
				<article class="grid gap-2 py-8 lg:grid-cols-[12rem_1fr] lg:gap-10 lg:py-10">
					<div>
						<h3 class="text-2xl font-semibold text-ink-strong">{a.name}</h3>
						<p class="mt-1 text-sm italic text-ink-soft">{a.subtitle}</p>
					</div>
					<p class="leading-relaxed text-ink-soft lg:max-w-2xl">{a.body}</p>
				</article>
			{/each}
		</div>
	</div>
</section>

<!-- ╭──────────────────────────────────────────────────────────────╮
     │ TWO DIMENSIONS                                                │
     ╰──────────────────────────────────────────────────────────────╯ -->
<section class="border-b border-rule py-16 lg:py-20">
	<div class="container-prose">
		<h2 class="text-section font-semibold text-ink-strong">
			Score <span class="font-mono font-semibold text-ink-strong">model × harness</span>, not just model.
		</h2>
		<p class="mt-4 max-w-3xl text-ink-soft">
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
<section id="methodology" class="border-b border-rule py-24 lg:py-32">
	<div class="container-prose">
		<h2 class="text-section font-semibold text-ink-strong">
			The LLM never picks a number.
		</h2>
		<p class="mt-4 max-w-3xl text-ink-soft">
			MyBench imports the seven-principle scoring methodology from
			<a class="text-ink-strong underline underline-offset-4 decoration-rule hover:decoration-ink-strong" href="https://github.com/CodefiLabs/mybench" target="_blank" rel="noopener">PROJ-ai-judge-scoring</a>: the LLM finds discrete-impact evidence items, math computes the score. Calibrated on 18 hackathon submissions and 342 BLS occupations across 9 models. Validated. Reused here unchanged.
		</p>

		<!-- 7 principles -->
		<ol class="mt-14 grid gap-x-12 gap-y-2 sm:grid-cols-2">
			{#each principles as p}
				<li class="grid grid-cols-[2.5rem_1fr] items-baseline gap-x-3 border-t border-rule py-5">
					<span class="font-mono text-sm font-semibold text-ink-faint">0{p.n}</span>
					<div>
						<h3 class="text-base font-semibold leading-snug text-ink-strong">{p.title}</h3>
						<p class="mt-2 text-sm leading-relaxed text-ink-soft">{p.body}</p>
					</div>
				</li>
			{/each}
		</ol>

		<!-- 5x5 matrix -->
		<div class="mt-16">
			<h3 class="text-2xl font-semibold leading-[1.15] text-ink-strong">Five perspectives × five criteria.</h3>
			<p class="mt-3 max-w-3xl text-ink-soft">
				Every benchmark scores against this matrix. Customizable per benchmark when the domain
				demands. The formula runs once per criterion; the overall score is a weighted average.
			</p>

			<div class="mt-8 overflow-x-auto rounded-lg border border-rule">
				<table class="w-full min-w-[640px] border-collapse text-left text-xs">
					<thead class="bg-paper-sunk">
						<tr>
							<th class="border-b border-r border-rule px-3 py-3 font-mono text-ink-faint"
								>perspective ↓ / criterion →</th
							>
							{#each criteria as c}
								<th class="border-b border-rule px-3 py-3 font-mono text-ink-soft">{c.label}</th>
							{/each}
						</tr>
					</thead>
					<tbody class="bg-paper">
						{#each perspectives as p, rowIdx}
							<tr class={rowIdx % 2 === 0 ? '' : 'bg-paper-sunk'}>
								<td class="border-r border-rule px-3 py-3 font-mono font-semibold text-ink">
									{p}
								</td>
								{#each criteria as _}
									<td class="px-3 py-3 text-ink-faint">
										<span class="inline-block h-2 w-2 rounded-full bg-rule"></span>
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
			<h3 class="text-2xl font-semibold leading-[1.15] text-ink-strong">Discrete impact → diminishing returns → confidence-weighted.</h3>

			<div class="mt-6 grid gap-4 lg:grid-cols-2">
				<pre
					class="overflow-x-auto rounded-lg border border-rule bg-paper-sunk p-5 font-mono text-xs leading-relaxed text-ink"><code
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
					class="overflow-x-auto rounded-lg border border-rule bg-paper-sunk p-5 font-mono text-xs leading-relaxed text-ink"><code
						>{`# Across criteria (overall)
overall_score       = round(sum(c.final * c.weight))
overall_confidence  = min(c.confidence for c in criteria)
self_check_span     = max(c.final) - min(c.final)
                      # must be >= 20`}</code
					></pre>
			</div>

			<p class="mt-4 text-sm text-ink-faint">
				Discrete impact set: <span class="font-mono text-ink">{`{+5, +3, +2, +1, -1, -2, -3, -5}`}</span>. Hard cap 5
				items per perspective per criterion per pass. The multiplier never exceeds 1.0 (confirms,
				never amplifies). Sparse evidence is visibly low-confidence, not silently confident.
			</p>
		</div>
	</div>
</section>

<!-- ╭──────────────────────────────────────────────────────────────╮
     │ GET THE PROMPT                                                │
     ╰──────────────────────────────────────────────────────────────╯ -->
<section id="prompt" class="border-b border-rule py-24 lg:py-32">
	<div class="container-prose">
		<h2 class="text-section font-semibold text-ink-strong">
			Two ways to start.
		</h2>

		<div class="mt-10 grid gap-6 lg:grid-cols-2">
			<!-- Option A: copy prompt -->
			<div class="rounded-lg border border-rule bg-paper p-6">
				<h3 class="text-lg font-semibold text-ink-strong">A · Copy the prompt</h3>
				<p class="mt-2 text-sm text-ink-soft">
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

				<details class="group mt-5 rounded-md border border-rule bg-paper-sunk">
					<summary
						class="cursor-pointer select-none px-4 py-3 text-sm text-ink-soft transition hover:text-ink-strong"
					>
						Preview the full prompt ↓
					</summary>
					<pre
						class="max-h-96 overflow-auto border-t border-rule p-4 font-mono text-[11px] leading-relaxed text-ink"><code
							>{INTERVIEW_PROMPT}</code
						></pre>
				</details>
			</div>

			<!-- Option B: install as skill -->
			<div class="rounded-lg border border-ink-strong bg-paper p-6">
				<h3 class="text-lg font-semibold text-ink-strong">B · Install as a skill <span class="text-sm font-normal text-ink-faint">via skills.sh</span></h3>
				<p class="mt-2 text-sm text-ink-soft">
					If your agent supports the
					<a class="underline-offset-4 hover:underline" href="https://skills.sh" target="_blank" rel="noopener"
						>skills</a
					> ecosystem (Claude Code, Cursor, Goose, OpenCode, and many others), one command installs MyBench
					as a callable skill.
				</p>

				<div class="mt-5">
					<button
						onclick={copyInstall}
						class="group flex w-full items-center justify-between rounded-md border border-rule bg-paper-sunk px-4 py-3 font-mono text-sm text-ink transition hover:border-ink-soft"
					>
						<span><span class="text-ink-faint">$</span> {INSTALL_CMD}</span>
						{#if installCopyState === 'copied'}
							<span class="font-semibold text-ink-strong">✓ copied</span>
						{:else}
							<svg
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								class="text-ink-faint transition group-hover:text-ink"
								><rect x="9" y="9" width="13" height="13" rx="2" /><path
									d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"
								/></svg
							>
						{/if}
					</button>
					<p class="mt-3 text-xs text-ink-faint">
						Lists at <a
							class="underline-offset-4 hover:text-ink hover:underline"
							href="https://skills.sh/CodefiLabs/mybench/personal-benchmark"
							target="_blank"
							rel="noopener">skills.sh/CodefiLabs/mybench/personal-benchmark</a
						>.
					</p>
				</div>

				<dl class="mt-6 grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
					<dt class="text-ink-faint">Updates</dt>
					<dd class="text-ink">Re-install pulls latest</dd>
					<dt class="text-ink-faint">License</dt>
					<dd class="text-ink">MIT, fork freely</dd>
				</dl>
			</div>
		</div>

		<!-- After the prompt -->
		<div class="mt-16 border-t border-rule pt-8">
			<h3 class="text-lg font-semibold text-ink-strong">After the interview</h3>
			<p class="mt-3 max-w-3xl text-ink-soft">
				Your benchmark suite lands in <code class="font-mono text-ink">benchmarks/</code> in your
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
<footer class="bg-paper py-12">
	<div class="container-prose">
		<div class="flex flex-col gap-6 border-t border-rule pt-10 sm:flex-row sm:items-center sm:justify-between">
			<div class="flex items-center gap-3">
				<div
					class="flex h-7 w-7 items-center justify-center rounded border-[1.5px] border-ink-strong text-xs font-bold text-ink-strong"
				>
					M
				</div>
				<span class="font-mono text-xs tracking-wider text-ink-soft">MYBENCH · CODEFILABS</span>
			</div>

			<div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
				<a class="text-ink-faint transition hover:text-ink" href="https://github.com/CodefiLabs/mybench" target="_blank" rel="noopener">GitHub</a>
				<a class="text-ink-faint transition hover:text-ink" href="https://skills.sh/CodefiLabs/mybench/personal-benchmark" target="_blank" rel="noopener">skills.sh</a>
				<a class="text-ink-faint transition hover:text-ink" href="https://www.youtube.com/watch?v=9aIYhjeYxzM" target="_blank" rel="noopener">Source video</a>
				<span class="text-ink-faint">·</span>
				<span class="text-ink-faint">MIT</span>
			</div>
		</div>

		<p class="mt-8 max-w-2xl text-xs leading-relaxed text-ink-faint">
			Built on the seven-principle scoring methodology from <em>Don't Let the LLM Pick a Number</em>.
			The methodology is calibrated on 18 hackathon submissions and 342 BLS occupations across 9
			models. Inspired by Nate B. Jones' private benchmark approach. The pairwise scoring layer
			borrows from lechmazur/writing-style. Real artifact format-as-test is borrowed directly from
			Nate.
		</p>
	</div>
</footer>
