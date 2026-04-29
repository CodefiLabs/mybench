<script>
	import '../app.css';

	let { children } = $props();
</script>

<a
	href="#main"
	class="absolute left-4 top-4 z-50 -translate-y-20 rounded-md bg-ink-strong px-4 py-2 text-sm font-semibold text-paper transition-transform focus:translate-y-0"
>
	Skip to content
</a>

<main id="main">
	{@render children()}
</main>
