import type {Metadata} from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; // Import Toaster

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'], // Added various weights for Poppins
});

export const metadata: Metadata = {
  title: 'TaskWise - Smart Productivity',
  description: 'Input goals, get AI-generated subtasks, and boost your productivity.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
