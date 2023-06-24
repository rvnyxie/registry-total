<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	import logo from '$lib/assets/logo.png';

	export let form: ActionData;

	let signupDesire = false;
	let forgotPasswordDesire = false;
</script>

<div
	class="grid place-items-center h-screen w-full text-brown bg-gradient-to-r from-[#BA8E6E] to-[#F3DEBA]"
>
	<div
		class="relative p-0 w-5/6 h-4/6 sm:w-4/6 md:w-3/6 lg:w-2/6 bg-white rounded-lg shadow-[5px_5px_4px_0_rgba(0,0,0,0.25)]"
	>
		<img src={logo} class="h-12 right-0 top-0 absolute mt-2" alt="RegistryTotal logo" />
		<svg
			class="mx-auto mt-16 mb-6 w-[70px] h-[70px]"
			xmlns="http://www.w3.org/2000/svg"
			width="1em"
			height="1em"
			viewBox="0 0 24 24"
			><path
				fill="currentColor"
				d="M12 3c2.21 0 4 1.79 4 4s-1.79 4-4 4s-4-1.79-4-4s1.79-4 4-4m4 10.54c0 1.06-.28 3.53-2.19 6.29L13 15l.94-1.88c-.62-.07-1.27-.12-1.94-.12s-1.32.05-1.94.12L11 15l-.81 4.83C8.28 17.07 8 14.6 8 13.54c-2.39.7-4 1.96-4 3.46v4h16v-4c0-1.5-1.6-2.76-4-3.46Z"
			/></svg
		>
		<h1 class="text-2xl text-center mb-3">Sign in to your account</h1>
		<p class="text-xs text-center mb-10">
			Don't have account? <a
				href="/login"
				class="underline"
				on:click={() => {
					signupDesire = true;
					setTimeout(() => {
						signupDesire = false;
					}, 5000);
				}}>Sign up</a
			> here!
		</p>

		<!-- form need "name" attribute, the request is sent with value of tag has name -->
		<form method="POST" action="?/login" use:enhance>
			<div class="flex flex-col justify-center items-center">
				<div class="mb-4 flex flex-col w-4/5 sm:w-3/5 md:w-3/5">
					<label for="username" class="text-sm">Username</label>
					<input
						type="text"
						id="username"
						name="username"
						class="text-sm font-medium block w-full rounded-lg bg-[#D9D9D9] border-0 border-b border-primary focus:border-transparent focus:ring-2 focus:ring-brown focus:bg-white"
						required
					/>
				</div>
				<div class="mb-1 flex flex-col w-4/5 sm:w-3/5 md:w-3/5">
					<label for="password" class="text-sm">Password</label>
					<input
						type="password"
						id="password"
						name="password"
						class="text-sm font-medium block w-full rounded-lg bg-[#D9D9D9] border-0 border-b border-primary focus:border-transparent focus:ring-2 focus:ring-brown focus:bg-white"
						required
					/>
				</div>

				<div class="text-[10px] underline flex flex-col mb-6 w-4/5 sm:w-3/5 md:w-3/5">
					<a
						href="/login"
						on:click={() => {
							forgotPasswordDesire = true;
							setTimeout(() => {
								forgotPasswordDesire = false;
							}, 5000);
						}}>Forgot your password?</a
					>
				</div>

				<div>
					<button
						type="submit"
						class="bg-light_green text-brown font-semibold p-2 px-4 mb-4 rounded-lg hover:bg-[#44a63f] hover:text-white focus:bg-[#44a63f] focus:text-white"
						>Login</button
					>
				</div>

				<div class="flex flex-col items-center">
					{#if signupDesire}
						<p class="text-error_red text-sm">
							Signup feature is not available.<br />
							Please refer to admin for more information!
						</p>
					{/if}
					{#if forgotPasswordDesire}
						<p class="text-error_red text-sm">
							ForgotPassword feature is not available.<br />
							Please refer to admin for more information!
						</p>
					{/if}
					{#if form?.invalid}
						<p class="text-error_red">Username and password is required!</p>
					{/if}
					{#if form?.credentialsError}
						<p class="text-error_red">Invalid username or password!</p>
					{/if}
				</div>
			</div>
		</form>
	</div>
</div>
