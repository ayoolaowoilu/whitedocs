"use client";

import { useState } from "react";
import {
  Image as ImageIcon,
  Type as TypeIcon,
  Square,
  Circle,
  PenTool,
  Plus,
  Trash2,
  Copy,
  BringToFront,
  SendToBack,
  Download,
  Menu,
  UploadCloud,
  FileEdit,
} from "lucide-react";
import MainNav from "./main_navbar";

export interface PdfEditorNavbarProps {
  onImportPdf: () => void;
  onAddImage: () => void;
  onAddText: () => void;
  onAddRect: () => void;
  onAddEllipse: () => void;
  onAddSignature: () => void;

  hasSelection: boolean;
  onDuplicate: () => void;
  onBringToFront: () => void;
  onSendToBack: () => void;
  onDelete: () => void;

  isTextSelected: boolean;
  textColor?: string;
  onTextColorChange: (color: string) => void;

  onExport: () => void;
  exportDisabled: boolean;
  pageLabel: string;
}

// Small "+" indicator so people know these buttons insert a new element,
// rather than act on whatever is currently selected.
function AddBadgeIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <span className="relative inline-flex">
      {icon}
      <Plus
        size={8}
        strokeWidth={3}
        className="absolute -right-1.5 -top-1.5 rounded-full bg-red-600 p-[1px] text-white"
      />
    </span>
  );
}

export default function PdfEditorNavbar({
  onImportPdf,
  onAddImage,
  onAddText,
  onAddRect,
  onAddEllipse,
  onAddSignature,
  hasSelection,
  onDuplicate,
  onBringToFront,
  onSendToBack,
  onDelete,
  isTextSelected,
  textColor = "#1a1a1a",
  onTextColorChange,
  onExport,
  exportDisabled,
  pageLabel,
}: PdfEditorNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed inset-x-0 top-11 z-40 border-b border-gray-200 bg-white shadow-sm">
      <MainNav />
      <div className="flex h-11 items-center justify-between gap-2 px-2 sm:px-3">
        <div className="flex items-center gap-0.5 overflow-x-auto sm:gap-1">
          <div className="mr-1 flex shrink-0 items-center gap-1.5 sm:mr-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-red-600 text-white">
              <FileEdit size={13} />
            </span>
            <span className="hidden text-xs font-semibold text-gray-800 sm:inline">PDF Editor</span>
          </div>

          <button
            onClick={onImportPdf}
            title="Import a PDF"
            className="flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
          >
            <AddBadgeIcon icon={<UploadCloud size={14} />} />
            <span className="hidden sm:inline">Import</span>
          </button>

          <div className="mx-1 hidden h-5 w-px bg-gray-200 sm:block" />

          <button
            onClick={onAddText}
            title="Add text"
            className="flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
          >
            <AddBadgeIcon icon={<TypeIcon size={14} />} />
            <span className="hidden sm:inline">Text</span>
          </button>
          <button
            onClick={onAddImage}
            title="Add image"
            className="flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
          >
            <AddBadgeIcon icon={<ImageIcon size={14} />} />
            <span className="hidden sm:inline">Image</span>
          </button>
          <button
            onClick={onAddRect}
            title="Add rectangle"
            className="flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
          >
            <AddBadgeIcon icon={<Square size={14} />} />
          </button>
          <button
            onClick={onAddEllipse}
            title="Add ellipse"
            className="flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
          >
            <AddBadgeIcon icon={<Circle size={14} />} />
          </button>
          <button
            onClick={onAddSignature}
            title="Add signature"
            className="flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
          >
            <AddBadgeIcon icon={<PenTool size={14} />} />
            <span className="hidden sm:inline">Sign</span>
          </button>

          <div className="mx-1 hidden h-5 w-px bg-gray-200 sm:block" />

          <div className="hidden items-center gap-0.5 sm:flex">
            <button onClick={onDuplicate} disabled={!hasSelection} className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40">
              <Copy size={14} />
              Duplicate
            </button>
            <button onClick={onBringToFront} disabled={!hasSelection} className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40">
              <BringToFront size={14} />
            </button>
            <button onClick={onSendToBack} disabled={!hasSelection} className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40">
              <SendToBack size={14} />
            </button>
            <div className="mx-1 h-5 w-px bg-gray-200" />
            <button onClick={onDelete} disabled={!hasSelection} className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40">
              <Trash2 size={14} />
              Delete
            </button>
          </div>

          <button onClick={() => setMobileMenuOpen((v) => !v)} className="flex shrink-0 items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 sm:hidden">
            <Menu size={14} />
          </button>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <span className="hidden text-[11px] font-medium text-gray-400 sm:inline">{pageLabel}</span>

          {isTextSelected && (
            <div className="hidden items-center gap-1.5 rounded-md border border-gray-200 px-1.5 py-1 sm:flex">
              <span className="text-[11px] font-medium text-gray-500">Color</span>
              <input type="color" value={textColor} onChange={(e) => onTextColorChange(e.target.value)} className="h-6 w-6 cursor-pointer rounded border border-gray-200 p-0.5" title="Text color" />
            </div>
          )}

          <button onClick={onExport} disabled={exportDisabled} className="flex items-center gap-1.5 rounded-md bg-red-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40">
            <Download size={14} />
            <span className="hidden sm:inline">Export PDF</span>
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="flex flex-wrap items-center gap-1 border-t border-gray-100 px-2 py-1.5 sm:hidden">
          <button onClick={onDuplicate} disabled={!hasSelection} className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40">
            <Copy size={14} />
            Duplicate
          </button>
          <button onClick={onBringToFront} disabled={!hasSelection} className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40">
            <BringToFront size={14} />
            Front
          </button>
          <button onClick={onSendToBack} disabled={!hasSelection} className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40">
            <SendToBack size={14} />
            Back
          </button>
          <button onClick={onDelete} disabled={!hasSelection} className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40">
            <Trash2 size={14} />
            Delete
          </button>
          {isTextSelected && (
            <div className="flex items-center gap-1.5 rounded-md border border-gray-200 px-1.5 py-1">
              <span className="text-[11px] font-medium text-gray-500">Color</span>
              <input type="color" value={textColor} onChange={(e) => onTextColorChange(e.target.value)} className="h-6 w-6 cursor-pointer rounded border border-gray-200 p-0.5" />
            </div>
          )}
          <span className="ml-auto text-[11px] font-medium text-gray-400">{pageLabel}</span>
        </div>
      )}
    </nav>
  );
}