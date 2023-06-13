// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};

type userType = {
    user_id: number,
    username: string,
    password: string,
    is_admin: boolean,
    email?: string,
    created_time?: string,
    last_update?: string,
    inspection_station_id?: string,
}

