import ReduxProvider from '../components/ReduxProvider'
import AuthProvider from '../components/AuthProvider'
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
          <AuthProvider>
            {children}
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}
