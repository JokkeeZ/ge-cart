<script>
	import { base } from '$app/paths';
	export let subtitleText = '';
</script>

<div class="columns is-mobile is-centered is-vcentered">
	<div class="column has-text-centered">
		<a href="{base}/" class="title">GE CART</a>
		<p class="subtitle">
			{@html subtitleText}
		</p>
	</div>
</div>
