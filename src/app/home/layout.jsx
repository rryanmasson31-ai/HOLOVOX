import React from 'react'
import Header from '@/components/HomeLayout/header'
import Sidebar from '@/components/HomeLayout/sidebar'

const Layout = ({ children }) => {
  return (
   <div className="min-h-screen bg text-white">
      {/* Background Gradient Effect */}
      <div className="fixed inset-0 bg-linear-to-br from-[#E9164B]/5 via-transparent to-[#4E54E9]/5 pointer-events-none" />
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
