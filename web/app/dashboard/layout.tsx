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
    <div className="flex min-h-screen flex-col bg-surface md:h-screen md:flex-row md:overflow-hidden">
      {/* Persistent navigation sidebar */}
      <Sidebar />

      {/* Main content area — scrollable */}
      <main
        id="main-content"
        className="min-w-0 flex-1 overflow-y-auto"
        tabIndex={-1}
      >
        {children}
      </main>
    </div>
  )
}
