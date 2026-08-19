<script lang="ts">
	let {
		email,
		phone,
		address,
		instagramLink,
		arenaLink,
		linkedinLink,
	}: {
		email?: string;
		phone?: string;
		address?: string;
		instagramLink?: string;
		arenaLink?: string;
		linkedinLink?: string;
	} = $props();
</script>

<div class="info text-body">
	<div class="component-title text-body">Information</div>
	<div class="info-inner">
		{#if address}
			<div class="col-7 col-tablet-10 col-mobile-5">
				<div class="info-address">{address}</div>
			</div>
		{/if}
		
		{#if email}
			<div class="col-3 col-tablet-10 col-mobile-5">
				<a class="info-email" href="mailto:{email}">{email}</a>
			</div>
		{/if}
		{#if phone}
			<div class="col-2 col-tablet-10 col-mobile-2">
				<a class="info-phone" href="tel:{phone}">{phone}</a>
			</div>
		{/if}
		{#if instagramLink}
			<div class="col-2 col-tablet-10 col-mobile-2">
				<a
					class="info-instagram"
					href={instagramLink}
					target="_blank"
					rel="noopener noreferrer">Instagram ↗</a
				>
			</div>
		{/if}
		{#if arenaLink}
			<div class="col-2 col-tablet-10 col-mobile-2">
				<a
					class="info-arena"
					href={arenaLink}
					target="_blank"
					rel="noopener noreferrer">Are.na ↗</a
				>
			</div>
		{/if}
		{#if linkedinLink}
			<div class="col-2 col-tablet-10 col-mobile-2">
				<a
					class="info-linkedin"
					href={linkedinLink}
					target="_blank"
					rel="noopener noreferrer">LinkedIn ↗</a
				>
			</div>
		{/if}
	</div>
</div>

<style>
	.info-inner {
		display: block;
		/* flex-wrap: wrap;
		gap: var(--spacing); */
	}
</style>
