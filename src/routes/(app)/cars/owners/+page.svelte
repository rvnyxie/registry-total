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

	type ownerType = {
		owner_id: string;
		full_name: string;
		address?: string;
		phone_number?: string;
		email?: string;
		owner_type?: string;
		company_name?: string;
		type_of_business?: string;
		company_type?: string;
	};

	const default_owners: ownerType[] = [
		{
			owner_id: '123456789',
			full_name: 'Nyx Isl',
			address: '123 example strees',
			phone_number: '012345678',
			email: 'dp@mail.com',
			owner_type: 'personal',
			company_name: '',
			type_of_business: '',
			company_type: ''
		},
		{
			owner_id: '987654321',
			full_name: 'Nam Nt',
			address: '456 example strees',
			phone_number: '087654321',
			email: 'nt@mail.com',
			owner_type: 'commercial',
			company_name: 'fake compayny name',
			type_of_business: 'transporting',
			company_type: 'partnership'
		}
	];

	let owners: ownerType[];

	let localOwners = localStorage.getItem('owner') as string;

	if (localOwners !== null) {
		owners = JSON.parse(localOwners);
	} else {
		owners = default_owners;
	}

	console.log(owners);

	onMount(() => {
		// normal user not allowed to access this page
		const isAdmin = localStorage.getItem('role');
		if (!isAdmin) {
			goto('/');
		}

		// asign data to table
	});

	afterUpdate(() => {
		// TODO: handle form submit
	});

	let newAndEditFormModal = false;
	let deleteFormModal = false;

	let currentEditingOwner: {
		owner_id?: string;
		full_name?: string;
		address?: string;
		phone_number?: string;
		email?: string;
		owner_type?: string;
		company_name?: string;
		type_of_business?: string;
		company_type?: string;
	};

	let listOfSelectedOwner: string[] = [];
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
		{#if listOfSelectedOwner.length === owners.length}
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
				currentEditingOwner = {};
			}}
		>
			New
		</Button>
	</div>

	<!-- Table here -->
	<Table hoverable={true} striped={true} color="default">
		<TableHead class="bg-gray-200">
			<TableHeadCell class="!p-4">
				<Checkbox />
			</TableHeadCell>
			<TableHeadCell>Owner ID</TableHeadCell>
			<TableHeadCell>Owner Type</TableHeadCell>
			<TableHeadCell>Phone Number</TableHeadCell>
			<TableHeadCell>Address</TableHeadCell>
			<TableHeadCell>Full Name</TableHeadCell>
			<TableHeadCell>Company Name</TableHeadCell>
			<TableHeadCell>Company Type</TableHeadCell>
			<TableHeadCell>Type Of Business</TableHeadCell>
			<TableHeadCell>Actions</TableHeadCell>
			<TableHeadCell>
				<span class="sr-only"> Edit </span>
			</TableHeadCell>
			<TableHeadCell>
				<span class="sr-only"> Delete </span>
			</TableHeadCell>
		</TableHead>
		<TableBody>
			{#each owners as owner}
				<TableBodyRow>
					<TableBodyCell class="!p-4">
						<Checkbox
							on:click={() => {
								const index = listOfSelectedOwner.findIndex(
									(owner_id) => (owner.owner_id = owner_id)
								);

								if (index === -1) {
									listOfSelectedOwner = [...listOfSelectedOwner, owner.owner_id];
								} else {
									listOfSelectedOwner.splice(index, 1);
								}
							}}
						/>
					</TableBodyCell>
					<TableBodyCell>{owner?.owner_id}</TableBodyCell>
					<TableBodyCell>{owner?.owner_type}</TableBodyCell>
					<TableBodyCell>{owner?.phone_number}</TableBodyCell>
					<TableBodyCell>{owner?.address}</TableBodyCell>
					<TableBodyCell>{owner?.full_name}</TableBodyCell>
					<TableBodyCell>{owner?.company_name}</TableBodyCell>
					<TableBodyCell>{owner?.company_type}</TableBodyCell>
					<TableBodyCell>{owner?.type_of_business}</TableBodyCell>
					<TableBodyCell>
						<Button
							size="xs"
							color="dark"
							on:click={() => {
								newAndEditFormModal = true;
								currentEditingOwner = owner;
							}}
						>
							Edit
						</Button>
						<Button
							size="xs"
							color="red"
							on:click={() => {
								deleteFormModal = true;
								currentEditingOwner = owner;
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
					<span>Owner ID</span>
					<Input
						type="text"
						name="owner_id"
						placeholder="a number"
						value={currentEditingOwner?.owner_id}
					/>
				</Label>
				<Label class="space-y-2">
					<span>Owner Type</span>
					<Input
						type="text"
						name="owner_type"
						placeholder="personal or commercial"
						value={currentEditingOwner?.owner_type}
					/>
				</Label>
				<Label class="space-y-2">
					<span>Phone Number</span>
					<Input
						type="password"
						name="phone_number"
						placeholder="•••••"
						value={currentEditingOwner?.phone_number}
						required
					/>
				</Label>
				<Label class="space-y-2">
					<span>Address</span>
					<Input
						type="text"
						name="address"
						placeholder="123 street..."
						value={currentEditingOwner?.address}
						required
					/>
				</Label>
				<Label class="space-y-2">
					<span>Full Name</span>
					<Input
						type="text"
						name="full_name"
						placeholder="Jhon Wick"
						value={currentEditingOwner?.full_name}
					/>
				</Label>
				<Label class="space-y-2">
					<span>Company Name</span>
					<Input
						type="text"
						name="company_name"
						placeholder="company name"
						value={currentEditingOwner?.company_name}
					/>
				</Label>
				<Label class="space-y-2">
					<span>Company Type</span>
					<Input
						type="text"
						name="company_type"
						placeholder="2023-06-15"
						value={currentEditingOwner?.company_type}
					/>
				</Label>
				<Label class="space-y-2">
					<span>Type Of Business</span>
					<Input
						type="text"
						name="type_of_business"
						placeholder="Coorporartion..."
						value={currentEditingOwner?.type_of_business}
					/>
				</Label>

				<div class="flex flex-row items-center justify-center">
					<!-- currentEditingOwner is modified based on which button user click -->
					{#if currentEditingOwner?.owner_id === undefined}
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
							color="red">Edit</Button
						>
					{/if}
				</div>
			</form>
		</Modal>

		<Modal bind:open={deleteFormModal} outsideclose={true} size="md" class="w-full">
			<form method="POST" action="?/deleteOwner" use:enhance>
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

					{#if listOfSelectedOwner.length > 1}
						<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
							Are you sure you want to delete <strong>THESE</strong> people?
						</h3>
					{:else}
						<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
							Are you sure you want to delete this person?
						</h3>
					{/if}

					<Input type="text" name="user_id" class="hidden" value={currentEditingOwner.owner_id} />
					<Button type="button" color="alternative" on:click={() => (deleteFormModal = false)}
						>No, cancel</Button
					>
					<Button type="submit" color="red" class="mr-2">Yes, I'm sure</Button>
				</div>
			</form>
		</Modal>
	</Table>
</div>
