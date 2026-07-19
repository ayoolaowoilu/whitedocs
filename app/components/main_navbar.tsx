"use client";

import React, { useState } from 'react';
import { FileText, Plus, Pencil, Menu, X } from 'lucide-react';

const MainNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-11">
          {/* Logo */}
          <div className="flex items-center gap-1.5">
            <FileText className="text-red-600 w-5 h-5" />
            <span className="text-sm font-bold text-red-600">WhiteDocs</span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-2">
            <button className="flex items-center gap-1.5 bg-red-600 text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-red-700">
              <Plus size={14} /> New PDF
            </button>
            <button className="flex items-center gap-1.5 bg-red-600 text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-red-700">
              <Pencil size={14} /> Edit PDF
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-red-600">
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white/90 backdrop-blur-md border-t border-gray-200">
          <div className="flex flex-col items-center py-3 space-y-2">
            <button className="flex items-center gap-1.5 bg-red-600 text-white px-5 py-1.5 rounded-md text-xs font-medium w-40 justify-center">
              <Plus size={14} /> New PDF
            </button>
            <button className="flex items-center gap-1.5 bg-red-600 text-white px-5 py-1.5 rounded-md text-xs font-medium w-40 justify-center">
              <Pencil size={14} /> Edit PDF
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default MainNav;