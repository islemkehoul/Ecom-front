import React, { useState } from 'react'
import Navbar from '../Navbar'
import Footer from '../Footer'
import { Drawer, MobileMenuButton } from '../ui/drawer'
import LanguageSelector from '@/components/theme/languange-selector';// adjust path as needed

type LayoutProps = {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      {/* Desktop Navbar */}
      <div className="hidden md:block">
        <Navbar />
      </div>

      {/* Mobile Header with Menu Button */}
      <div className="md:hidden bg-white dark:bg-slate-900 shadow-md dark:shadow-slate-900/50 transition-colors duration-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <MobileMenuButton onClick={() => setIsDrawerOpen(true)} />
          <div className="text-xl font-bold dark:text-slate-100">Logo</div>
          <LanguageSelector />
        </div>
      </div>

      {/* Mobile Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        position="left"
        title="Menu"
      >
        {/* Your mobile navigation content here */}
        <nav className="space-y-2">
          <a href="/" className="block px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 dark:text-slate-200 transition-colors">Home</a>
          <a href="/about" className="block px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 dark:text-slate-200 transition-colors">About</a>
          <a href="/products" className="block px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 dark:text-slate-200 transition-colors">Products</a>
          <a href="/contact" className="block px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 dark:text-slate-200 transition-colors">Contact</a>
          {/* Add more links */}
        </nav>
      </Drawer>

      <main className="container mx-auto px-4 py-8 flex-grow">{children}</main>
      <Footer />
    </>
  )
}

export default Layout