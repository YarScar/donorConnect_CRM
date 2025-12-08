import '@/styles/globals.css'

export const metadata = {
  title: 'donorConnect - Nonprofit CRM',
  description: 'Lightweight CRM for managing donors, donations, campaigns, and events',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
