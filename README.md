# RegistryTotal Project
Registration Management System<br>  
RegistryTotal is a web application developed to support the Vehicle Registration Department and inspection centers nationwide in managing vehicle inspections for automobiles.<br><br>
Here is the [Figma design](https://www.figma.com/file/gMfg7f2zmkh2htwS3nbNgu/RegistryTotal-Design?type=design&node-id=0%3A1&mode=design&t=Y0UUur5GRfDrIUBv-1) for this project. This is used as a sample for the development and the final product can be a bit different.

## Technology used:
- SvelteKit
- Flowbite-Svelte

- TailwindCSS

- Database: Sqlite (with the support of Prisma). Here is [the design](https://drive.google.com/file/d/1mZW18g7-S2kMsiV3-fFJsAKn7yUjEkik/view?usp=sharing) of database.

## Features
- Authentication and authorization with JWT
- Role and permisson based route

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
Default login data:
- User 1: { username: 'admin', password: 'admin' }
- User 2: { username: 'normal', password: 'normal' }

