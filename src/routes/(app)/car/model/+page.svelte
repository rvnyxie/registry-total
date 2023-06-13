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

	type modelType = {
		car_model_id: string;
		car_model_name: string;
		manufacturer: string;
		version: string;
		engine_type: string;
		fuel_type: string;
		transmission_type: string;
		horsepower: string;
		torque: string;
		seating_capacity: number;
	};

	const default_models: modelType[] = [
		{
			car_model_id: '1',
			car_model_name: 'Model 1',
			manufacturer: 'Toyota',
			version: '1.0',
			engine_type: 'V6',
			fuel_type: 'Gasoline',
			transmission_type: 'Automatic',
			horsepower: '300',
			torque: '280',
			seating_capacity: 5
		},
		{
			car_model_id: '2',
			car_model_name: 'Model 2',
			manufacturer: 'Honda',
			version: '2.0',
			engine_type: 'Inline-4',
			fuel_type: 'Diesel',
			transmission_type: 'Manual',
			horsepower: '180',
			torque: '220',
			seating_capacity: 4
		},
		{
			car_model_id: '3',
			car_model_name: 'Model 3',
			manufacturer: 'Ford',
			version: '3.0',
			engine_type: 'V8',
			fuel_type: 'Gasoline',
			transmission_type: 'Automatic',
			horsepower: '450',
			torque: '400',
			seating_capacity: 7
		},
		{
			car_model_id: '4',
			car_model_name: 'Model 4',
			manufacturer: 'BMW',
			version: '4.0',
			engine_type: 'Inline-6',
			fuel_type: 'Gasoline',
			transmission_type: 'Automatic',
			horsepower: '320',
			torque: '300',
			seating_capacity: 5
		},
		{
			car_model_id: '5',
			car_model_name: 'Model 5',
			manufacturer: 'Ferrari',
			version: '5.0',
			engine_type: 'V12',
			fuel_type: 'Gasoline',
			transmission_type: 'Automatic',
			horsepower: '650',
			torque: '600',
			seating_capacity: 2
		}
	];

	let models: modelType[];

	// TODO: cant access local storage without checking first
	// let localModels = localStorage.getItem('models') as string;

	// if (localModels !== null) {
	// 	models = JSON.parse(localModels);
	// } else {
	// 	models = default_models;
	// }

	models = default_models;

	console.log(models);

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

	let currentEditingModel: {
		car_model_id?: string;
		car_model_name?: string;
		manufacturer?: string;
		version?: string;
		engine_type?: string;
		fuel_type?: string;
		transmission_type?: string;
		horsepower?: string;
		torque?: string;
		seating_capacity?: number;
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
		{#if listOfSelectedOwner.length === models.length}
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
				currentEditingModel = {};
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
			<TableHeadCell>Car Model ID</TableHeadCell>
			<TableHeadCell>Car Model Name</TableHeadCell>
			<TableHeadCell>manufacturer</TableHeadCell>
			<TableHeadCell>version</TableHeadCell>
			<TableHeadCell>engine type</TableHeadCell>
			<TableHeadCell>fuel type</TableHeadCell>
			<TableHeadCell>transmission type</TableHeadCell>
			<TableHeadCell>horsepower</TableHeadCell>
			<TableHeadCell>torque</TableHeadCell>
			<TableHeadCell>seating capacity</TableHeadCell>
			<TableHeadCell>Actions</TableHeadCell>
			<TableHeadCell>
				<span class="sr-only"> Edit </span>
			</TableHeadCell>
			<TableHeadCell>
				<span class="sr-only"> Delete </span>
			</TableHeadCell>
		</TableHead>
		<TableBody>
			{#each models as model}
				<TableBodyRow>
					<TableBodyCell class="!p-4">
						<Checkbox
							on:click={() => {
								const index = listOfSelectedOwner.findIndex(
									(car_model_id) => (model.car_model_id = car_model_id)
								);

								if (index === -1) {
									listOfSelectedOwner = [...listOfSelectedOwner, model.car_model_id];
								} else {
									listOfSelectedOwner.splice(index, 1);
								}
							}}
						/>
					</TableBodyCell>
					<TableBodyCell>{model?.car_model_id}</TableBodyCell>
					<TableBodyCell>{model?.car_model_name}</TableBodyCell>
					<TableBodyCell>{model?.manufacturer}</TableBodyCell>
					<TableBodyCell>{model?.version}</TableBodyCell>
					<TableBodyCell>{model?.engine_type}</TableBodyCell>
					<TableBodyCell>{model?.fuel_type}</TableBodyCell>
					<TableBodyCell>{model?.transmission_type}</TableBodyCell>
					<TableBodyCell>{model?.horsepower}</TableBodyCell>
					<TableBodyCell>{model?.torque}</TableBodyCell>
					<TableBodyCell>{model?.seating_capacity}</TableBodyCell>
					<TableBodyCell>
						<Button
							size="xs"
							color="dark"
							on:click={() => {
								newAndEditFormModal = true;
								currentEditingModel = model;
							}}
						>
							Edit
						</Button>
						<Button
							size="xs"
							color="red"
							on:click={() => {
								deleteFormModal = true;
								currentEditingModel = model;
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
					<span>Car Model ID</span>
					<Input
						type="text"
						name="car_model_id"
						placeholder="a string..."
						value={currentEditingModel?.car_model_id}
					/>
				</Label>
				<Label class="space-y-2">
					<span>Car Model Name</span>
					<Input
						type="text"
						name="car_model_name"
						placeholder="car name"
						value={currentEditingModel?.car_model_name}
					/>
				</Label>
				<Label class="space-y-2">
					<span>manufacturer</span>
					<Input
						type="text"
						name="manufacturer"
						placeholder="Toyota..."
						value={currentEditingModel?.manufacturer}
						required
					/>
				</Label>
				<Label class="space-y-2">
					<span>Version</span>
					<Input
						type="text"
						name="version"
						placeholder="version..."
						value={currentEditingModel?.version}
						required
					/>
				</Label>
				<Label class="space-y-2">
					<span>Engine Type</span>
					<Input
						type="text"
						name="engine_type"
						placeholder="V4..."
						value={currentEditingModel?.engine_type}
						required
					/>
				</Label>
				<Label class="space-y-2">
					<span>Fuel Type</span>
					<Input
						type="text"
						name="fuel_type"
						placeholder="Diesel..."
						value={currentEditingModel?.fuel_type}
					/>
				</Label>
				<Label class="space-y-2">
					<span>Transmission Type</span>
					<Input
						type="text"
						name="transmission_type"
						placeholder="Automatic..."
						value={currentEditingModel?.transmission_type}
					/>
				</Label>
				<Label class="space-y-2">
					<span>Horsepower</span>
					<Input
						type="text"
						name="horsepower"
						placeholder="300"
						value={currentEditingModel?.horsepower}
					/>
				</Label>
				<Label class="space-y-2">
					<span>Torque</span>
					<Input
						type="text"
						name="torque"
						placeholder="280..."
						value={currentEditingModel?.torque}
					/>
				</Label>
				<Label class="space-y-2">
					<span>Seating Capacity</span>
					<Input
						type="text"
						name="seating_capacity"
						placeholder="4"
						value={currentEditingModel?.seating_capacity}
					/>
				</Label>

				<div class="flex flex-row items-center justify-center">
					<!-- currentEditingModel is modified based on which button user click -->
					{#if currentEditingModel?.car_model_id === undefined}
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
							Are you sure you want to delete <strong>THESE</strong> models?
						</h3>
					{:else}
						<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
							Are you sure you want to delete this model?
						</h3>
					{/if}

					<Input
						type="text"
						name="user_id"
						class="hidden"
						value={currentEditingModel.car_model_id}
					/>
					<Button type="button" color="alternative" on:click={() => (deleteFormModal = false)}
						>No, cancel</Button
					>
					<Button type="submit" color="red" class="mr-2">Yes, I'm sure</Button>
				</div>
			</form>
		</Modal>
	</Table>
</div>
