# 1. How to use commitlint:

Commit message type:

**`chore`**: Changes that don't modify source code or tests but relate to the build process, tooling, or other maintenance tasks

**`feat`**: New features

**`fix`**: Bug fixes

**`docs`**: Documentation changes

**`style`**: Code style changes (formatting, semicolons, etc.)

**`refactor`**: Code changes that neither fix bugs nor add features

**`test`**: Adding or fixing tests

**`build`**: Changes affecting build system or dependencies

**`ci`**: Changes to CI configuration files and scripts

**`perf`**: Performance improvements

# 2. Folder Structures:

For references:

## 2.1 Web (Next.js) Structure

```
finpro-web/
├── public/                  # Static assets
│   ├── images/              # Image assets
│   └── fonts/               # Font files
├── src/
│   ├── app/                 # App router pages
│   │   ├── (auth)/          # Auth-related routes (grouped)
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── dashboard/       # Dashboard routes
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Home page
│   ├── components/          # Reusable components
│   │   ├── ui/              # UI components (buttons, inputs, etc.)
│   │   ├── forms/           # Form components
│   │   └── layouts/         # Layout components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Library code
│   │   └── utils.ts         # Utility functions
│   ├── services/            # API service functions
│   │   ├── api.ts           # Axios instance setup
│   │   └── auth.service.ts  # Auth-related API calls
│   ├── store/               # State management
│   │   └── slices/          # Redux slices or context
│   └── types/               # TypeScript type definitions
├── tailwind.config.js       # Tailwind configuration
└── tsconfig.json            # TypeScript configuration
```
## 2.2 Api (Express) Structure
```
finpro-api/
├── prisma/                  # Prisma ORM
│   ├── migrations/          # Database migrations
│   └── schema.prisma        # Database schema
├── src/
│   ├── controllers/         # Request handlers
│   │   ├── auth.controller.ts
│   │   └── user.controller.ts
│   ├── middlewares/         # Express middlewares
│   │   ├── auth.middleware.ts
│   │   └── validation.middleware.ts
│   ├── models/              # Data models (if not using Prisma)
│   ├── repositories/        # Data access layer
│   │   └── user.repository.ts
│   ├── routers/             # Route definitions
│   │   ├── auth.router.ts
│   │   └── user.router.ts
│   ├── services/            # Business logic
│   │   ├── auth.service.ts
│   │   └── user.service.ts
│   ├── utils/               # Utility functions
│   │   ├── jwt.util.ts
│   │   └── password.util.ts
│   ├── validators/          # Request validation schemas
│   │   └── auth.validator.ts
│   ├── app.ts               # Express app setup
│   ├── config.ts            # Configuration
│   └── index.ts             # Entry point
├── tests/                   # Test files
├── vercel.json              # Vercel deployment config
└── tsconfig.json            # TypeScript configuration

```