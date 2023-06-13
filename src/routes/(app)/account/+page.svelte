<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { Label, Input, Button, Modal } from 'flowbite-svelte';
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Checkbox
	} from 'flowbite-svelte';
	import { onMount, afterUpdate } from 'svelte';

	export let form;

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

	let default_accounts = [
		{
			user_id: 1,
			username: 'ntn',
			password: '1',
			is_admin: true,
			email: 'ntn@mail.com',
			created_time: '2023-05-15',
			last_update: '2023-06-13',
			inspection_station_id: ''
		},
		{
			user_id: 2,
			username: 'guest',
			password: '2',
			is_admin: false,
			email: 'guest@mail.com',
			created_time: '2023-05-20',
			last_update: '2023-06-13',
			inspection_station_id: 'station1'
		}
	];

	// assign value early to prevent 500 error
	// get value from local storage too soon give 500 error
	let accounts: userType[] = default_accounts

	console.log(accounts);

	onMount(() => {
		// normal user not allowed to access this page
		const isAdmin = localStorage.getItem('role');
		if (isAdmin === 'not_admin') {
			goto('/');
		}

		let localAccounts = localStorage.getItem('accounts') as string;

		if (localAccounts !== null) {
			accounts = JSON.parse(localAccounts);
		} else {
			accounts = default_accounts;
		}
	});

	afterUpdate(() => {
		// handle form add and edit
		if (form?.changeStatus && form?.user_id) {
			const receivedAccount: userType = {
				user_id: parseInt(form.user_id),
				username: form.username,
				password: form.password,
				is_admin: Boolean(form.is_admin === 'yes' ? 'true' : ''),
				email: form.email,
				created_time: form.created_time,
				last_update: form.last_update,
				inspection_station_id: form.inspection_station_id
			};

			if (form?.action_type === 'add_user') {
				accounts = [...accounts, receivedAccount];
			} else if (form?.action_type === 'edit_user') {
				const updatedAccounts = accounts.map((account) => {
					if (account.user_id === receivedAccount.user_id) {
						return receivedAccount;
					}
				}) as userType[];

				accounts = updatedAccounts;
			}

			// update local storage
			localStorage.setItem('accounts', JSON.stringify(accounts));

			form.changeStatus = false;

			console.log(accounts);
		}

		// handle form delete
		if (form?.deleteStatus && form?.user_id) {
			const indexOfDeletedUser = accounts.findIndex(
				(user) => user.user_id.toString() === form?.user_id
			);
			accounts.splice(indexOfDeletedUser, 1);

			// update local storage
			localStorage.setItem('accounts', JSON.stringify(accounts));

			form.deleteStatus = false;
		}
	});

	let newAndEditFormModal = false;
	let deleteFormModal = false;

	let currentEditingAccount: {
		user_id?: any;
		username?: string;
		password?: string;
		is_admin?: boolean;
		email?: string | undefined;
		created_time?: string | undefined;
		last_update?: string | undefined;
		inspection_station_id?: string | undefined;
	};

	let listOfSelectedUser: number[] = [];
</script>

<div class="w-1/2 bg-primary_color">
	<form method="POST" class="bg-secondary_color" use:enhance>
		<Label for="search" class="" />
		<Input
			name="search"
			id="search"
			placeholder="Enter your text here"
			size="md"
			class="bg-primary_color rounded-xl h-9 border-none"
		>
			<Button
				slot="right"
				type="submit"
				class="w-26 h-7 text-xs rounded-[10px] shadow-[2px_4px_4px_0px_rgba(0,0,0,0.3)]"
			>
				<p class="text-[0.65rem] font-semibold">Search</p>
				<svg
					aria-hidden="true"
					class="w-4 h-4 ml-2 text-white"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/></svg
				>
			</Button>
		</Input>
	</form>
</div>

<div class="grow w-4/5 rounded-xl p-4 bg-gray-50 overflow-scroll">
	<div class="flex justify-end">
		{#if listOfSelectedUser.length >= 1}
			<Button
				class="mb-2"
				size="xs"
				on:click={() => {
					deleteFormModal = true;
				}}
			>
				Delete Selected
			</Button>
		{/if}
		<Button
			class="mb-2"
			size="xs"
			on:click={() => {
				newAndEditFormModal = true;
				currentEditingAccount = {};
			}}
		>
			New
		</Button>
	</div>
	<Table hoverable={true} striped={true} color="default">
		<TableHead class="bg-gray-200">
			<TableHeadCell class="!p-4">
				<Checkbox />
			</TableHeadCell>
			<TableHeadCell>User ID</TableHeadCell>
			<TableHeadCell>Username</TableHeadCell>
			<TableHeadCell>Password</TableHeadCell>
			<TableHeadCell>Admin</TableHeadCell>
			<TableHeadCell>Email</TableHeadCell>
			<TableHeadCell>Created Time</TableHeadCell>
			<TableHeadCell>Last Update</TableHeadCell>
			<TableHeadCell>Inspection Station ID</TableHeadCell>
			<TableHeadCell>Actions</TableHeadCell>
			<TableHeadCell>
				<span class="sr-only"> Edit </span>
			</TableHeadCell>
			<TableHeadCell>
				<span class="sr-only"> Delete </span>
			</TableHeadCell>
		</TableHead>
		<TableBody>
			{#each accounts as account}
				<TableBodyRow>
					<TableBodyCell class="!p-4">
						<Checkbox
							on:click={() => {
								const index = listOfSelectedUser.findIndex(
									(user_id) => (account.user_id = user_id)
								);

								if (index === -1) {
									listOfSelectedUser = [...listOfSelectedUser, account.user_id];
								} else {
									listOfSelectedUser.splice(index, 1);
								}
							}}
						/>
					</TableBodyCell>
					<TableBodyCell>{account?.user_id}</TableBodyCell>
					<TableBodyCell>{account?.username}</TableBodyCell>
					<TableBodyCell>{account?.password}</TableBodyCell>
					<TableBodyCell>{account?.is_admin}</TableBodyCell>
					<TableBodyCell>{account?.email}</TableBodyCell>
					<TableBodyCell>{account?.created_time}</TableBodyCell>
					<TableBodyCell>{account?.last_update}</TableBodyCell>
					<TableBodyCell>{account?.inspection_station_id}</TableBodyCell>
					<TableBodyCell>
						<Button
							size="xs"
							color="dark"
							on:click={() => {
								newAndEditFormModal = true;
								currentEditingAccount = account;
							}}
						>
							Edit
						</Button>
						<Button
							size="xs"
							color="red"
							on:click={() => {
								deleteFormModal = true;
								currentEditingAccount = account;
							}}
						>
							Delete
						</Button>
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>

		<Modal bind:open={newAndEditFormModal} outsideclose={true} size="md" class="w-full">
			<form method="POST" action="?/changeUser" use:enhance>
				<Label class="space-y-2">
					<span>User ID</span>
					<Input
						type="text"
						name="user_id"
						placeholder="a number"
						value={currentEditingAccount?.user_id}
					/>
				</Label>
				<Label class="space-y-2">
					<span>Username</span>
					<Input
						type="text"
						name="username"
						placeholder="username"
						value={currentEditingAccount?.username}
					/>
				</Label>
				<Label class="space-y-2">
					<span>Password</span>
					<Input
						type="password"
						name="password"
						placeholder="•••••"
						value={currentEditingAccount?.password}
						required
					/>
				</Label>
				<Label class="space-y-2">
					<span>Is admin</span>
					<Input
						type="text"
						name="is_admin"
						placeholder="yes/no"
						value={currentEditingAccount?.is_admin}
						required
					/>
				</Label>
				<Label class="space-y-2">
					<span>Email</span>
					<Input
						type="email"
						name="email"
						placeholder="name@company.com"
						value={currentEditingAccount?.email}
					/>
				</Label>
				<Label class="space-y-2">
					<span>Created Time</span>
					<Input
						type="date"
						name="created_time"
						placeholder="2023-06-01"
						value={currentEditingAccount?.created_time}
					/>
				</Label>
				<Label class="space-y-2">
					<span>Last Update</span>
					<Input
						type="date"
						name="last_update"
						placeholder="2023-06-15"
						value={currentEditingAccount?.last_update}
					/>
				</Label>
				<Label class="space-y-2">
					<span>Inspection Station ID</span>
					<Input
						type="text"
						name="inspection_station_id"
						placeholder="station0"
						value={currentEditingAccount?.inspection_station_id}
					/>
				</Label>

				<div class="flex flex-row items-center justify-center">
					<!-- currentEditingAccount is modified based on which button user click -->
					{#if currentEditingAccount?.user_id === undefined}
						<!-- Add new user -->
						<Input type="text" name="action_type" value="add_user" class="hidden" />
						<Button type="button" color="red" on:click={() => (newAndEditFormModal = false)}
							>Cancel</Button
						>
						<Button
							type="submit"
							class="my-4 rounded-xl bg-light_green text-[#675D50] hover:bg-orange hover:text-white m-2"
							color="none">Add</Button
						>
					{:else}
						<!-- Edit user -->
						<Input type="text" name="action_type" value="edit_user" class="hidden" />
						<Button type="button" color="alternative" on:click={() => (newAndEditFormModal = false)}
							>Cancel</Button
						>
						<Button
							type="submit"
							class="my-4 rounded-xl bg-light_green text-[#675D50] hover:bg-orange hover:text-white m-2"
							color="red">Save</Button
						>
					{/if}
				</div>
			</form>
		</Modal>

		<Modal bind:open={deleteFormModal} outsideclose={true} size="md" class="w-full">
			<form method="POST" action="?/deleteUser" use:enhance>
				<div class="text-center">
					<svg
						aria-hidden="true"
						class="mx-auto mb-4 w-14 h-14 text-gray-400 dark:text-gray-200"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/></svg
					>

					{#if listOfSelectedUser.length > 1}
						<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
							Are you sure you want to delete <strong>THESE</strong> accounts?
						</h3>
					{:else}
						<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
							Are you sure you want to delete this account?
						</h3>
					{/if}

					<Input type="text" name="user_id" class="hidden" value={currentEditingAccount.user_id} />
					<Button type="button" color="alternative" on:click={() => (deleteFormModal = false)}
						>No, cancel</Button
					>
					<Button type="submit" color="red" class="mr-2">Yes, I'm sure</Button>
				</div>
			</form>
		</Modal>
	</Table>
</div>
