import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Video Chat AI',
  description: 'Transcribe videos and generate AI-powered completions',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background antialiased">
        <div className="container mx-auto py-8 px-4">
          <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              Video Chat AI
            </h1>
            <p className="text-muted-foreground mt-1">
              Upload videos, transcribe, and generate AI completions
            </p>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
