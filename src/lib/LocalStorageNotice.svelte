<script>
	import { onMount } from "svelte";

	let noticeVisible = false;

	onMount(() => {
		if (!localStorage.getItem('accepted_usage')) {
			noticeVisible = true;
		}
	});

	function acceptLocalStorageUsage() {
		localStorage.setItem('accepted_usage', 'true');
		noticeVisible = false;
	}

	function declineLocalStorageUsage() {
		noticeVisible = false;
	}
</script>

{#if noticeVisible}
	<div class="notice">
		<p>
			This app uses your browser's <b>local storage</b> to save your shopping
			lists and OSRS item data retrieved from <a
				href="https://prices.runescape.wiki/api"
				target="_blank"
				rel="noopener noreferrer">https://prices.runescape.wiki/api</a
			>.
			<br />
			By using this site, you consent to storing text data in your browser's
			<b>local storage</b>.
		</p>

		<button
			aria-label="Accept"
			class="button is-success"
			onclick={acceptLocalStorageUsage}
		>
			<span class="icon-text">
				<span class="icon">
					<i class="fas fa-check"></i>
				</span>
				<span>Accept</span>
			</span>
		</button>
		<button
			aria-label="Decline"
			class="button is-danger"
			onclick={declineLocalStorageUsage}
		>
			<span class="icon-text">
				<span class="icon">
					<i class="fas fa-xmark"></i>
				</span>
				<span>Decline</span>
			</span>
		</button>
	</div>
{/if}

<style>
	.notice {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		color: white;
		background-color: var(--bulma-border);
		text-align: center;
		padding: 10px;
		font-size: 14px;
	}

	.notice button {
		margin: 5px;
	}
</style>
