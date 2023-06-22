# RegistryTotal Project
Registration Management System<br>  
RegistryTotal is a web application developed to support the Vehicle Registration Department and inspection centers nationwide in managing vehicle inspections for automobiles.

## Technology used:
- SvelteKit
- Flowbite-Svelte

- TailwindCSS

- Database: Sqlite (with the support of Prisma). Here is [the design](https://drive.google.com/file/d/1mZW18g7-S2kMsiV3-fFJsAKn7yUjEkik/view?usp=sharing) of database.

## Guides to install

### Install required packages
```bash
npm install
```

### Setup database using Prisma
```bash
npx prisma migrate dev --name init
```
When creating a new database, seeding is also triggered. The seed file in [`prisma/seed.ts`](`prisma/seed.ts`) will be executed and your database will be populated with the sample data.
You can also reset database (data will be reset and then the seed file will be triggered for sample data)
```bash
npx prisma migrate reset
```

