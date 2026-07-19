"use client";

import { useState } from "react";
import {
  Image as ImageIcon,
  Type as TypeIcon,
  Trash2,
  Copy,
  BringToFront,
  SendToBack,
  Download,
  X,
  Plus,
  FilePlus2,
  Menu,
  PenSquare,
} from "lucide-react";

export interface NavbarPage {
  id: string;
}

export interface NavbarProps {
  pages: NavbarPage[];
  activePage: number;
  onSelectPage: (index: number) => void;
  onAddPage: () => void;
  onDeletePage: (index: number) => void;

  onAddImage: () => void;
  onAddText: () => void;

  hasSelection: boolean;
  onDuplicate: () => void;
  onBringToFront: () => void;
  onSendToBack: () => void;
  onDelete: () => void;

  isTextSelected: boolean;
  textColor?: string;
  onTextColorChange: (color: string) => void;

  onExport: () => void;
}

/**
 * WPS-style app navbar: brand/logo, primary actions, secondary actions
 * (collapsed into a menu on mobile), a contextual text-color control, an
 * export button, and a horizontally scrollable page-tab strip.
 *
 * Fully self-contained — drop it at the top of the page and wire up the
 * callbacks / state it needs via props.
 */
export default function Navbar({
  pages,
  activePage,
  onSelectPage,
  onAddPage,
  onDeletePage,
  onAddImage,
  onAddText,
  hasSelection,
  onDuplicate,
  onBringToFront,
  onSendToBack,
  onDelete,
  isTextSelected,
  textColor = "#1a1a1a",
  onTextColorChange,
  onExport,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed inset-x-0 top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
      <div className="flex h-14 items-center justify-between gap-2 px-3 sm:px-4">
        <div className="flex items-center gap-1 overflow-x-auto sm:gap-2">
          {/* Logo */}
          <div className="mr-1 flex shrink-0 items-center gap-2 sm:mr-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-white">
              <PenSquare size={16} />
            </span>
            <span className="hidden text-sm font-semibold text-gray-800 sm:inline">Editor</span>
          </div>

          <button
            onClick={onAddImage}
            className="flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 sm:px-3"
          >
            <ImageIcon size={16} />
            <span className="hidden sm:inline">Image</span>
          </button>

          <button
            onClick={onAddText}
            className="flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 sm:px-3"
          >
            <TypeIcon size={16} />
            <span className="hidden sm:inline">Text</span>
          </button>

          <button
            onClick={onAddPage}
            className="flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 sm:px-3"
          >
            <FilePlus2 size={16} />
            <span className="hidden sm:inline">Add Page</span>
          </button>

          <div className="mx-1 hidden h-6 w-px bg-gray-200 sm:block" />

          <div className="hidden items-center gap-1 sm:flex">
            <button
              onClick={onDuplicate}
              disabled={!hasSelection}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Copy size={16} />
              Duplicate
            </button>
            <button
              onClick={onBringToFront}
              disabled={!hasSelection}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <BringToFront size={16} />
            </button>
            <button
              onClick={onSendToBack}
              disabled={!hasSelection}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <SendToBack size={16} />
            </button>
            <div className="mx-1 h-6 w-px bg-gray-200" />
            <button
              onClick={onDelete}
              disabled={!hasSelection}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 sm:hidden"
          >
            <Menu size={16} />
          </button>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {isTextSelected && (
            <div className="hidden items-center gap-2 rounded-lg border border-gray-200 px-2 py-1.5 sm:flex">
              <span className="text-xs font-medium text-gray-500">Text color</span>
              <input
                type="color"
                value={textColor}
                onChange={(e) => onTextColorChange(e.target.value)}
                className="h-7 w-7 cursor-pointer rounded border border-gray-200 p-0.5"
                title="Text color"
              />
            </div>
          )}

          <button
            onClick={onExport}
            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-2.5 py-2 text-sm font-medium text-white hover:bg-red-700 sm:px-3"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Export PDF</span>
          </button>
        </div>
      </div>

      {/* Mobile dropdown: duplicate / reorder / delete / text color */}
      {mobileMenuOpen && (
        <div className="flex flex-wrap items-center gap-1 border-t border-gray-100 px-3 py-2 sm:hidden">
          <button
            onClick={onDuplicate}
            disabled={!hasSelection}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Copy size={16} />
            Duplicate
          </button>
          <button
            onClick={onBringToFront}
            disabled={!hasSelection}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <BringToFront size={16} />
            Front
          </button>
          <button
            onClick={onSendToBack}
            disabled={!hasSelection}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <SendToBack size={16} />
            Back
          </button>
          <button
            onClick={onDelete}
            disabled={!hasSelection}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Trash2 size={16} />
            Delete
          </button>
          {isTextSelected && (
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-2 py-1.5">
              <span className="text-xs font-medium text-gray-500">Color</span>
              <input
                type="color"
                value={textColor}
                onChange={(e) => onTextColorChange(e.target.value)}
                className="h-7 w-7 cursor-pointer rounded border border-gray-200 p-0.5"
              />
            </div>
          )}
        </div>
      )}

      {/* Page tabs */}
      <div className="flex items-center gap-1 overflow-x-auto border-t border-gray-100 px-3 py-1.5">
        {pages.map((page, index) => (
          <button
            key={page.id}
            onClick={() => onSelectPage(index)}
            className={`group flex shrink-0 items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium ${
              index === activePage ? "bg-red-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Page {index + 1}
            {pages.length > 1 && (
              <span
                role="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeletePage(index);
                }}
                className={`ml-1 rounded-full p-0.5 ${
                  index === activePage ? "hover:bg-red-700" : "hover:bg-gray-300"
                }`}
              >
                <X size={11} />
              </span>
            )}
          </button>
        ))}
        <button
          onClick={onAddPage}
          className="flex shrink-0 items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-100"
          title="Add page"
        >
          <Plus size={13} />
        </button>
      </div>
    </nav>
  );
}