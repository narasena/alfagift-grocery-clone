# Alfagift Grocery Clone

A full-stack e-commerce application that clones the functionality of the Alfagift grocery delivery service. This project demonstrates a modern web application built with Next.js for the frontend and a robust Express.js API for the backend.

<!-- You can add a screenshot or GIF of the project here -->
<!-- ![Project Screenshot](link-to-your-screenshot.png) -->

## Live Demo

[Alfagift-Clone](https://alfagift-grocery-clone.vercel.app/)

## Screenshots


## Feature Highlights

For the user UI/UX you can click the link above. But here are some features' snapshots for admin/managers.

### Admin-Product

[![Create Product to Product Lists](https://res.cloudinary.com/dhqgojfo2/video/upload/v1756808314/create_product_demo_a98c8n.mp4)](https://res.cloudinary.com/dhqgojfo2/video/upload/v1756808314/create_product_demo_a98c8n.mp4)


## Key Features

- **User Authentication**: Secure user registration and login system.
- **Product Catalog**: Browse and search for products with detailed descriptions.
- **Shopping Cart**: Add, remove, and update items in the cart.
- **Order Management**: Complete checkout process and view order history.
- **Admin Dashboard**: A dedicated interface for managing products, inventory, and orders.
- **Store Locator**: Find the nearest store and calculate shipping costs.
- **Promotions**: Apply vouchers and discounts to orders.
- **Referral System**: Users can invite others with a referral code.

## Tech Stack

### Frontend (Next.js)

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand

### Backend (Express.js)

- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **API**: RESTful API architecture

### DevOps

- **Containerization**: Docker & Docker Compose
- **Deployment**: Vercel (for frontend)

## Getting Started

### Prerequisites

- Node.js
- Docker Desktop

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/cursemaker/finpro-grocery.git
    cd finpro-grocery
    ```

2.  **Install dependencies for both services:**
    ```bash
    # Install API dependencies
    cd finpro-api
    npm install

    # Install Web dependencies
    cd ../finpro-web
    npm install
    ```

3.  **Set up environment variables:**
    - In `finpro-api/`, create a `.env.development` file based on the required environment variables (database URL, JWT secret, etc.).
    - In `finpro-web/`, create a `.env` file to store the backend API URL.

4.  **Run the application with Docker:**
    From the project root, run:
    ```bash
    docker-compose up -d --build
    ```
    - The web application will be available at `http://localhost:3001`.
    - The API will be available at `http://localhost:8001`.

## Project Structure

The project is organized into two main packages: `finpro-web` (frontend) and `finpro-api` (backend).

### Web (Next.js) Structure

```
finpro-web/
├── src/
│   ├── app/                 # App router pages and layouts
│   ├── components/          # Reusable React components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Library code and utilities
│   ├── services/            # API service functions
│   ├── store/               # Zustand state management
│   └── types/               # TypeScript type definitions
└── next.config.ts           # Next.js configuration
```

### API (Express.js) Structure

```
finpro-api/
├── prisma/                  # Prisma schema and migrations
├── src/
│   ├── controllers/         # Request handlers (Express)
│   ├── middlewares/         # Custom middlewares
│   ├── routers/             # API route definitions
│   ├── services/            # Business logic
│   ├── utils/               # Utility functions
│   ├── app.ts               # Express app setup
│   └── index.ts             # Server entry point
└── Dockerfile               # Docker configuration
```

## Author

- **narasena** - [GitHub Profile](https://github.com/narasena)