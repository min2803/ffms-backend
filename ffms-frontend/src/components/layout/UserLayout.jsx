import React, { useState } from "react";
import { Menu, X } from "lucide-react";

export default function UserLayout({
  sidebar,
  header,
  children,
  sidebarCollapsed = false,
  showHeader = true,
  headerContainerClassName = "max-w-5xl",
  contentContainerClassName = "max-w-5xl",
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const sidebarWidth = sidebarCollapsed ? "w-20" : "w-64";

  return (
    <div className="flex min-h-screen bg-[var(--color-bg-page)] font-sans text-[var(--color-text-primary)] relative">
      
      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm desktop:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Cột Sidebar Menu */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 h-screen shrink-0 border-r border-[var(--color-border-default)] bg-[var(--color-bg-sidebar)] transition-transform duration-300 desktop:sticky desktop:top-0 desktop:translate-x-0 ${sidebarWidth} ${
          isMobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Nút đóng Sidebar trên Mobile */}
        <div className="desktop:hidden absolute top-4 right-4 z-50">
          <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 hover:text-gray-900 rounded-lg p-1 bg-white border border-[var(--color-border-default)]">
            <X size={20} />
          </button>
        </div>
        <div className="h-full overflow-y-auto">{sidebar}</div>
      </aside>

      {/* Main Content Area */}
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        {showHeader ? (
          <header className="sticky top-0 z-20 border-b border-[var(--color-border-default)] bg-[var(--color-bg-surface)]/90 backdrop-blur">
            <div className={`mx-auto w-full px-4 py-4 ${headerContainerClassName} flex items-center`}>
              
              {/* Hamburger Toggle (Mobile Only) */}
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="mr-3 p-2 -ml-2 rounded-md hover:bg-gray-100 text-gray-600 lg:hidden"
              >
                <Menu size={24} />
              </button>

              <div className="flex-1 min-w-0">
                {header}
              </div>
              
            </div>
          </header>
        ) : null}

        <main className="min-h-0 flex-1 overflow-y-auto px-4 py-6 md:p-6 lg:px-8">
          <div className={`mx-auto w-full ${contentContainerClassName}`}>{children}</div>
        </main>
      </div>
    </div>
  );
}
