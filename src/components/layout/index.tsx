import React from 'react'
import Navbar from '../Navbar'
import Footer from '../Footer'
 type LayoutProps = {
    children : React.ReactNode
 }
const Layout = ({
    children
} : LayoutProps) => {
  return (
    <>
        <Navbar />
        <main className="container mx-auto px-4 py-8 flex-grow">{children}</main>
        <Footer />
    </>
  )
}

export default Layout