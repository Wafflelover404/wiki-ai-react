import type React from "react"
import AppLayoutContent from "./_app-layout-content"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppLayoutContent>{children}</AppLayoutContent>
}
