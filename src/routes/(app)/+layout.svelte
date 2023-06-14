<script lang="ts">
	import { Account_box } from 'svelte-google-materialdesign-icons';
	import {
		Navbar,
		NavBrand,
		NavLi,
		NavUl,
		NavHamburger,
		Dropdown,
		DropdownItem,
		Chevron
	} from 'flowbite-svelte';
	import { Footer, FooterLinkGroup, FooterLink } from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import { afterUpdate, onMount } from 'svelte';
	import { page } from '$app/stores';

	// Holy, we need to import to make image work??
	import logo from '$lib/assets/logo_2.png';

	let role: string = '';
	// there's a bug here, if not put this in onMount, will get 500 error (ask gpt for more)
	onMount(() => {
		let loggedIn = localStorage.getItem('loggedIn') ?? '';
		role = localStorage.getItem('role') ?? '';

		if (!loggedIn) {
			goto('/login');
		}
	});

	let currentPath = '';
	let carPathExtraInfo = '';
	let rawPageRoute: string = '(app)/';

	afterUpdate(() => {
		rawPageRoute = $page.route.id ?? '';

		// console.log(rawPageRoute)

		// check if user is in main content
		if (rawPageRoute.match(/^\/\(app\)\/accounts.*$/)) {
			currentPath = 'in accounts page';
		} else if (rawPageRoute.match(/^\/\(app\)\/cars.*$/)) {
			currentPath = 'in cars page';
			if (rawPageRoute.match(/^\/\(app\)\/cars\/owners.*$/)) {
				carPathExtraInfo = 'in car owners page';
			} else if (rawPageRoute.match(/^\/\(app\)\/cars\/models.*$/)) {
				carPathExtraInfo = 'in car models page';
			} else if (rawPageRoute.match(/^\/\(app\)\/cars\/inspections.*$/)) {
				carPathExtraInfo = 'in car inspections page';
			}
		} else if (rawPageRoute.match(/^\/\(app\)\/statistics.*$/)) {
			currentPath = 'in statistics page';
		} else if (rawPageRoute.match(/^\/\(app\)\/user.*$/)) {
			currentPath = 'in user page';
		} else if (rawPageRoute.match(/^\/\(app\).*$/)) {
			currentPath = 'in homepage';
		}

		// check if user in abouts page
		// check this later because this is also in home page (root page)
		// but I dont want to highlight the HOME text
		if (rawPageRoute.match(/^\/\(app\)\/\(about\)\/about_us*$/)) {
			currentPath = 'in about us page';
		} else if (rawPageRoute.match(/^\/\(app\)\/\(about\)\/about_product*$/)) {
			currentPath = 'in about product page';
		} else if (rawPageRoute.match(/^\/\(app\)\/\(about\)\/about_technology*$/)) {
			currentPath = 'in about technology page';
		} else if (rawPageRoute.match(/^\/\(app\)\/\(about\)\/about_documentation*$/)) {
			currentPath = 'in about documentation page';
		}

		// console.log(currentPath);
	});
</script>

<!-- body height set to 100vh, navbar must be seen, footer must be seen, main content overflow will scoll -->
<body class="h-screen">
	<div
		class="flex flex-col items-center gap-4 min-h-screen h-full bg-secondary_color overflow-scroll"
	>
		<Navbar
			let:hidden
			let:toggle
			class="bg-primary_color sm:bg-primary_color md:bg-primary_color p-0 sm:p-0 hover:cursor-pointer overflow-scroll  top-0 w-full shrink-0"
		>
			<NavBrand href="/">
				<img src={logo} class="mr-3 h-12 sm:h-12" alt="RegistryTotal logo" />
			</NavBrand>

			<NavHamburger on:click={toggle} />

			<NavUl
				{hidden}
				activeClass="text-orange"
				ulClass="flex flex-col p-4 mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium text-brown"
				class="text-xs bg-primary_color !font-bold items-center"
			>
				{#if currentPath === 'in homepage'}
					<NavLi
						href="/"
						active={true}
						nonActiveClass="text-brown hover:text-orange"
						activeClass="text-orange">HOME</NavLi
					>
				{:else}
					<NavLi href="/" nonActiveClass="text-brown hover:text-orange" activeClass="text-orange"
						>HOME</NavLi
					>
				{/if}

				{#if currentPath === 'in accounts page'}
					{#if role === 'admin'}
						<NavLi
							active={true}
							href="/accounts"
							nonActiveClass="text-brown hover:text-orange"
							activeClass="text-orange">ACCOUNTS</NavLi
						>
					{/if}
				{:else if role === 'admin'}
					<NavLi
						href="/accounts"
						nonActiveClass="text-brown hover:text-orange"
						activeClass="text-orange">ACCOUNTS</NavLi
					>
				{/if}

				{#if currentPath === 'in cars page'}
					<NavLi
						active={true}
						nonActiveClass="text-brown hover:text-orange"
						activeClass="text-orange"><Chevron aligned>CAR</Chevron></NavLi
					>
					<Dropdown offset="18" class="font-bold">
						{#if carPathExtraInfo === 'in car owners page'}
							<DropdownItem href="/cars/owners" class="text-orange font-semibold"
								>Car Owners</DropdownItem
							>
						{:else}
							<DropdownItem href="/cars/owners" class="font-semibold">Car Owners</DropdownItem>
						{/if}

						{#if carPathExtraInfo === 'in car models page'}
							<DropdownItem href="/cars/models" class="text-orange font-semibold"
								>Car Models</DropdownItem
							>
						{:else}
							<DropdownItem href="/cars/models" class="font-semibold">Car Models</DropdownItem>
						{/if}

						{#if carPathExtraInfo === 'in car inspections page'}
							<DropdownItem href="/cars/inspections" class="text-orange font-semibold"
								>Car Inpectations</DropdownItem
							>
						{:else}
							<DropdownItem href="/cars/inspections" class="font-semibold"
								>Car Inpectations</DropdownItem
							>
						{/if}
					</Dropdown>
				{:else}
					<NavLi nonActiveClass="text-brown hover:text-orange" activeClass="text-orange"
						><Chevron aligned>CAR</Chevron></NavLi
					>
					<Dropdown offset="18">
						<DropdownItem href="/cars/owners" class="font-semibold">Car Owners</DropdownItem>
						<DropdownItem href="/cars/models" class="font-semibold">Car Models</DropdownItem>
						<DropdownItem href="/cars/inspections" class="font-semibold"
							>Car Inpectations</DropdownItem
						>
					</Dropdown>
				{/if}

				{#if currentPath === 'in statistics page'}
					<NavLi
						href="/statistics"
						active={true}
						nonActiveClass="text-brown hover:text-orange"
						activeClass="text-orange">STATISTICS</NavLi
					>
				{:else}
					<NavLi
						href="/statistics"
						nonActiveClass="text-brown hover:text-orange"
						activeClass="text-orange">STATISTICS</NavLi
					>{/if}

				{#if currentPath === 'in user page'}
					<NavLi href="/user"
						><Account_box variation="filled" class="text-orange hover:text-orange" /></NavLi
					>{:else}
					<NavLi href="/user"
						><Account_box variation="filled" class="text-brown hover:text-orange" /></NavLi
					>{/if}
			</NavUl>
		</Navbar>

		<slot />

		<Footer
			class="!bg-secondary_color !sm:bg-secondary_color !md:bg-secondary_color rounded-none !pt-0 !pb-4 shrink-0 overflow-scroll w-full"
		>
			<FooterLinkGroup
				ulClass="flex flex-wrap items-center justify-center grow text-light_yellow font-bold text-xs"
			>
				{#if currentPath === 'in about us page'}
					<FooterLink href="/about_us" aClass="underline">About us</FooterLink>
				{:else}
					<FooterLink href="/about_us">About us</FooterLink>
				{/if}

				{#if currentPath === 'in about product page'}
					<FooterLink href="/about_product" aClass="underline">Product</FooterLink>
				{:else}
					<FooterLink href="/about_product">Product</FooterLink>
				{/if}

				{#if currentPath === 'in about technology page'}
					<FooterLink href="/about_technology" aClass="underline">Technology</FooterLink>
				{:else}
					<FooterLink href="/about_technology">Technology</FooterLink>
				{/if}

				{#if currentPath === 'in about documentation page'}
					<FooterLink href="/about_documentation" aClass="underline">Documentation</FooterLink>
				{:else}
					<FooterLink href="/about_documentation">Documentation</FooterLink>
				{/if}
			</FooterLinkGroup>
		</Footer>
	</div>
</body>
