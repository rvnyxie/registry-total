<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { Label, Input, Button } from 'flowbite-svelte';

	type userType = {
		user_id: number;
		username: string;
		password: string;
		is_admin: boolean;
		email?: string;
		created_time?: string;
		last_update?: string;
		inspection_station_id?: string;
	};

	let accountData: userType

	try {
		let localAccounts = localStorage.getItem('accounts');
		if (localAccounts !== null) {
			localAccounts = JSON.parse(localAccounts);
			let currentUsername = localStorage.getItem('username') ?? '';

			// @ts-ignore
			accountData = localAccounts.find((account) => {
				if (account.username === currentUsername) {
					return account;
				}
			});
		}
	} catch (error) {
		console.error(error);
	}
</script>

<div class="grow w-4/5 rounded-xl p-4 bg-gray-50 overflow-scroll text-brown">
	<form method="POST" action="" use:enhance on:submit|preventDefault>
		<Label class="space-y-2">
			<span>User ID</span>
			<Input type="text" name="user_id" placeholder="a number" value={accountData?.user_id} />
		</Label>
		<Label class="space-y-2">
			<span>Username</span>
			<Input type="text" name="username" placeholder="username" value={accountData?.username} />
		</Label>
		<Label class="space-y-2">
			<span>Password</span>
			<Input
				type="text"
				name="password"
				placeholder="•••••"
				value={accountData?.password}
				required
			/>
		</Label>
		<Label class="space-y-2">
			<span>Is admin</span>
			<Input
				type="text"
				name="is_admin"
				placeholder="yes/no"
				value={accountData?.is_admin}
				required
			/>
		</Label>
		<Label class="space-y-2">
			<span>Email</span>
			<Input type="email" name="email" placeholder="name@company.com" value={accountData?.email} />
		</Label>
		<Label class="space-y-2">
			<span>Created Time</span>
			<Input
				type="date"
				name="created_time"
				placeholder="2023-06-01"
				value={accountData?.created_time}
			/>
		</Label>
		<Label class="space-y-2">
			<span>Last Update</span>
			<Input
				type="date"
				name="last_update"
				placeholder="2023-06-15"
				value={accountData?.last_update}
			/>
		</Label>
		<Label class="space-y-2">
			<span>Inspection Station ID</span>
			<Input
				type="text"
				name="inspection_station_id"
				placeholder="station0"
				value={accountData?.inspection_station_id}
			/>
		</Label>
	</form>

	<Button 
		color="red" 
		class="mt-4" 
		on:click={() => {
			localStorage.removeItem('loggedIn')
			localStorage.removeItem('role')
			localStorage.removeItem('username')

			goto('/login')
		}}
	>
		Sign out
	</Button>
</div>
