"use client";

import React, { useState } from 'react';
import { Plus, Pencil, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MainNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Random custom SVG logo (abstract document shape)
  const LogoSVG = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path 
        d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M14 2V8H20" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M12 18V12" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M9 15L12 12L15 15" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed top-0 w-full z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-11">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="text-red-600 group-hover:text-red-700 transition-colors">
              <LogoSVG />
            </div>
            <span className="text-sm font-bold text-gray-900 tracking-tight">WhiteDocs</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1.5">
            <Link 
              href="/editor/new"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                isActive('/editor/new')
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Plus size={14} /> New PDF
            </Link>
            <Link 
              href="/editor"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                isActive('/editor')
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Pencil size={14} /> Edit PDF
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-gray-600 hover:text-gray-900 p-1 rounded-md hover:bg-gray-50 transition-colors"
            >
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-sm">
          <div className="flex flex-col items-center py-3 space-y-2 px-4">
            <Link 
              href="/editor/new"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-1.5 px-5 py-1.5 rounded-md text-xs font-medium w-full justify-center transition-all ${
                isActive('/editor/new')
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Plus size={14} /> New PDF
            </Link>
            <Link 
              href="/editor"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-1.5 px-5 py-1.5 rounded-md text-xs font-medium w-full justify-center transition-all ${
                isActive('/editor')
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Pencil size={14} /> Edit PDF
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default MainNav;