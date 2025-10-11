import { Footer } from '@/components/ui/footer'
import { Header } from '@/components/ui/header'
import { ReactNode } from 'react'

export default function WithNavLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  )
}
