<script lang="ts">
  import { Account_box } from 'svelte-google-materialdesign-icons'
  import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Dropdown, DropdownItem, Chevron } from 'flowbite-svelte'
  import { Footer, FooterLinkGroup, FooterLink } from 'flowbite-svelte'
	import { goto } from '$app/navigation';
  import { onMount } from 'svelte';


  // Holy, we need to import to make image work??
  import logo from '$lib/assets/logo_2.png'

  let role: string = ''
  // there's a bug here, if not put this in onMount, will get 500 error (ask gpt for more)
  onMount(() => {
    let loggedIn = localStorage.getItem('loggedIn') ?? ''
    role = localStorage.getItem('role') ?? ''

    if (!loggedIn) {
      goto('/login')
    }
  })

</script>

<!-- body height set to 100vh, navbar must be seen, footer must be seen, main content overflow will scoll -->
<body class="h-screen">
  <div class="flex flex-col items-center gap-4 min-h-screen h-full bg-secondary_color overflow-scroll">
    <Navbar 
      let:hidden 
      let:toggle 
      class="bg-primary_color sm:bg-primary_color md:bg-primary_color p-0 sm:p-0 hover:cursor-pointer overflow-scroll  top-0 w-full shrink-0"
    >
      <NavBrand href="/">
        <img
          src={logo}
          class="mr-3 h-12 sm:h-12"
          alt="RegistryTotal logo"
        />
      </NavBrand>
      <NavHamburger on:click={toggle} />
      <NavUl 
        {hidden} 
        activeClass="text-orange" 
        ulClass="flex flex-col p-4 mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium text-brown"
        class="text-xs bg-primary_color !font-bold items-center">
        <NavLi href="/" active={true} nonActiveClass="text-brown hover:text-orange" activeClass="text-orange">HOME</NavLi>
        {#if role === 'admin'}
          <NavLi href="/account" nonActiveClass="text-brown hover:text-orange" activeClass="text-orange">ACCOUNTS</NavLi>
        {/if}
        <NavLi nonActiveClass="text-brown hover:text-orange" activeClass="text-orange"><Chevron aligned>CAR</Chevron></NavLi>
        <Dropdown offset="18">
          <DropdownItem href="/car/owner">Car Owners</DropdownItem>
          <DropdownItem href="/car/model">Car Models</DropdownItem>
          <DropdownItem href="/car/inspection">Car Inpectations</DropdownItem>
        </Dropdown>
        <NavLi href="/statistic" nonActiveClass="text-brown hover:text-orange" activeClass="text-orange">STATISTICS</NavLi>
        <NavLi href="/user"><Account_box  variation="filled" class="text-brown hover:text-orange"/></NavLi>
      </NavUl>
    </Navbar>
  
    <slot />
  
    <Footer class="!bg-secondary_color !sm:bg-secondary_color !md:bg-secondary_color rounded-none !pt-0 !pb-4 shrink-0 overflow-scroll w-full">
      <FooterLinkGroup ulClass="flex flex-wrap items-center justify-center grow text-light_yellow font-bold text-xs">
        <FooterLink href="/about_us">About us</FooterLink>
        <FooterLink href="/about_product">Product</FooterLink>
        <FooterLink href="/about_technology">Technology</FooterLink>
        <FooterLink href="/about_documentation">Documentation</FooterLink>
      </FooterLinkGroup>
    </Footer>
  </div>
</body>



