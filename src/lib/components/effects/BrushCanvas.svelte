<script lang="ts">
	import { brushState } from '$lib/state/brush.svelte';

	let canvasEl: HTMLCanvasElement | undefined = $state();
	let ctx: CanvasRenderingContext2D | null = null;

	function resizeCanvas() {
		if (!canvasEl || !ctx) return;
		const dpr = window.devicePixelRatio || 1;
		canvasEl.width = window.innerWidth * dpr;
		canvasEl.height = window.innerHeight * dpr;
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		ctx.strokeStyle = 'red';
		ctx.lineWidth = 1;
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
	}

	$effect(() => {
		if (!canvasEl) return;

		ctx = canvasEl.getContext('2d');

		resizeCanvas();
		window.addEventListener('resize', resizeCanvas);

		return () => window.removeEventListener('resize', resizeCanvas);
	});

	// Listening on window (not the canvas element) means drawing doesn't
	// depend on the canvas actually being hit-tested at the cursor's
	// position — it keeps working no matter what's visually stacked above
	// it. A click or scroll anywhere ends the session; clicking the Brush
	// button again (which stops propagation) starts a new one.
	$effect(() => {
		if (!brushState.active) return;

		let hasMoved = false;

		const move = (e: PointerEvent) => {
			if (!ctx) return;

			if (!hasMoved) {
				ctx.beginPath();
				ctx.moveTo(e.clientX, e.clientY);
				hasMoved = true;
				return;
			}

			ctx.lineTo(e.clientX, e.clientY);
			ctx.stroke();
		};

		const reset = () => {
			brushState.active = false;
		};

		window.addEventListener('pointermove', move);
		document.addEventListener('click', reset);
		window.addEventListener('scroll', reset, { passive: true });

		return () => {
			window.removeEventListener('pointermove', move);
			document.removeEventListener('click', reset);
			window.removeEventListener('scroll', reset);
		};
	});
</script>

{#if brushState.active}
	<canvas bind:this={canvasEl} class="brush-canvas"></canvas>
{/if}

<style>
	.brush-canvas {
		position: fixed;
		inset: 0;
		width: 100vw;
		height: 100vh;
		z-index: -10000;
		touch-action: none;
	}
</style>
