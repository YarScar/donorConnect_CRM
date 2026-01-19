import '@/styles/globals.css'
import SessionProvider from '@/components/SessionProvider'
import Navigation from '@/components/Navigation'

export const metadata = {
  title: 'donorConnect - Nonprofit CRM',
  description: 'Lightweight CRM for managing donors, donations, campaigns, and events',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <Navigation />
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
