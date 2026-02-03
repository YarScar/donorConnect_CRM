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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <SessionProvider>
          <Navigation />
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
