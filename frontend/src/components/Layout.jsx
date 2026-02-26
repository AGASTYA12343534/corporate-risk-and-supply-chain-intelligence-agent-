import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="flex bg-slate-50 min-h-screen text-slate-800 font-sans">
      <Sidebar />
      <div className="ml-64 flex-1 flex flex-col min-h-screen">
        <Navbar />
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
