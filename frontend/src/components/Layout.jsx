import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex bg-slate-50 min-h-screen text-slate-800 font-sans w-full overflow-x-hidden">
      <Sidebar isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />
      <div className="md:ml-64 flex-1 flex flex-col min-h-screen w-full transition-all duration-300">
        <Navbar onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
