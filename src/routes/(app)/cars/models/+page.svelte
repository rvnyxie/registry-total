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

	let carModels = data.carModels;

	// auto update carModel in table whenever data.carModels (returned from server load function) changes
	// The data.carModels will change when we create, edit or delete
	$: carModels = data.carModels;

	// Create a variable with type of carModel but all properties are optional
	let currentEditingCarModel: Partial<(typeof carModels)[number]> = {};

	// Variables responsible for modal showing
	let creatingCarModel = false;
	let editingCarModel = false;
	let deletingCarModel = false;

	// Variables responsible for checkboxes functions to work
	let selectedCarModels: number[] = [];
	let isTableHeadChecked = false;
	let isAllTableRowChecked = false;
	$: totalCarModels = carModels.length;

	// Variable responsible for notifications states
	let successfulCancel = false;

	// Update state for notifications when operate on table
	$: {
		if (form?.status === 'success' || form?.status === 'failed') {
			setTimeout(() => {
				if (form) {
					form.status = '';
					form.action = '';
				}
			}, 3000);
		}
	}

	// Update carModels based on results matched the search query
	$: {
		if (form?.status === 'success' && form?.action === 'searchCarModels') {
			const matchedCarModelIds = form?.matchedCarModelIds;

			carModels = carModels.filter((carModel) => {
				return matchedCarModelIds?.includes(carModel.id);
			});

			if (form) {
				form.status = '';
				form.action = '';
			}
		}
	}
</script>

<div class="w-1/2 bg-primary_color">
	<form method="POST" action="?/searchCarModels" class="bg-secondary_color" use:enhance>
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
					{#if form?.action === 'createCarModel'}
						<div>
							<p class="text-sm p-2 bg-light_green text-brown font-bold rounded-lg">
								Created Successful!
							</p>
						</div>
					{:else if form?.action === 'deleteCarModel'}
						<div>
							<p class="text-sm p-2 bg-light_green text-brown font-bold rounded-lg">
								Deleted Successful!
							</p>
						</div>
					{:else if form?.action === 'deleteManyCarModels	'}
						<div>
							<p class="text-sm p-2 bg-light_green text-brown font-bold rounded-lg">
								Deleted Successful!
							</p>
						</div>
					{:else if form?.action === 'editCarModel'}
						<div>
							<p class="text-sm p-2 bg-light_green text-brown font-bold rounded-lg">
								Editted Successful!
							</p>
						</div>
					{/if}
				{:else if form?.status === 'failed'}
					{#if form?.action === 'deleteCarModel'}
						<div>
							<p
								class="text-sm p-2 px-6 text-center bg-error_red text-light_yellow font-bold rounded-lg"
							>
								{form?.message}
							</p>
						</div>
					{:else if form?.action === 'deleteManyCarModels'}
						<div>
							<p
								class="text-sm p-2 px-6 text-center bg-error_red text-light_yellow font-bold rounded-lg"
							>
								{form?.message}
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
				creatingCarModel = true;
				currentEditingCarModel = {};
			}}
		>
			New
		</Button>
		{#if selectedCarModels.length > 1}
			<Button
				class="mb-2"
				size="xs"
				on:click={() => {
					deletingCarModel = true;
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
						// if checked = true, all the carModels need to be checked
						isTableHeadChecked = !isTableHeadChecked;

						// when TableHead is checked, add all carModels id to selectedCarModels list
						// reset selectedCarModels when uncheck
						if (isTableHeadChecked) {
							selectedCarModels = carModels.map((carModel) => carModel.id);
						} else {
							selectedCarModels = [];
						}
					}}
				/>
			</TableHeadCell>
			<TableHeadCell>Car Model ID</TableHeadCell>
			<TableHeadCell>Model Name</TableHeadCell>
			<TableHeadCell>Manufacturer</TableHeadCell>
			<TableHeadCell>Version</TableHeadCell>
			<TableHeadCell>Engine</TableHeadCell>
			<TableHeadCell>Fuel Type</TableHeadCell>
			<TableHeadCell>Transmission Type</TableHeadCell>
			<TableHeadCell>Horsepower</TableHeadCell>
			<TableHeadCell>Torque</TableHeadCell>
			<TableHeadCell>Seating Capacity</TableHeadCell>
			<TableHeadCell>
				<span class="sr-only"> Edit </span>
			</TableHeadCell>
			<TableHeadCell>
				<span class="sr-only"> Delete </span>
			</TableHeadCell>
		</TableHead>
		<TableBody>
			{#each carModels as carModel}
				<TableBodyRow>
					<TableBodyCell class="!p-4">
						<Checkbox
							checked={isTableHeadChecked}
							on:click={() => {
								// if carModel.id is in selectedCarModels, remove it
								// else add it
								// note: reactivity in svelte is triggered by assignment
								if (selectedCarModels.includes(carModel.id)) {
									selectedCarModels = selectedCarModels.filter((id) => carModel.id !== id);
								} else {
									selectedCarModels = [...selectedCarModels, carModel.id];
								}

								// if all carModels are checked, then checkbox in TableHead is checked
								if (selectedCarModels.length === totalCarModels) {
									isAllTableRowChecked = true;
								} else {
									isAllTableRowChecked = false;
								}
							}}
						/>
					</TableBodyCell>
					<TableBodyCell>{carModel?.id}</TableBodyCell>
					<TableBodyCell>{carModel?.modelName}</TableBodyCell>
					<TableBodyCell>{carModel?.manufacturer}</TableBodyCell>
					<TableBodyCell>{carModel?.version}</TableBodyCell>
					<TableBodyCell>{carModel?.engineType}</TableBodyCell>
					<TableBodyCell>{carModel?.fuelType}</TableBodyCell>
					<TableBodyCell>{carModel?.transmissionType}</TableBodyCell>
					<TableBodyCell>{carModel?.horsepower}</TableBodyCell>
					<TableBodyCell>{carModel?.torque}</TableBodyCell>
					<TableBodyCell>{carModel?.seatingCapacity}</TableBodyCell>
					<TableBodyCell>
						<Button
							size="xs"
							color="dark"
							on:click={() => {
								editingCarModel = true;
								currentEditingCarModel = carModel;
							}}
						>
							Edit
						</Button>
						<Button
							size="xs"
							color="red"
							on:click={() => {
								deletingCarModel = true;
								currentEditingCarModel = carModel;
							}}
						>
							Delete
						</Button>
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>

		<!-- New Modal -->
		<Modal bind:open={creatingCarModel} outsideclose={true} size="md" class="w-full">
			<form
				method="POST"
				action="?/createCarModel"
				use:enhance={() => {
					return async ({ result }) => {
						if (result.status === 200) {
							invalidateAll();
							creatingCarModel = false;
						}

						await applyAction(result);
					};
				}}
			>
				<Label class="space-y-2">
					<span>Model Name</span>
					<Input type="text" name="modelName" placeholder="Vinfast VF8..." />
				</Label>
				<Label class="space-y-2">
					<span>Manufacturer</span>
					<Input type="text" name="manufacturer" placeholder="Vinfast..." />
				</Label>
				<Label class="space-y-2">
					<span>Version</span>
					<Input type="text" name="version" placeholder="VF8..." />
				</Label>
				<Label class="space-y-2">
					<span>Engine Type</span>
					<Input type="text" name="engineType" placeholder="V8..." />
				</Label>
				<Label class="space-y-2">
					<span>Fuel Type</span>
					<Input type="text" name="fuelType" placeholder="Gasoline..." />
				</Label>
				<Label class="space-y-2">
					<span>Transmission Type</span>
					<Input type="text" name="transmissionType" placeholder="Automatic..." />
				</Label>
				<Label class="space-y-2">
					<span>Horsepower</span>
					<Input type="text" name="horsepower" placeholder="420..." />
				</Label>
				<Label class="space-y-2">
					<span>Torque</span>
					<Input type="text" name="torque" placeholder="650..." />
				</Label>
				<Label class="space-y-2">
					<span>Seating Capacity</span>
					<Input type="text" name="seatingCapacity" placeholder="5..." />
				</Label>

				<div class="flex flex-row items-center justify-center">
					<Button
						type="button"
						color="red"
						on:click={() => {
							creatingCarModel = false;
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
		<Modal bind:open={editingCarModel} outsideclose={true} size="md" class="w-full">
			<form
				method="POST"
				action="?/editCarModel"
				use:enhance={() => {
					return async ({ result }) => {
						if (result.status === 200) {
							invalidateAll();
							editingCarModel = false;
						}

						await applyAction(result);
					};
				}}
			>
				<Label class="space-y-2">
					<span>Car Model ID</span>
					<Input
						type="text"
						name="id"
						placeholder="Car Model ID Number..."
						value={currentEditingCarModel?.id}
						color="green"
						readonly
					/>
				</Label>

				<Label class="space-y-2">
					<span>Model Name</span>
					<Input
						type="text"
						name="modelName"
						placeholder="Vinfast VF8..."
						value={currentEditingCarModel?.modelName}
						required
					/>
				</Label>
				<Label class="space-y-2">
					<span>Manufacturer</span>
					<Input
						type="text"
						name="manufacturer"
						placeholder="Vinfast..."
						value={currentEditingCarModel?.manufacturer}
						required
					/>
				</Label>
				<Label class="space-y-2">
					<span>Version</span>
					<Input
						type="text"
						name="version"
						placeholder="VF8..."
						value={currentEditingCarModel?.version}
						required
					/>
				</Label>
				<Label class="space-y-2">
					<span>Engine Type</span>
					<Input
						type="text"
						name="engineType"
						placeholder="VF8..."
						value={currentEditingCarModel?.engineType}
					/>
				</Label>

				<Label class="space-y-2">
					<span>Fuel Type</span>
					<Input
						type="text"
						name="fuelType"
						placeholder="Gasoline..."
						value={currentEditingCarModel?.fuelType}
						required
					/>
				</Label>
				<Label class="space-y-2">
					<span>Transmission Type</span>
					<Input
						type="text"
						name="transmissionType"
						placeholder="Automatic..."
						value={currentEditingCarModel?.transmissionType}
					/>
				</Label>
				<Label class="space-y-2">
					<span>Horsepower</span>
					<Input
						type="text"
						name="horsepower"
						placeholder="420..."
						value={currentEditingCarModel?.horsepower}
					/>
				</Label>
				<Label class="space-y-2">
					<span>Torque</span>
					<Input
						type="text"
						name="torque"
						placeholder="650..."
						value={currentEditingCarModel?.torque}
					/>
				</Label>
				<Label class="space-y-2">
					<span>Seating Capacity</span>
					<Input
						type="text"
						name="seatingCapacity"
						placeholder="5..."
						value={currentEditingCarModel?.seatingCapacity}
					/>
				</Label>

				<div class="flex flex-row items-center justify-center">
					<Button
						type="button"
						color="alternative"
						on:click={() => {
							editingCarModel = false;
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
		<Modal bind:open={deletingCarModel} outsideclose={true} size="md" class="w-full">
			<form
				method="POST"
				action="?/deleteCarModel"
				use:enhance={() => {
					return async ({ result }) => {
						if (result.status === 200) {
							invalidateAll();
							deletingCarModel = false;
						} else {
							deletingCarModel = false;
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

					{#if selectedCarModels.length > 1}
						<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
							Are you sure you want to delete <strong>THESE</strong> selected car models?
						</h3>
						<Input type="text" name="ids" class="hidden" value={selectedCarModels} />
						<Button
							type="button"
							color="alternative"
							on:click={() => {
								deletingCarModel = false;
								successfulCancel = true;

								// Turn off state to close notification
								setTimeout(() => {
									successfulCancel = false;
								}, 2000);
							}}>No, cancel</Button
						>
						<Button type="submit" color="red" class="mr-2" formaction="?/deleteManyCarModels"
							>Yes, I'm sure</Button
						>
					{:else}
						<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
							Are you sure you want to delete this car model?
						</h3>
						<Input type="text" name="id" class="hidden" value={currentEditingCarModel.id} />
						<Button
							type="button"
							color="alternative"
							on:click={() => {
								deletingCarModel = false;
								successfulCancel = true;

								// Turn off state to close notification
								setTimeout(() => {
									successfulCancel = false;
								}, 2000);
							}}>No, cancel</Button
						>
						<Button type="submit" color="red" class="mr-2" formaction="?/deleteCarModel"
							>Yes, I'm sure</Button
						>
					{/if}
				</div>
			</form>
		</Modal>
	</Table>
</div>
