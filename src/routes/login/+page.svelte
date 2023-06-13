<script>
  import { Account_circle } from 'svelte-google-materialdesign-icons'
  import { Input, Helper, Button } from 'flowbite-svelte'
  import { onMount } from 'svelte'
  import { goto } from '$app/navigation'
  import { enhance } from '$app/forms'

  import logo from '$lib/assets/logo_2.png'
	import { afterUpdate } from 'svelte';

  export let form

  // onMount wont be triggered when use:enhance in form because the page wouldn't be reload
  onMount(() => {
    // if user logged in, navigate to home page
    if (localStorage.getItem('loggedIn')) {
      goto('/');
    }
  })

  afterUpdate(() => {
    if (form?.isCredentialValid) {
      // set local storage
      localStorage.setItem('loggedIn', 'true')
      localStorage.setItem('username', form?.username)
      localStorage.setItem('role', form?.role)

      // navigate to home page
      goto('/')
    }
  })
</script>

<div class="grid place-items-center h-screen w-full text-brown bg-gradient-to-r from-[#BA8E6E] to-[#F3DEBA]">
  <div class="relative w-2/5 bg-white rounded-lg shadow-xl p-6 pb-10">
    <img
      src={logo}
      class="h-12 right-0 top-0 absolute mt-2"
      alt="RegistryTotal logo"
    />
    <Account_circle 
      variation="filled" 
      size="70"
      class="text-brown mx-auto mt-16 mb-6"
    />
    <h1 class="text-xl text-center mb-6">Sign in to your account</h1>

    <!-- form need "name" attribute, the request is sent with value of tag has name -->
    <form method="POST" use:enhance>
      <div class="mb-4">
        <label for="username" class="text-sm">Username</label>
        <Input type="text" name="username" id="username" placeholder="username" required />
      </div>
      <div class="mb-1">
        <label for="password" class="text-sm">Password</label>
        <Input type="password" name="password" id="password" placeholder="password" required />
      </div>

      <div class="text-xs">
        <a href="/">Forgot your password?</a>
      </div>

      <div class="flex flex-col items-center">
        <Button type="submit" class="my-4 rounded-xl bg-light_green text-[#675D50] hover:bg-orange hover:text-white" color="undefined">Log in</Button>
        
        <!-- form prop data exist after form submits, there's a property named "error" -->
        {#if form?.error}
          <Helper class="!text-error_red visible">Invalid username or password!</Helper>
        {/if}
      </div>
    </form>
  </div>
</div>
