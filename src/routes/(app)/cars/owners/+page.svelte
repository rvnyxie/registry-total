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

	export let form;
	export let data;

	let owners = data.owners;

	// auto update owner in table whenever data.owners (returned from server load function) changes
	// The data.owners will change when we create, edit or delete
	$: owners = data.owners;

	// Create a variable with type of owner but all properties are optional
	let currentEditingOwner: Partial<(typeof owners)[number]> = {};

	// Variables responsible for modal showing
	let creatingOwner = false;
	let editingOwner = false;
	let deletingOwner = false;

	// Variables responsible for checkboxes functions to work
	let selectedOwners: string[] = [];
	let isTableHeadChecked = false;
	let isAllTableRowChecked = false;
	$: totalOwners = owners.length;

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
		} else if (form?.action === 'failed') {
		}
	}

	// Update owners based on results matched the search query
	$: {
		if (form?.status === 'success' && form?.action === 'searchOwners') {
			const matchedOwnerIds = form?.matchedOwnerIds;

			owners = owners.filter((owner) => {
				return matchedOwnerIds?.includes(owner.id);
			});

			if (form) {
				form.status = '';
				form.action = '';
			}
		}
	}
</script>

<div class="w-1/2 bg-primary_color">
	<form method="POST" action="?/searchOwners" class="bg-secondary_color" use:enhance>
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

	{#if form?.status === 'success' || form?.status === 'failed' || successfulCancel}
		<div class="text-sm absolute right-14 top-16">
			<div class="flex flex-col gap-4">
				{#if form?.status === 'success'}
					{#if form?.action === 'createOwner'}
						<div>
							<p class="text-sm p-2 bg-light_green text-brown font-bold rounded-lg">
								Created Successful!
							</p>
						</div>
					{:else if form?.action === 'deleteOwner'}
						<div>
							<p class="text-sm p-2 bg-light_green text-brown font-bold rounded-lg">
								Deleted Successful!
							</p>
						</div>
					{:else if form?.action === 'deleteManyOwners'}
						<div>
							<p class="text-sm p-2 bg-light_green text-brown font-bold rounded-lg">
								Deleted Successful!
							</p>
						</div>
					{:else if form?.action === 'editOwner'}
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
				creatingOwner = true;
				currentEditingOwner = {};
			}}
		>
			New
		</Button>
		{#if selectedOwners.length > 1}
			<Button
				class="mb-2"
				size="xs"
				on:click={() => {
					deletingOwner = true;
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
						// if checked = true, all the owners need to be checked
						isTableHeadChecked = !isTableHeadChecked;

						// when TableHead is checked, add all owners id to selectedOwners list
						// reset selectedOwners when uncheck
						if (isTableHeadChecked) {
							selectedOwners = owners.map((owner) => owner.id);
						} else {
							selectedOwners = [];
						}
					}}
				/>
			</TableHeadCell>
			<TableHeadCell>Owner ID</TableHeadCell>
			<TableHeadCell>Fullname</TableHeadCell>
			<TableHeadCell>Address</TableHeadCell>
			<TableHeadCell>Phone Number</TableHeadCell>
			<TableHeadCell>Email</TableHeadCell>
			<TableHeadCell>Owner Type</TableHeadCell>
			<TableHeadCell>Company Type</TableHeadCell>
			<TableHeadCell>Company Name</TableHeadCell>
			<TableHeadCell>Type Of Business</TableHeadCell>
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
							checked={isTableHeadChecked}
							on:click={() => {
								// if owner.id is in selectedOwners, remove it
								// else add it
								// note: reactivity in svelte is triggered by assignment
								if (selectedOwners.includes(owner.id)) {
									selectedOwners = selectedOwners.filter((id) => owner.id !== id);
								} else {
									selectedOwners = [...selectedOwners, owner.id];
								}

								// if all owners are checked, then checkbox in TableHead is checked
								if (selectedOwners.length === totalOwners) {
									isAllTableRowChecked = true;
								} else {
									isAllTableRowChecked = false;
								}
							}}
						/>
					</TableBodyCell>
					<TableBodyCell>{owner?.id}</TableBodyCell>
					<TableBodyCell>{owner?.fullname}</TableBodyCell>
					<TableBodyCell>{owner?.address}</TableBodyCell>
					<TableBodyCell>{owner?.phoneNumber}</TableBodyCell>
					<TableBodyCell>{owner?.email ? owner.email : ''}</TableBodyCell>
					<TableBodyCell>{owner?.ownerType}</TableBodyCell>
					<TableBodyCell>{owner?.companyType ? owner.companyType : ''}</TableBodyCell>
					<TableBodyCell>{owner?.companyName ? owner.companyName : ''}</TableBodyCell>
					<TableBodyCell>{owner?.typeOfBusiness ? owner.typeOfBusiness : ''}</TableBodyCell>
					<TableBodyCell>
						<Button
							size="xs"
							color="dark"
							on:click={() => {
								editingOwner = true;
								currentEditingOwner = owner;
							}}
						>
							Edit
						</Button>
						<Button
							size="xs"
							color="red"
							on:click={() => {
								deletingOwner = true;
								currentEditingOwner = owner;
							}}
						>
							Delete
						</Button>
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>

		<!-- New Modal -->
		<Modal bind:open={creatingOwner} outsideclose={true} size="md" class="w-full">
			<form
				method="POST"
				action="?/createOwner"
				use:enhance={() => {
					return async ({ result }) => {
						if (result.status === 200) {
							invalidateAll();
							creatingOwner = false;
						}

						await applyAction(result);
					};
				}}
			>
				<Label class="space-y-2">
					<span>Owner ID</span>
					<Input type="text" name="id" placeholder="Citizen ID Number..." />
				</Label>
				<Label class="space-y-2">
					<span>Fullname</span>
					<Input type="text" name="fullname" placeholder="Nguyen Van A" />
				</Label>
				<Label class="space-y-2">
					<span>Address</span>
					<Input type="text" name="address" placeholder="123 Street, ABC ward, XYZ district..." />
				</Label>
				<Label class="space-y-2">
					<span>Phone Number</span>
					<Input type="text" name="phoneNumber" placeholder="10 digit phone number..." />
				</Label>
				<Label class="space-y-2">
					<span>Email</span>
					<Input type="email" name="email" placeholder="owner@mail.com" />
				</Label>
				<Label class="space-y-2">
					<span>Owner Type</span>
					<Input type="text" name="ownerType" placeholder="personal/company" />
				</Label>
				<Label class="space-y-2">
					<span>Company Type</span>
					<Input
						type="text"
						name="companyType"
						placeholder="corporation/llc/partnership/... (REQUIRED if owner type is not personal)"
					/>
				</Label>
				<Label class="space-y-2">
					<span>Company Name</span>
					<Input
						type="text"
						name="companyName"
						placeholder="BigIno Inc... (REQUIRED if owner type is not personal)"
					/>
				</Label>
				<Label class="space-y-2">
					<span>Type Of Business</span>
					<Input
						type="text"
						name="typeOfBusiness"
						placeholder="manufacturer/retail/... (REQUIRED if owner type is not personal)"
					/>
				</Label>

				<div class="flex flex-row items-center justify-center">
					<Button
						type="button"
						color="red"
						on:click={() => {
							creatingOwner = false;
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
		<Modal bind:open={editingOwner} outsideclose={true} size="md" class="w-full">
			<form
				method="POST"
				action="?/editOwner"
				use:enhance={() => {
					return async ({ result }) => {
						if (result.status === 200) {
							invalidateAll();
							editingOwner = false;
						}

						await applyAction(result);
					};
				}}
			>
				<Label class="space-y-2">
					<span>Owner ID</span>
					<Input
						type="text"
						name="id"
						placeholder="Citizen ID Number..."
						value={currentEditingOwner?.id}
						required
					/>
				</Label>

				<Label class="space-y-2">
					<span>Fullname</span>
					<Input
						type="text"
						name="fullname"
						placeholder="Nguyen Van A"
						value={currentEditingOwner?.fullname}
						required
					/>
				</Label>
				<Label class="space-y-2">
					<span>Address</span>
					<Input
						type="text"
						name="address"
						placeholder="123 Street, ABC ward, XYZ district..."
						value={currentEditingOwner?.address}
						required
					/>
				</Label>
				<Label class="space-y-2">
					<span>Phone Number</span>
					<Input
						type="text"
						name="phoneNumber"
						placeholder="10 digit phone number..."
						value={currentEditingOwner?.phoneNumber}
						required
					/>
				</Label>
				<Label class="space-y-2">
					<span>Email</span>
					<Input
						type="email"
						name="email"
						placeholder="owner@mail.com"
						value={currentEditingOwner?.email}
					/>
				</Label>

				<Label class="space-y-2">
					<span>Owner Type</span>
					<Input
						type="text"
						name="ownerType"
						placeholder="personal/company"
						value={currentEditingOwner?.ownerType}
						required
					/>
				</Label>
				<Label class="space-y-2">
					<span>Company Type</span>
					<Input
						type="text"
						name="companyType"
						placeholder="corporation/llc/partnership/... (REQUIRED if owner type is not personal)"
						value={currentEditingOwner?.companyType}
					/>
				</Label>
				<Label class="space-y-2">
					<span>Company Name</span>
					<Input
						type="text"
						name="companyName"
						placeholder="BigIno Inc... (REQUIRED if owner type is not personal)"
						value={currentEditingOwner?.companyName}
					/>
				</Label>
				<Label class="space-y-2">
					<span>Type Of Business</span>
					<Input
						type="text"
						name="typeOfBusiness"
						placeholder="manufacturer/retail/... (REQUIRED if owner type is not personal)"
						value={currentEditingOwner?.typeOfBusiness}
					/>
				</Label>

				<div class="flex flex-row items-center justify-center">
					<Button
						type="button"
						color="alternative"
						on:click={() => {
							editingOwner = false;
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
		<Modal bind:open={deletingOwner} outsideclose={true} size="md" class="w-full">
			<form
				method="POST"
				action="?/deleteOwner"
				use:enhance={() => {
					return async ({ result }) => {
						if (result.status === 200) {
							invalidateAll();
							deletingOwner = false;
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

					{#if selectedOwners.length > 1}
						<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
							Are you sure you want to delete <strong>THESE</strong> selected owners?
						</h3>
						<Input type="text" name="ids" class="hidden" value={selectedOwners} />
						<Button
							type="button"
							color="alternative"
							on:click={() => {
								deletingOwner = false;
								successfulCancel = true;

								// Turn off state to close notification
								setTimeout(() => {
									successfulCancel = false;
								}, 2000);
							}}>No, cancel</Button
						>
						<Button type="submit" color="red" class="mr-2" formaction="?/deleteManyOwners"
							>Yes, I'm sure</Button
						>
					{:else}
						<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
							Are you sure you want to delete this owner?
						</h3>
						<Input type="text" name="id" class="hidden" value={currentEditingOwner.id} />
						<Button
							type="button"
							color="alternative"
							on:click={() => {
								deletingOwner = false;
								successfulCancel = true;

								// Turn off state to close notification
								setTimeout(() => {
									successfulCancel = false;
								}, 2000);
							}}>No, cancel</Button
						>
						<Button type="submit" color="red" class="mr-2" formaction="?/deleteOwner"
							>Yes, I'm sure</Button
						>
					{/if}
				</div>
			</form>
		</Modal>
	</Table>
</div>
