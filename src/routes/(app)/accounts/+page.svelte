<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
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

	import { formatDate } from '$lib/helpers/format';
	import { afterUpdate } from 'svelte';

	export let form;
	export let data;

	let accounts = data.accounts;

	// auto update accounts in table whenever data.accounts (returned from server load function) changes
	// The data.accounts will change when we create, edit or delete
	$: accounts = data.accounts;

	// Create a variable with type of account but all properties are optional
	let currentEditingAccount: Partial<(typeof accounts)[number]> = {};

	// Variables responsible for modal showing
	let creatingAccount = false;
	let editingAccount = false;
	let deletingAccount = false;

	// Variables responsible for checkboxes functions to work
	let selectedAccounts: number[] = [];
	let isTableHeadChecked = false;
	let isAllTableRowChecked = false;
	$: totalAccounts = accounts.length;

	// Variable responsible for notifications states
	let successfulCancel = false;

	// Update state for notifications when operate on table
	$: {
		if (form?.status === 'success') {
			setTimeout(() => {
				if (form) {
					form.status = '';
					form.action = '';
				}
			}, 3000);
		}
	}

	// Update accounts based on results matched the search query
	$: {
		if (form?.status === 'success' && form?.action === 'searchUser') {
			const matchedUsersId = form?.matchedUsersId;

			accounts = accounts.filter((account) => {
				return matchedUsersId?.includes(account.id);
			});

			if (form) {
				form.status = '';
				form.action = '';
			}
		}
	}
</script>

<div class="w-1/2 bg-primary_color">
	<form method="POST" action="?/search" class="bg-secondary_color" use:enhance>
		<Label for="search" class="" />
		<Input
			name="searchQuery"
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

	{#if form?.status === 'success' || successfulCancel}
		<div class="text-sm absolute right-14 top-16">
			<div class="flex flex-col gap-4">
				{#if form?.status === 'success'}
					{#if form?.action === 'createUser'}
						<div>
							<p class="text-sm p-2 bg-light_green text-brown font-bold rounded-lg">
								Created Successful!
							</p>
						</div>
					{:else if form?.action === 'deleteUser'}
						<div>
							<p class="text-sm p-2 bg-light_green text-brown font-bold rounded-lg">
								Deleted Successful!
							</p>
						</div>
					{:else if form?.action === 'editUser'}
						<div>
							<p class="text-sm p-2 bg-light_green text-brown font-bold rounded-lg">
								Editted Successful!
							</p>
						</div>
					{/if}
				{/if}

				{#if successfulCancel}
					<div>
						<p
							class="text-sm p-2 px-6 text-center bg-error_red text-light_yellow font-bold rounded-lg"
						>
							Canceled!
						</p>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>

<div class="grow w-4/5 rounded-xl p-4 bg-gray-50 overflow-scroll">
	<div class="flex justify-between flex-row-reverse">
		<Button
			class="mb-2"
			size="xs"
			on:click={() => {
				creatingAccount = true;
				currentEditingAccount = {};
			}}
		>
			New
		</Button>
		{#if selectedAccounts.length > 1}
			<Button
				class="mb-2"
				size="xs"
				on:click={() => {
					deletingAccount = true;
				}}
			>
				Delete Selected
			</Button>
		{/if}
	</div>
	<Table hoverable={true} striped={true} color="default">
		<TableHead class="bg-gray-200">
			<TableHeadCell class="!p-4">
				<Checkbox
					checked={isAllTableRowChecked}
					on:click={() => {
						// if checked = true, all the accounts need to be checked
						isTableHeadChecked = !isTableHeadChecked;

						// when TableHead is checked, add all accounts id to selectedAccounts list
						// reset selectedAccounts when uncheck
						if (isTableHeadChecked) {
							selectedAccounts = accounts.map((account) => account.id);
						} else {
							selectedAccounts = [];
						}
					}}
				/>
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
							checked={isTableHeadChecked}
							on:click={() => {
								// if account.id is in selectedAccounts, remove it
								// else add it
								// note: reactivity in svelte is triggered by assignment
								if (selectedAccounts.includes(account.id)) {
									selectedAccounts = selectedAccounts.filter((id) => account.id !== id);
								} else {
									selectedAccounts = [...selectedAccounts, account.id];
								}

								// if all accounts are checked, then checkbox in TableHead is checked
								if (selectedAccounts.length === totalAccounts) {
									isAllTableRowChecked = true;
								} else {
									isAllTableRowChecked = false;
								}
							}}
						/>
					</TableBodyCell>
					<TableBodyCell>{account?.id}</TableBodyCell>
					<TableBodyCell>{account?.username}</TableBodyCell>
					<TableBodyCell>{account?.password}</TableBodyCell>
					<TableBodyCell>{account?.isAdmin}</TableBodyCell>
					<TableBodyCell>{account?.email}</TableBodyCell>
					<TableBodyCell>{account?.createdAt ? formatDate(account.createdAt) : ''}</TableBodyCell>
					<TableBodyCell>{account?.updatedAt ? formatDate(account.updatedAt) : ''}</TableBodyCell>
					<TableBodyCell
						>{account?.inspectionStationId
							? account.inspectionStationId
							: account?.isAdmin
							? 'All'
							: 'None'}</TableBodyCell
					>
					<TableBodyCell>
						<Button
							size="xs"
							color="dark"
							on:click={() => {
								editingAccount = true;
								currentEditingAccount = account;
							}}
						>
							Edit
						</Button>
						<Button
							size="xs"
							color="red"
							on:click={() => {
								deletingAccount = true;
								currentEditingAccount = account;
							}}
						>
							Delete
						</Button>
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>

		<!-- New Modal -->
		<Modal bind:open={creatingAccount} outsideclose={true} size="md" class="w-full">
			<form
				method="POST"
				action="?/addAccount"
				use:enhance={() => {
					return async ({ result }) => {
						if (result.status === 200) {
							invalidateAll();
							creatingAccount = false;
						}
						await applyAction(result);
					};
				}}
			>
				<Label class="space-y-2">
					<span>Username</span>
					<Input type="text" name="username" placeholder="username" required />
				</Label>
				<Label class="space-y-2">
					<span>Password</span>
					<Input type="password" name="password" placeholder="•••••" required />
				</Label>
				<Label class="space-y-2">
					<span>Is admin</span>
					<Input type="text" name="isAdmin" placeholder="yes/no" required />
				</Label>
				<Label class="space-y-2">
					<span>Email</span>
					<Input type="email" name="email" placeholder="name@company.com" required />
				</Label>

				<Label class="space-y-2">
					<span>Inspection Station ID</span>
					<Input type="text" name="inspectionStationId" placeholder="Input station ID here..." />
				</Label>

				<div class="flex flex-row items-center justify-center">
					<Button
						type="button"
						color="red"
						on:click={() => {
							creatingAccount = false;
							successfulCancel = true;

							// Turn off state to close notification
							setTimeout(() => {
								successfulCancel = false;
							}, 2000);
						}}>Cancel</Button
					>
					<Button
						type="submit"
						class="my-4 rounded-xl bg-light_green text-[#675D50] hover:bg-orange hover:text-white m-2"
						color="none">Add</Button
					>
				</div>

				{#if form?.status === 'failed' && form?.invalidData}
					<p class="text-base text-error_red font-semibold text-center">{form?.message}</p>
				{/if}

				{#if form?.status === 'success'}
					<p class="text-base text-[#00b300] font-semibold text-center">{form?.message}</p>
				{/if}
			</form>
		</Modal>

		<!-- Edit Modal -->
		<Modal bind:open={editingAccount} outsideclose={true} size="md" class="w-full">
			<form
				method="POST"
				action="?/editAccount"
				use:enhance={() => {
					return async ({ result }) => {
						if (result.status === 200) {
							invalidateAll();
							editingAccount = false;
						}
						await applyAction(result);
					};
				}}
			>
				<Label class="space-y-2">
					<span>User ID</span>
					<Input
						type="text"
						name="id"
						placeholder="User ID..."
						value={currentEditingAccount?.id}
						readonly
						color="green"
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
						name="isAdmin"
						placeholder="yes/no"
						value={currentEditingAccount?.isAdmin}
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
						type="text"
						name="createdAt"
						placeholder="Sat, June 20, 2020 at 20:20 AM"
						value={currentEditingAccount?.createdAt
							? formatDate(currentEditingAccount?.createdAt)
							: ''}
						readonly
						color="green"
					/>
				</Label>
				<Label class="space-y-2">
					<span>Last Update</span>
					<Input
						type="text"
						name="updatedAt"
						placeholder="Sat, June 21, 2021 at 21:21 AM"
						value={currentEditingAccount?.updatedAt
							? formatDate(currentEditingAccount?.updatedAt)
							: ''}
						readonly
						color="green"
					/>
				</Label>
				<Label class="space-y-2">
					<span>Inspection Station ID</span>
					<Input
						type="text"
						name="inspectionStationId"
						placeholder="Input station ID here..."
						value={currentEditingAccount?.inspectionStationId}
					/>
				</Label>

				<div class="flex flex-row items-center justify-center">
					<Button
						type="button"
						color="alternative"
						on:click={() => {
							editingAccount = false;
							successfulCancel = true;

							// Turn off state to close notification
							setTimeout(() => {
								successfulCancel = false;
							}, 2000);
						}}>Cancel</Button
					>
					<Button
						type="submit"
						class="my-4 rounded-xl bg-light_green text-[#675D50] hover:bg-orange hover:text-white m-2"
						color="red">Save</Button
					>
				</div>
			</form>
		</Modal>

		<!-- Delete Modal -->
		<Modal bind:open={deletingAccount} outsideclose={true} size="md" class="w-full">
			<form
				method="POST"
				action="?/deleteAccount"
				use:enhance={() => {
					return async ({ result }) => {
						if (result.status === 200) {
							invalidateAll();
							deletingAccount = false;
						}
						await applyAction(result);
					};
				}}
			>
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

					{#if selectedAccounts.length > 1}
						<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
							Are you sure you want to delete <strong>THESE</strong> selected accounts?
						</h3>
						<Input type="text" name="ids" class="hidden" value={selectedAccounts} />
						<Button
							type="button"
							color="alternative"
							on:click={() => {
								deletingAccount = false;
								successfulCancel = true;

								// Turn off state to close notification
								setTimeout(() => {
									successfulCancel = false;
								}, 2000);
							}}>No, cancel</Button
						>
						<Button type="submit" color="red" class="mr-2" formaction="?/deleteManyAccounts"
							>Yes, I'm sure</Button
						>
					{:else}
						<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
							Are you sure you want to delete this account?
						</h3>
						<Input type="text" name="id" class="hidden" value={currentEditingAccount.id} />
						<Button
							type="button"
							color="alternative"
							on:click={() => {
								deletingAccount = false;
								successfulCancel = true;

								// Turn off state to close notification
								setTimeout(() => {
									successfulCancel = false;
								}, 2000);
							}}>No, cancel</Button
						>
						<Button type="submit" color="red" class="mr-2" formaction="?/deleteAccount"
							>Yes, I'm sure</Button
						>
					{/if}
				</div>
			</form>
		</Modal>
	</Table>
</div>
