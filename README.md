# RegistryTotal Project
Registration Management System<br>  
RegistryTotal is a web application developed to support the Vehicle Registration Department and inspection centers nationwide in managing vehicle inspections for automobiles.<br><br>
Here is the [Figma design](https://www.figma.com/file/gMfg7f2zmkh2htwS3nbNgu/RegistryTotal-Design?type=design&node-id=0%3A1&mode=design&t=Y0UUur5GRfDrIUBv-1) for this project. This is used as a sample for the development and the final product can be a bit different.<br>
You can find more information about the description of what features the system should support [here](https://itest.com.vn/lects/webappdev/mockproj/registry-total.htm).<br>

## Technology used:
- SvelteKit
- Flowbite-Svelte

- TailwindCSS

- Database: Sqlite (with the support of Prisma). Here is [the design](https://drive.google.com/file/d/1mZW18g7-S2kMsiV3-fFJsAKn7yUjEkik/view?usp=sharing) of database.

## Features
- Authentication and authorization with JWT
- Role and permisson based routes
- Full CRUD operations on tables
- Check permissions before any operations
- Responsive design

## Testing
(*Coming soon*)

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

## Run the application
```bash
npm run dev
```
The application is hosted at <strong>localhost:5173</strong>

## Directory structure code
### Group structure
````
├── package.json
├── prisma
│   ├── schema.prisma                   # Define models
│   └── seed.ts                         # Seed data to database
├── src
│   ├── app.d.ts
│   ├── app.html
│   ├── app.postcss
│   ├── hooks.server.ts                 # Middleware, server will check JWT from any request here
│   ├── lib
│   │   ├── assets                      
│   │   ├── helpers                     # Helper functions for client logic
│   │   └── server                      # Only run on server
│   │       ├── database.ts             # Interface to communicate with server
│   │       └── helpers                 # Helper functions
│   └── routes                          # Filesystem-based routes (here is root route)
│       ├── (app)                       # Application group
│       │   ├── (about)                 # About pages group
│       │   ├── accounts                # Contains Accounts-related data, including UI and server logics
│       │   │   ├── +page.server.ts     # The 'server' means only run on server
│       │   │   └── +page.svelte        # Contains UI components
│       │   ├── cars
│       │   │   ├── inspections
│       │   │   ├── models
│       │   │   └── owners
│       │   ├── +error.svelte
│       │   ├── +layout.server.ts
│       │   ├── +layout.svelte 
│       │   ├── +page.server.ts
│       │   ├── +page.svelte
│       │   ├── station
│       │   ├── statistics
│       │   └── user
│       ├── (auth)                      # Authentication group
│       │   └── login
│       └── +layout.svelte              # Parent layout will be inherited by childrens
├── svelte.config.js
├── tailwind.config.cjs
├── tsconfig.json
└── vite.config.ts
````
