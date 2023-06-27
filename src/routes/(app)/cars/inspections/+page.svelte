<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { formatDate } from '$lib/helpers/format.js';
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

	let carInspections = data.carInspections;

	// auto update carInspection in table whenever data.carInspections (returned from server load function) changes
	// The data.carInspections will change when we create, edit or delete
	$: carInspections = data.carInspections;

	// Create a variable with type of carInspection but all properties are optional
	let currentEditingCarInpection: Partial<(typeof carInspections)[number]> = {};

	type NewCarInspection = {
		carRegistrationNumber: string;
		inspectionStationId: number;
	};
	let currentCreatingCarInpection: NewCarInspection = {
		carRegistrationNumber: '',
		inspectionStationId: data.carInspections[0].inspectionStationId
			? data.carInspections[0].inspectionStationId
			: -1
	};

	// Variables responsible for modal showing
	let creatingCarInspection = false;
	let editingCarInspection = false;
	let deletingCarInspection = false;

	// Variables responsible for checkboxes functions to work
	let selectedCarInspections: string[] = [];
	let isTableHeadChecked = false;
	let isAllTableRowChecked = false;
	$: totalCarInspections = carInspections.length;

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

	// Update carInspections based on results matched the search query
	$: {
		if (form?.status === 'success' && form?.action === 'searchCarInspections') {
			const matchedCarInspectionIds = form?.matchedCarInspectionIds;

			carInspections = carInspections.filter((carInspection) => {
				return matchedCarInspectionIds?.includes(carInspection.id);
			});

			if (form) {
				form.status = '';
				form.action = '';
			}
		}
	}

	function createNewCarInspectionId(
		carRegistrationNumber: string | undefined,
		stationId: number | undefined,
		currentDate: Date
	) {
		let finalCarInspectionId;

		if (!carRegistrationNumber || !stationId || !currentDate) {
			return '';
		}

		const day = currentDate.getDay().toString().padStart(2, '0');
		const month = currentDate.getMonth().toString().padStart(2, '0');
		const year = currentDate.getFullYear().toString().slice(-2);

		const partOfRegistrationNumber = carRegistrationNumber.slice(0, 3);
		const partOfStationId =
			stationId.toString().length >= 3
				? stationId.toString().slice(0, 3)
				: stationId.toString().padStart(3, '0');
		const partOfDate = `${day}${month}${year}`;
		const randomPart = getRandomChars(3);

		return (finalCarInspectionId = `${partOfRegistrationNumber}${partOfStationId}${partOfDate}${randomPart}`);
	}

	function getRandomChars(length: number) {
		let result = '';
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		const charactersLength = characters.length;

		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}

		return result;
	}

	let newCarInspectionId: string;
	$: {
		newCarInspectionId = createNewCarInspectionId(
			currentCreatingCarInpection?.carRegistrationNumber,
			currentCreatingCarInpection?.inspectionStationId,
			new Date()
		);

		console.log(newCarInspectionId);
	}
</script>

<div class="w-1/2 bg-primary_color">
	<form method="POST" action="?/searchCarInspections" class="bg-secondary_color" use:enhance>
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
					{#if form?.action === 'createCarInspection'}
						<div>
							<p class="text-sm p-2 bg-light_green text-brown font-bold rounded-lg">
								Created Successful!
							</p>
						</div>
					{:else if form?.action === 'deleteCarInspection'}
						<div>
							<p class="text-sm p-2 bg-light_green text-brown font-bold rounded-lg">
								Deleted Successful!
							</p>
						</div>
					{:else if form?.action === 'deleteManyCarInspections	'}
						<div>
							<p class="text-sm p-2 bg-light_green text-brown font-bold rounded-lg">
								Deleted Successful!
							</p>
						</div>
					{:else if form?.action === 'editCarInspection'}
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
				creatingCarInspection = true;
				currentEditingCarInpection = {};
			}}
		>
			New
		</Button>
		{#if selectedCarInspections.length > 1}
			<Button
				class="mb-2"
				size="xs"
				on:click={() => {
					deletingCarInspection = true;
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
						// if checked = true, all the carInspections need to be checked
						isTableHeadChecked = !isTableHeadChecked;

						// when TableHead is checked, add all carInspections id to selectedCarInspections list
						// reset selectedCarInspections when uncheck
						if (isTableHeadChecked) {
							selectedCarInspections = carInspections.map((carInspection) => carInspection.id);
						} else {
							selectedCarInspections = [];
						}
					}}
				/>
			</TableHeadCell>
			<TableHeadCell>Car Inspection ID</TableHeadCell>
			<TableHeadCell>Inspection Type</TableHeadCell>
			<TableHeadCell>Inspection Date</TableHeadCell>
			<TableHeadCell>result</TableHeadCell>
			<TableHeadCell>Expired Date</TableHeadCell>
			<TableHeadCell>Note</TableHeadCell>
			<TableHeadCell>Car Registration Number</TableHeadCell>
			<TableHeadCell>Car License Plate Number</TableHeadCell>
			<TableHeadCell>Inspection Station ID</TableHeadCell>
			<TableHeadCell>Inspection Station Name</TableHeadCell>
			<TableHeadCell>
				<span class="sr-only"> Edit </span>
			</TableHeadCell>
			<TableHeadCell>
				<span class="sr-only"> Delete </span>
			</TableHeadCell>
		</TableHead>
		<TableBody>
			{#each carInspections as carInspection}
				<TableBodyRow>
					<TableBodyCell class="!p-4">
						<Checkbox
							checked={isTableHeadChecked}
							on:click={() => {
								// if carInspection.id is in selectedCarInspections, remove it
								// else add it
								// note: reactivity in svelte is triggered by assignment
								if (selectedCarInspections.includes(carInspection.id)) {
									selectedCarInspections = selectedCarInspections.filter(
										(id) => carInspection.id !== id
									);
								} else {
									selectedCarInspections = [...selectedCarInspections, carInspection.id];
								}

								// if all carInspections are checked, then checkbox in TableHead is checked
								if (selectedCarInspections.length === totalCarInspections) {
									isAllTableRowChecked = true;
								} else {
									isAllTableRowChecked = false;
								}
							}}
						/>
					</TableBodyCell>
					<TableBodyCell>{carInspection?.id}</TableBodyCell>
					<TableBodyCell>{carInspection?.inspectionType}</TableBodyCell>
					<TableBodyCell>{formatDate(carInspection?.inspectionDate)}</TableBodyCell>
					<TableBodyCell>{carInspection?.result}</TableBodyCell>
					<TableBodyCell>{formatDate(carInspection?.expiredDate)}</TableBodyCell>
					<TableBodyCell>{carInspection?.note}</TableBodyCell>
					<TableBodyCell>{carInspection?.car?.registrationNumber}</TableBodyCell>
					<TableBodyCell>{carInspection?.car?.licensePlateNumber}</TableBodyCell>
					<TableBodyCell>{carInspection?.inspectionStationId}</TableBodyCell>
					<TableBodyCell>{carInspection?.inspectionStation?.stationName}</TableBodyCell>
					<TableBodyCell>
						<Button
							size="xs"
							color="dark"
							on:click={() => {
								editingCarInspection = true;
								currentEditingCarInpection = carInspection;
							}}
						>
							Edit
						</Button>
						<Button
							size="xs"
							color="red"
							on:click={() => {
								deletingCarInspection = true;
								currentEditingCarInpection = carInspection;
							}}
						>
							Delete
						</Button>
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>

		<!-- New Modal -->
		<Modal bind:open={creatingCarInspection} outsideclose={true} size="md" class="w-full">
			<form
				method="POST"
				action="?/createCarInspection"
				use:enhance={() => {
					return async ({ result }) => {
						if (result.status === 200) {
							invalidateAll();
							creatingCarInspection = false;
						}

						// Reset the id after form submission
						newCarInspectionId = '';

						await applyAction(result);
					};
				}}
			>
				<Label class="space-y-2">
					<span>Car Inspection ID</span>
					<Input
						type="text"
						name="id"
						placeholder="This field will be created automatically!"
						bind:value={newCarInspectionId}
						color="green"
						readonly
					/>
				</Label>
				<Label class="space-y-2">
					<span>Inspection Type</span>
					<Input type="text" name="inspectionType" placeholder="Safety inspection" />
				</Label>
				<Label class="space-y-2">
					<span>Result</span>
					<Input type="text" name="result" placeholder="success/failed" />
				</Label>
				<Label class="space-y-2">
					<span>Expired Date</span>
					<Input type="text" name="expiredDate" placeholder="1 year" />
				</Label>
				<Label class="space-y-2">
					<span>Note</span>
					<Input type="text" name="note" placeholder="Extra info..." />
				</Label>
				<Label class="space-y-2">
					<span>Car Registration Number</span>
					<Input
						type="text"
						name="registrationNumber"
						placeholder="111222"
						bind:value={currentCreatingCarInpection.carRegistrationNumber}
					/>
				</Label>
				<Label class="space-y-2">
					<span>Car License Plate Number</span>
					<Input type="text" name="licensePlateNumber" placeholder="30A-777.77" />
				</Label>
				<Label class="space-y-2">
					<span>Inspection Station ID</span>
					<Input
						type="text"
						name="inspectionStationId"
						placeholder="1"
						color="green"
						bind:value={currentCreatingCarInpection.inspectionStationId}
						readonly
					/>
				</Label>

				<div class="flex flex-row items-center justify-center">
					<Button
						type="button"
						color="red"
						on:click={() => {
							creatingCarInspection = false;
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
		<Modal bind:open={editingCarInspection} outsideclose={true} size="md" class="w-full">
			<form
				method="POST"
				action="?/editCarInspection"
				use:enhance={() => {
					return async ({ result }) => {
						if (result.status === 200) {
							invalidateAll();
							editingCarInspection = false;
						}

						await applyAction(result);
					};
				}}
			>
				<Label class="space-y-2">
					<span>Car Inspeciton ID</span>
					<Input
						type="text"
						name="id"
						placeholder="444333NIS230623XZ"
						value={currentEditingCarInpection?.id}
						color="green"
						readonly
					/>
				</Label>

				<Label class="space-y-2">
					<span>Inspection Type</span>
					<Input
						type="text"
						name="inspectionType"
						placeholder="Safety inspection"
						value={currentEditingCarInpection?.inspectionType}
						required
					/>
				</Label>
				<Label class="space-y-2">
					<span>Inspection Date</span>
					<Input
						type="text"
						name="inspectionDate"
						placeholder="Mon Jun 26 2023 13:57:31"
						value={formatDate(currentEditingCarInpection?.inspectionDate)}
						color="green"
						readonly
					/>
				</Label>
				<Label class="space-y-2">
					<span>result</span>
					<Input
						type="text"
						name="result"
						placeholder="success/failed"
						value={currentEditingCarInpection?.result}
						required
					/>
				</Label>
				<Label class="space-y-2">
					<span>Expired Date</span>
					<Input
						type="text"
						name="expiredDate"
						class="hidden"
						placeholder="Mon Jun 26 2024 13:57:31"
						value={formatDate(currentEditingCarInpection?.expiredDate)}
					/>
				</Label>
				<Label class="space-y-2">
					<span>Note</span>
					<Input
						type="text"
						name="note"
						placeholder="Extra info..."
						value={currentEditingCarInpection?.note}
					/>
				</Label>
				<Label class="space-y-2">
					<span>Car Registration Number</span>
					<Input
						type="text"
						name="registrationNumber"
						placeholder="Automatic..."
						value={currentEditingCarInpection?.car?.registrationNumber}
						readonly
					/>
				</Label>
				<Label class="space-y-2">
					<span>Inspection Station ID</span>
					<Input
						type="text"
						name="inspectionStationId"
						placeholder="1"
						value={currentEditingCarInpection?.inspectionStationId}
					/>
				</Label>

				<div class="flex flex-row items-center justify-center">
					<Button
						type="button"
						color="alternative"
						on:click={() => {
							editingCarInspection = false;
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
		<Modal bind:open={deletingCarInspection} outsideclose={true} size="md" class="w-full">
			<form
				method="POST"
				action="?/deleteCarInspection"
				use:enhance={() => {
					return async ({ result }) => {
						if (result.status === 200) {
							invalidateAll();
							deletingCarInspection = false;
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

					{#if selectedCarInspections.length > 1}
						<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
							Are you sure you want to delete <strong>THESE</strong> selected car inspections?
						</h3>
						<Input type="text" name="ids" class="hidden" value={selectedCarInspections} />
						<Button
							type="button"
							color="alternative"
							on:click={() => {
								deletingCarInspection = false;
								successfulCancel = true;

								// Turn off state to close notification
								setTimeout(() => {
									successfulCancel = false;
								}, 2000);
							}}>No, cancel</Button
						>
						<Button type="submit" color="red" class="mr-2" formaction="?/deleteManyCarInspections"
							>Yes, I'm sure</Button
						>
					{:else}
						<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
							Are you sure you want to delete this car inspection?
						</h3>
						<Input type="text" name="id" class="hidden" value={currentEditingCarInpection.id} />
						<Button
							type="button"
							color="alternative"
							on:click={() => {
								deletingCarInspection = false;
								successfulCancel = true;

								// Turn off state to close notification
								setTimeout(() => {
									successfulCancel = false;
								}, 2000);
							}}>No, cancel</Button
						>
						<Button type="submit" color="red" class="mr-2" formaction="?/deleteCarInspection"
							>Yes, I'm sure</Button
						>
					{/if}
				</div>
			</form>
		</Modal>
	</Table>
</div>
