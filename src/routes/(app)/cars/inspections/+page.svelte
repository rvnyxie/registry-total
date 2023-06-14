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

	type carInspection = {
    inspection_id: string,
    inspection_type: string,
    inspection_date: string,
    result: string,
    expired_date: string
    note: string
}

const default_inspection = [
    {
        inspection_id: "1",
        inspection_type: "Regular",
        inspection_date: "2023-04-01",
        result: "Pass",
        expired_date: "2024-04-01",
        note: "No issues found"
    },
    {
        inspection_id: "2",
        inspection_type: "Safety",
        inspection_date: "2023-03-15",
        result: "Fail",
        expired_date: "2024-03-15",
        note: "Brake system needs repair"
    },
    {
        inspection_id: "3",
        inspection_type: "Emission",
        inspection_date: "2023-02-20",
        result: "Pass",
        expired_date: "2024-02-20",
        note: "Vehicle meets emission standards"
    },
    {
        inspection_id: "4",
        inspection_type: "Regular",
        inspection_date: "2023-05-10",
        result: "Pass",
        expired_date: "2024-05-10",
        note: "No issues found"
    },
    {
        inspection_id: "5",
        inspection_type: "Safety",
        inspection_date: "2023-06-05",
        result: "Pass",
        expired_date: "2024-06-05",
        note: "Seat belts replaced"
    }
]

	let inspections: carInspection[];

	// TODO: cant access local storage without checking first
	// let localModels = localStorage.getItem('inspections') as string;

	// if (localModels !== null) {
	// 	inspections = JSON.parse(localModels);
	// } else {
	// 	inspections = default_models;
	// }

	inspections = default_inspection;

	console.log(inspections);

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

	let currentEditingInspection: {
		inspection_id?: string,
		inspection_type?: string,
		inspection_date?: string,
		result?: string,
        expired_date?: string,
		note?: string
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
		{#if listOfSelectedOwner.length === inspections.length}
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
				currentEditingInspection = {};
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
			<TableHeadCell>Car inspection ID</TableHeadCell>
			<TableHeadCell>Car inspection Type</TableHeadCell>
			<TableHeadCell>inspection_date</TableHeadCell>
			<TableHeadCell>result</TableHeadCell>
			<TableHeadCell>Expired Date</TableHeadCell>
			<TableHeadCell>Note</TableHeadCell>
			<TableHeadCell>
				<span class="sr-only"> Edit </span>
			</TableHeadCell>
			<TableHeadCell>
				<span class="sr-only"> Delete </span>
			</TableHeadCell>
		</TableHead>
		<TableBody>
			{#each inspections as inspection}
				<TableBodyRow>
					<TableBodyCell class="!p-4">
						<Checkbox
							on:click={() => {
								const index = listOfSelectedOwner.findIndex(
									(inspection_id) => (inspection.inspection_id = inspection_id)
								);

								if (index === -1) {
									listOfSelectedOwner = [...listOfSelectedOwner, inspection.inspection_id];
								} else {
									listOfSelectedOwner.splice(index, 1);
								}
							}}
						/>
					</TableBodyCell>
					<TableBodyCell>{inspection?.inspection_id}</TableBodyCell>
					<TableBodyCell>{inspection?.inspection_type}</TableBodyCell>
					<TableBodyCell>{inspection?.inspection_date}</TableBodyCell>
					<TableBodyCell>{inspection?.result}</TableBodyCell>
                    <TableBodyCell>{inspection?.expired_date}</TableBodyCell>
					<TableBodyCell>{inspection?.note}</TableBodyCell>
					<TableBodyCell>
						<Button
							size="xs"
							color="dark"
							on:click={() => {
								newAndEditFormModal = true;
								currentEditingInspection = inspection;
							}}
						>
							Edit
						</Button>
						<Button
							size="xs"
							color="red"
							on:click={() => {
								deleteFormModal = true;
								currentEditingInspection = inspection;
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
					<span>Car inspection ID</span>
					<Input
						type="text"
						name="inspection_id"
						placeholder="a string..."
						value={currentEditingInspection?.inspection_id}
					/>
				</Label>
				<Label class="space-y-2">
					<span>Car inspection Type</span>
					<Input
						type="text"
						name="inspection_type"
						placeholder="car name"
						value={currentEditingInspection?.inspection_type}
					/>
				</Label>
				<Label class="space-y-2">
					<span>Inspection Date</span>
					<Input
						type="text"
						name="inspection_date"
						placeholder="Toyota..."
						value={currentEditingInspection?.inspection_date}
						required
					/>
				</Label>
				<Label class="space-y-2">
					<span>Result</span>
					<Input
						type="text"
						name="result"
						placeholder="result..."
						value={currentEditingInspection?.result}
						required
					/>
				</Label>
                <Label class="space-y-2">
					<span>Expired Date</span>
					<Input
						type="text"
						name="expired_date"
						placeholder="05 05 2023..."
						value={currentEditingInspection?.expired_date}
						required
					/>
				</Label>
				<Label class="space-y-2">
					<span>Note</span>
					<Input
						type="text"
						name="note"
						placeholder="Some note..."
						value={currentEditingInspection?.note}
						required
					/>
				</Label>
			
				<div class="flex flex-row items-center justify-center">
					<!-- currentEditingInspection is modified based on which button user click -->
					{#if currentEditingInspection?.inspection_id === undefined}
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
							Are you sure you want to delete <strong>THESE</strong> inspections?
						</h3>
					{:else}
						<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
							Are you sure you want to delete this inspection?
						</h3>
					{/if}

					<Input
						type="text"
						name="user_id"
						class="hidden"
						value={currentEditingInspection.inspection_id}
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
