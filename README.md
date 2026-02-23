# Todo Dashboard - RoundTechSquare

A clean and responsive Todo Dashboard built as part of a frontend assignment. Fetches todos from a public API with pagination, toggle functionality, and the ability to add new tasks locally.

## Tech Stack

- **Next.js** (App Router)
- **TypeScript**
- **TanStack Query** (for data fetching & caching)
- **Tailwind CSS** (for styling)
- **JSONPlaceholder API** (https://jsonplaceholder.typicode.com/todos)

## Features

- Fetch todos dynamically using TanStack Query
- Pagination (10 items per page) with Previous / Next controls
- Toggle completed status of any todo (optimistic UI update)
- Add new todos locally
- Loading and error state handling
- Fully responsive design

## Getting Started

**Prerequisites:** Node.js 18+

1. Clone the repository:
   ```bash
   git clone https://github.com/FaizzE/todo-dashboard-roundtechsquare-assignment.git
   cd todo-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

Deployed on Vercel: [YOUR_DEPLOYED_LINK]

## Folder Structure

```
├── app/          # Next.js App Router pages
├── components/   # Reusable UI components
├── hooks/        # Custom React hooks
├── lib/          # Utility functions
├── types/        # TypeScript types
```