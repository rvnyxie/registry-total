<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="grow w-4/5 rounded-xl p-4 bg-primary_color overflow-scroll">
	<h1 class="text-error_red text-center font-semibold text-xl">
		{$page.status}: {$page.error?.message}
	</h1>
</div>
