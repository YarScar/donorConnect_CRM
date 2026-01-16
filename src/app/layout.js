import '@/styles/globals.css'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import SessionProvider from '@/components/SessionProvider'
import Navigation from '@/components/Navigation'

export const metadata = {
  title: 'donorConnect - Nonprofit CRM',
  description: 'Lightweight CRM for managing donors, donations, campaigns, and events',
}

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en">
      <body>
        <SessionProvider session={session}>
          <Navigation />
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
