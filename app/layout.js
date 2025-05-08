export const metadata = {
  title: "Pharma Dashboard",
  description: "A dashboard for pharmaceutical companies",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>{children}</body>
    </html>
  )
}


import './globals.css'