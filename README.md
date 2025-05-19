# SD Photo Booth Dashboard

A modern, feature-rich dashboard application built with Next.js 15, TypeScript, and Tailwind CSS. This dashboard provides a comprehensive interface for managing and monitoring SD Photo Booth operations.

## Features

- 🎨 Modern UI with Tailwind CSS and Radix UI components
- 🌐 Internationalization support with next-intl
- 🔐 Authentication with NextAuth.js
- 📊 Data visualization with Recharts and Mantine Charts
- 🎯 Form handling with React Hook Form and Zod validation
- 🌙 Dark/Light theme support
- 📱 Responsive design
- 🔍 Advanced search and filtering capabilities
- 📈 Real-time data updates
- 🔄 State management with Zustand
![image](https://github.com/user-attachments/assets/86ebae2c-3f2c-4c90-95fb-e23ac5fc1d18)
![image](https://github.com/user-attachments/assets/e2ff661d-4bc6-4e25-8238-e1c7df003331)
![image](https://github.com/user-attachments/assets/e36bfc67-f4c6-46ac-a185-f6c41a55439e)
![image](https://github.com/user-attachments/assets/19b8e888-a111-45d2-b0e3-277c290a40f1)
![image](https://github.com/user-attachments/assets/9fce8b8c-f9cc-4487-b2a9-2b2e68771f53)
![image](https://github.com/user-attachments/assets/dcfe8e5c-e1b9-4617-9740-7e6901572d6a)





## Tech Stack

- **Framework:** Next.js 15
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** 
  - Radix UI
  - Mantine
  - Heroicons
  - Lucide React
  - Shadcn/UI
- **State Management:** Zustand
- **Data Fetching:** TanStack Query
- **Form Handling:** React Hook Form + Zod
- **Authentication:** NextAuth.js
- **Internationalization:** next-intl
- **Charts:** Recharts, Mantine Charts
- **Date Handling:** date-fns
- **HTTP Client:** Axios

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn or pnpm or bun

### Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
cd sdphotobooth_dashboard
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory and add necessary environment variables.

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run analyze` - Analyze bundle size
- `npm run analyze:serve` - Analyze bundle size and start server

## Project Structure

```
├── app/              # Next.js app directory
├── components/       # Reusable UI components
├── hooks/           # Custom React hooks
├── lib/             # Utility libraries
├── services/        # API services
├── types/           # TypeScript type definitions
├── utils/           # Helper functions
├── providers/       # React context providers
├── i18n/            # Internationalization files
├── public/          # Static assets
└── configs/         # Configuration files
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


