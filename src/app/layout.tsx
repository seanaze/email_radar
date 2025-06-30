import ReduxProvider from '../components/ReduxProvider'
import './globals.css'

export const metadata = {
  title: 'Email Radar - AI-Powered Email Assistant',
  description: 'AI-powered email analysis tool with grammar checking, tone analysis, and response prediction',
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
