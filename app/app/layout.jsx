import './globals.css'

export const metadata = {
  title: 'French Dialogue Tutor',
  description: 'Interactive French learning for kids',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
