import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'g-exp',
  description: 'g-exp',
  generator: 'g-exp',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
