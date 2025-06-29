import ReduxProvider from '../components/ReduxProvider'
import './globals.css'

export const metadata = {
  title: 'Email Radar - AI-Powered Email Assistant',
  description: 'Grammarly-style assistant for Gmail with real-time grammar checking and AI-powered rewrites',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  )
}
