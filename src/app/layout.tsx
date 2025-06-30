import './globals.css'

export const metadata = {
  title: 'Email Radar - Text Analysis Tool',
  description: 'AI-powered text analysis tool for improving your email communication with grammar corrections, tone analysis, and response insights',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
