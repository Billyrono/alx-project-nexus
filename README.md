# NexaMart Marketplace

**NexaMart Marketplace** is a modern, full-featured e-commerce platform built with **Next.js 14**, **Redux Toolkit**, and **Tailwind CSS**. Designed as a premium lifestyle and home essentials store, it demonstrates a scalable frontend architecture, responsive design, and integration with external APIs for a seamless shopping experience.

## Project Context

This project was developed in fulfillment of the **ALX ProDev Frontend Engineering** program requirements. It serves as the capstone project for the **Project Nexus** module, demonstrating proficiency in modern frontend development practices including component-based architecture, state management, API integration, responsive design, and deployment to production.

**Author:** Billy Rono  
**Program:** ALX ProDev Frontend Engineering  
<<<<<<< HEAD
**Module:** Project Nexus  
=======
**Module:** Project Nexus
>>>>>>> 0b44355946a35cf353c21f71178715f0bf619453

## Live Demo

[View Live Demo](https://nexamart-marketplace.vercel.app)

## Features

### Product Catalog
- **Dynamic Product Listing**: Fetches products from [DummyJSON](https://dummyjson.com/docs/products) API.
- **Advanced Filtering**: Filter products by category, price range, and rating.
- **Sorting**: Sort products by price (low to high, high to low).
- **Search**: Real-time product search functionality.
- **Product Details**: Comprehensive product pages with image galleries, detailed descriptions, specifications, and reviews.

### Shopping Cart & Checkout
- **State Management**: Robust cart management using **Redux Toolkit**.
- **Persistent Cart**: Cart items persist across sessions using `localStorage`.
- **Seamless Checkout**: Multi-step checkout process (Shipping, Payment, Review).
- **Order Management**: Client-side order history tracking.

### User Account
- **Authentication**: Simulated login and registration using DummyJSON Auth.
- **User Dashboard**: personalized dashboard showing recent orders and account details.
- **Wishlist**: Save favorite items for later.
- **Settings**: Update profile information and preferences.

### Performance & UX
- **Page Transitions**: Smooth, animated page transitions using **Framer Motion**.
- **Loading States**: Custom animated logo loader and skeleton screens for optimal perceived performance.
- **Responsive Design**: Mobile-first approach ensuring a perfect experience on all devices.
- **SEO Optimized**: proper metadata, OpenGraph tags, and semantic HTML structure.

### Admin Dashboard (Demo)
- **Analytics**: Overview of sales, orders, and customer growth.
- **Product Management**: Interface to add/edit products (simulated).
- **Order Management**: View and manage customer orders.

## Tech Stack

- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data Fetching**: Native `fetch` with Next.js caching.
- **API**: [DummyJSON](https://dummyjson.com/)

## Project Structure

```bash
alx-project-nexus/
├── app/                  # Next.js App Router directories
│   ├── (auth)/           # Authentication routes (login, signup)
│   ├── account/          # User account routes
│   ├── admin/            # Admin dashboard routes
│   ├── checkout/         # Checkout flow
│   ├── product/[id]/     # Product detail pages
│   ├── shop/             # Product catalog page
│   ├── loading.tsx       # Global loading state
│   └── layout.tsx        # Root layout
├── components/           # Reusable UI components
│   ├── nexamart/         # Brand-specific components (Header, Footer, etc.)
│   └── ui/               # Generic UI elements (Buttons, Inputs)
├── store/                # Redux store configuration
│   ├── slices/           # Redux slices (cart, auth, wishlist, orders)
│   └── hooks.ts          # Typed Redux hooks
├── services/             # API service layer (api.ts)
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

## Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Billyrono/alx-project-nexus.git
    cd alx-project-nexus
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  **Open your browser**
    Navigate to `http://localhost:3000` to see the application running.

## Build & Deployment

To create a production build:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.
<<<<<<< HEAD
=======

>>>>>>> 0b44355946a35cf353c21f71178715f0bf619453
