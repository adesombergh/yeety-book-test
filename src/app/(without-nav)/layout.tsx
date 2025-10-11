import { ReactNode } from 'react'

export default function WithoutNavLayout({
  children,
}: {
  children: ReactNode
}) {
  return <>{children}</>
}
