import { Sidebar } from '@/components/organisms/Sidebar'

/**
 * Layout shared by all authenticated routes.
 * Renders the persistent sidebar and the page content area.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      {/* Persistent navigation sidebar */}
      <Sidebar />

      {/* Main content area — scrollable */}
      <main
        id="main-content"
        className="flex-1 overflow-y-auto"
        tabIndex={-1}
      >
        {children}
      </main>
    </div>
  )
}
