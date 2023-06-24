<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';

	import { Label, Input, Button } from 'flowbite-svelte';

	export let data: PageData;

	const userData = data.user;

	function formatDate(date: Date) {
		const options = {
			weekday: 'long',
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
			second: 'numeric'
		};

		return date.toLocaleDateString('en-US', options);
	}
</script>

<div class="grow w-4/5 rounded-xl p-4 bg-gray-50 overflow-scroll text-brown">
	<form method="POST" action="?/logout" use:enhance>
		<Label class="space-y-2 mb-2">
			<span class="font-bold text-brown">Username</span>
			<Input
				type="text"
				name="username"
				placeholder="username"
				class="!text-brown font-medium"
				value={userData?.username}
				readonly
			/>
		</Label>
		<Label class="space-y-2 mb-2">
			<span class="font-bold text-brown">Is admin</span>
			<Input
				type="text"
				name="isAdmin"
				placeholder="yes/no"
				class="!text-brown font-medium"
				value={userData?.isAdmin}
				readonly
			/>
		</Label>
		<Label class="space-y-2 mb-2">
			<span class="font-bold text-brown">Email</span>
			<Input
				type="email"
				name="email"
				placeholder="name@company.com"
				class="!text-brown font-medium"
				value={userData?.email}
				readonly
			/>
		</Label>
		<Label class="space-y-2 mb-2">
			<span class="font-bold text-brown">Created Time</span>
			<Input
				type="text"
				name="createdAt"
				placeholder="Monday, Jun 20, 2020, 20:20:20 AM"
				class="!text-brown font-medium"
				value={userData?.createdAt ? formatDate(userData?.createdAt) : ''}
				readonly
			/>
		</Label>
		<Label class="space-y-2 mb-2">
			<span class="font-bold text-brown">Last Update</span>
			<Input
				type="text"
				name="updatedAt"
				placeholder="Monday, Jun 20, 2020, 20:20:20 AM"
				class="!text-brown font-medium"
				value={userData?.updatedAt ? formatDate(userData?.updatedAt) : ''}
				readonly
			/>
		</Label>
		<Label class="space-y-2 mb-2">
			<span class="font-bold text-brown">Inspection Station ID</span>
			<Input
				type="text"
				name="inspectionStationId"
				placeholder="An id number here..."
				class="!text-brown font-medium"
				value={userData?.inspectionStation?.id}
				readonly
			/>
		</Label>
		<Label class="space-y-2 mb-2">
			<span class="font-bold text-brown">Inspection Station Name</span>
			<Input
				type="text"
				name="inspectionStationName"
				placeholder="Sample Station Name here..."
				class="!text-brown font-medium"
				value={userData?.inspectionStation?.stationName}
				readonly
			/>
		</Label>

		<Button type="submit" color="red" class="mt-4">Sign out</Button>
	</form>
</div>
