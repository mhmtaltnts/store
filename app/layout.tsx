import { Footer } from '@/ui/components/Footer'
import { Nav } from '@/ui/components/Nav'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/ui/components/AuthProvider'
import { Topbar } from '@/ui/components/Topbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout(props: { children: React.ReactNode, modal: React.ReactNode }) {

  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <Topbar />
        <Nav />
        <div className="flex-grow">
          <AuthProvider>
            {props.children}
          </AuthProvider>
        </div>
        <Footer />
        {props.modal}
      </body>
    </html>
  )
}
