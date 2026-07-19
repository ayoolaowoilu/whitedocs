"use client";

import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Image, Text, Transformer } from "react-konva";
import useImage from "use-image";
import jsPDF from "jspdf";

import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Minus,
  Plus,
  Download,
  X,
} from "lucide-react";
import Navbar from "@/app/components/EditorNavbar";

const PAGE_WIDTH = 794;
const PAGE_HEIGHT = 1123;

const FONT_FAMILIES = ["Arial", "Georgia", "Times New Roman", "Courier New", "Verdana"];

/* ----------------------------- Editable Image ---------------------------- */

function EditableImage({
  item,
  selected,
  onSelect,
  onChange,
}: {
  item: any;
  selected: boolean;
  onSelect: () => void;
  onChange: (item: any) => void;
}) {
  const [image] = useImage(item.src);
  const shapeRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  useEffect(() => {
    if (selected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [selected]);

  return (
    <>
      <Image
        ref={shapeRef}
        image={image}
        x={item.x}
        y={item.y}
        width={item.width}
        height={item.height}
        rotation={item.rotation}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) =>
          onChange({
            ...item,
            x: e.target.x(),
            y: e.target.y(),
          })
        }
        onTransformEnd={() => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          node.scaleX(1);
          node.scaleY(1);

          onChange({
            ...item,
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            width: Math.max(20, node.width() * scaleX),
            height: Math.max(20, node.height() * scaleY),
          });
        }}
      />

      {selected && <Transformer ref={trRef} rotateEnabled keepRatio={false} />}
    </>
  );
}

/* ------------------------------ Editable Text ----------------------------- */

function EditableText({
  item,
  selected,
  isEditing,
  onSelect,
  onDblClick,
  onChange,
  registerNode,
}: {
  item: any;
  selected: boolean;
  isEditing: boolean;
  onSelect: () => void;
  onDblClick: () => void;
  onChange: (item: any) => void;
  registerNode: (node: any) => void;
}) {
  const shapeRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  useEffect(() => {
    if (selected && trRef.current && shapeRef.current && !isEditing) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [selected, isEditing]);

  useEffect(() => {
    if (shapeRef.current) registerNode(shapeRef.current);
  }, [item]);

  return (
    <>
      <Text
        ref={shapeRef}
        text={item.text}
        x={item.x}
        y={item.y}
        width={item.width}
        fontSize={item.fontSize}
        fontFamily={item.fontFamily}
        fontStyle={
          [item.bold ? "bold" : "", item.italic ? "italic" : ""].join(" ").trim() || "normal"
        }
        textDecoration={item.underline ? "underline" : ""}
        align={item.align}
        fill={item.fill}
        rotation={item.rotation}
        visible={!isEditing}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDblClick={onDblClick}
        onDblTap={onDblClick}
        onDragEnd={(e) =>
          onChange({
            ...item,
            x: e.target.x(),
            y: e.target.y(),
          })
        }
        onTransformEnd={() => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          node.scaleX(1);
          node.scaleY(1);

          onChange({
            ...item,
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            width: Math.max(30, node.width() * scaleX),
            fontSize: Math.max(6, Math.round(item.fontSize * scaleY)),
          });
        }}
      />

      {selected && !isEditing && (
        <Transformer ref={trRef} rotateEnabled enabledAnchors={["middle-left", "middle-right"]} />
      )}
    </>
  );
}

/* --------------------------- Floating Text Popup --------------------------- */
/* Appears directly under the selected/edited text node, WPS-style formatting bar */

function TextFormatPopup({
  rect,
  scale,
  item,
  onChange,
}: {
  rect: { x: number; y: number; width: number; height: number };
  scale: number;
  item: any;
  onChange: (patch: any) => void;
}) {
  return (
    <div
      className="absolute z-30 flex max-w-[92vw] flex-wrap items-center gap-1 rounded-lg border border-gray-200 bg-white px-2 py-1.5 shadow-lg"
      style={{
        top: (rect.y + rect.height) * scale + 8,
        left: rect.x * scale,
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <select
        value={item.fontFamily}
        onChange={(e) => onChange({ fontFamily: e.target.value })}
        className="h-8 rounded border border-gray-200 px-1 text-xs"
      >
        {FONT_FAMILIES.map((f) => (
          <option key={f} value={f}>
            {f}
          </option>
        ))}
      </select>

      <div className="flex items-center rounded border border-gray-200">
        <button
          className="flex h-8 w-7 items-center justify-center hover:bg-gray-100"
          onClick={() => onChange({ fontSize: Math.max(6, item.fontSize - 2) })}
        >
          <Minus size={13} />
        </button>
        <span className="w-7 text-center text-xs">{item.fontSize}</span>
        <button
          className="flex h-8 w-7 items-center justify-center hover:bg-gray-100"
          onClick={() => onChange({ fontSize: item.fontSize + 2 })}
        >
          <Plus size={13} />
        </button>
      </div>

      <div className="mx-1 h-5 w-px bg-gray-200" />

      <button
        className={`flex h-8 w-8 items-center justify-center rounded hover:bg-gray-100 ${item.bold ? "bg-gray-200" : ""}`}
        onClick={() => onChange({ bold: !item.bold })}
      >
        <Bold size={14} />
      </button>
      <button
        className={`flex h-8 w-8 items-center justify-center rounded hover:bg-gray-100 ${item.italic ? "bg-gray-200" : ""}`}
        onClick={() => onChange({ italic: !item.italic })}
      >
        <Italic size={14} />
      </button>
      <button
        className={`flex h-8 w-8 items-center justify-center rounded hover:bg-gray-100 ${item.underline ? "bg-gray-200" : ""}`}
        onClick={() => onChange({ underline: !item.underline })}
      >
        <Underline size={14} />
      </button>

      <div className="mx-1 h-5 w-px bg-gray-200" />

      <button
        className={`flex h-8 w-8 items-center justify-center rounded hover:bg-gray-100 ${item.align === "left" ? "bg-gray-200" : ""}`}
        onClick={() => onChange({ align: "left" })}
      >
        <AlignLeft size={14} />
      </button>
      <button
        className={`flex h-8 w-8 items-center justify-center rounded hover:bg-gray-100 ${item.align === "center" ? "bg-gray-200" : ""}`}
        onClick={() => onChange({ align: "center" })}
      >
        <AlignCenter size={14} />
      </button>
      <button
        className={`flex h-8 w-8 items-center justify-center rounded hover:bg-gray-100 ${item.align === "right" ? "bg-gray-200" : ""}`}
        onClick={() => onChange({ align: "right" })}
      >
        <AlignRight size={14} />
      </button>

      <div className="mx-1 h-5 w-px bg-gray-200" />

      <input
        type="color"
        value={item.fill}
        onChange={(e) => onChange({ fill: e.target.value })}
        className="h-8 w-8 cursor-pointer rounded border border-gray-200 p-0.5"
        title="Text color"
      />
    </div>
  );
}

/* ------------------------------ Export Modal ------------------------------ */

function ExportPdfModal({
  value,
  onChange,
  onCancel,
  onConfirm,
  busy,
}: {
  value: string;
  onChange: (v: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
  busy: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="w-full max-w-[20rem] rounded-xl bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-800">Export as PDF</h2>
          <button onClick={onCancel} className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <X size={16} />
          </button>
        </div>

        <label className="mb-1 block text-xs font-medium text-gray-500">File name</label>
        <div className="mb-4 flex items-center overflow-hidden rounded-lg border border-gray-300 focus-within:border-blue-400">
          <input
            autoFocus
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onConfirm();
              if (e.key === "Escape") onCancel();
            }}
            placeholder="document"
            className="w-full px-3 py-2 text-sm outline-none"
          />
          <span className="pr-3 text-sm text-gray-400">.pdf</span>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={busy}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            <Download size={14} />
            {busy ? "Exporting…" : "Export"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------- Home ---------------------------------- */

export default function Home() {
  // Each page holds its own objects; export walks every page into one PDF.
  const [pages, setPages] = useState<any[]>([{ id: crypto.randomUUID(), objects: [] }]);
  const [activePage, setActivePage] = useState(0);

  const [selected, setSelected] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const stageRef = useRef<any>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<string, any>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [popupRect, setPopupRect] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportName, setExportName] = useState("document");
  const [exporting, setExporting] = useState(false);

  // Responsive scale: shrink the page to fit narrow / mobile screens.
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const compute = () => {
      const available = window.innerWidth - 24; // small side margin
      setScale(Math.min(1, available / PAGE_WIDTH));
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  const objects = pages[activePage]?.objects ?? [];

  const setObjects = (updater: any) => {
    setPages((prev: any) =>
      prev.map((p: any, i: number) =>
        i === activePage ? { ...p, objects: typeof updater === "function" ? updater(p.objects) : updater } : p
      )
    );
  };

  const selectedObject = objects.find((o: any) => o.id === selected) || null;

  /* Recompute the on-screen rect (in un-scaled stage coordinates) for the
     selected/edited node — used to place the popup / textarea. */
  const recomputeRect = (id: string) => {
    const node = nodeRefs.current[id];
    const stage = stageRef.current;
    if (!node || !stage) return;
    const box = node.getClientRect({ relativeTo: stage });
    setPopupRect(box);
  };

  useEffect(() => {
    if (selected && objects.find((o: any) => o.id === selected)?.type === "Text") {
      recomputeRect(selected);
    } else {
      setPopupRect(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, objects]);

  useEffect(() => {
    if (editingId && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [editingId]);

  // Switching pages clears selection/edit state so nothing dangles across pages.
  useEffect(() => {
    setSelected(null);
    setEditingId(null);
  }, [activePage]);

  /* ------------------------------ CRUD helpers ------------------------------ */

  const uploadImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const id = crypto.randomUUID();
      setObjects((prev: any) => [
        ...prev,
        {
          type: "Image",
          id,
          src: reader.result as string,
          x: 100,
          y: 100,
          width: 200,
          height: 200,
          rotation: 0,
        },
      ]);
      setSelected(id);
    };
    reader.readAsDataURL(file);
  };

  const addText = () => {
    const id = crypto.randomUUID();
    setObjects((prev: any) => [
      ...prev,
      {
        type: "Text",
        id,
        text: "Double click to edit",
        x: 120,
        y: 120,
        width: 220,
        fontSize: 24,
        fontFamily: "Arial",
        fill: "#1a1a1a",
        align: "left",
        bold: false,
        italic: false,
        underline: false,
        rotation: 0,
      },
    ]);
    setSelected(id);
    setTimeout(() => setEditingId(id), 0);
  };

  const updateObject = (item: any) => {
    setObjects((prev: any) => prev.map((o: any) => (o.id === item.id ? item : o)));
  };

  const patchSelected = (patch: any) => {
    if (!selectedObject) return;
    updateObject({ ...selectedObject, ...patch });
  };

  const deleteSelected = () => {
    if (!selected) return;
    setObjects((prev: any) => prev.filter((o: any) => o.id !== selected));
    setSelected(null);
    setEditingId(null);
  };

  const duplicateSelected = () => {
    if (!selectedObject) return;
    const id = crypto.randomUUID();
    setObjects((prev: any) => [...prev, { ...selectedObject, id, x: selectedObject.x + 24, y: selectedObject.y + 24 }]);
    setSelected(id);
  };

  const reorderSelected = (dir: "front" | "back") => {
    if (!selected) return;
    setObjects((prev: any) => {
      const idx = prev.findIndex((o: any) => o.id === selected);
      if (idx === -1) return prev;
      const arr = [...prev];
      const [item] = arr.splice(idx, 1);
      if (dir === "front") arr.push(item);
      else arr.unshift(item);
      return arr;
    });
  };

  /* --------------------------------- Pages ---------------------------------- */

  const addPage = () => {
    setPages((prev: any) => [...prev, { id: crypto.randomUUID(), objects: [] }]);
    setActivePage(pages.length);
  };

  const deletePage = (index: number) => {
    if (pages.length <= 1) return;
    setPages((prev: any) => prev.filter((_: any, i: number) => i !== index));
    setActivePage((prevActive) => {
      if (index < prevActive) return prevActive - 1;
      if (index === prevActive) return Math.max(0, index - 1);
      return prevActive;
    });
  };

  /* ------------------------------- Text editing ------------------------------ */

  const startEditing = (id: string) => {
    recomputeRect(id);
    setEditingId(id);
  };

  const commitEditing = (value: string) => {
    if (editingId) {
      const obj = objects.find((o: any) => o.id === editingId);
      if (obj) updateObject({ ...obj, text: value || "" });
    }
    setEditingId(null);
  };

  const editingObject = editingId ? objects.find((o: any) => o.id === editingId) : null;

  /* --------------------------------- Export --------------------------------- */

  const openExportModal = () => {
    setSelected(null);
    setEditingId(null);
    setExportName("document");
    setShowExportModal(true);
  };

  const nextFrame = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

  const confirmExport = async () => {
    const stage = stageRef.current;
    if (!stage) return;
    setExporting(true);

    const originalPage = activePage;
    const pdf = new jsPDF({ unit: "px", format: [PAGE_WIDTH, PAGE_HEIGHT] });

    for (let i = 0; i < pages.length; i++) {
      if (i !== activePage) setActivePage(i);
      await nextFrame();

      const dataUrl = stage.toDataURL({ pixelRatio: 2, mimeType: "image/png" });
      if (i > 0) pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      pdf.addImage(dataUrl, "PNG", 0, 0, PAGE_WIDTH, PAGE_HEIGHT);
    }

    setActivePage(originalPage);
    await nextFrame();

    const safeName = exportName.trim().replace(/\.pdf$/i, "") || "document";
    pdf.save(`${safeName}.pdf`);

    setExporting(false);
    setShowExportModal(false);
  };

  return (
    <main className="min-h-screen bg-gray-300">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) uploadImage(e.target.files[0]);
          e.target.value = "";
        }}
      />

      <Navbar
        pages={pages}
        activePage={activePage}
        onSelectPage={setActivePage}
        onAddPage={addPage}
        onDeletePage={deletePage}
        onAddImage={() => fileInputRef.current?.click()}
        onAddText={addText}
        hasSelection={!!selected}
        onDuplicate={duplicateSelected}
        onBringToFront={() => reorderSelected("front")}
        onSendToBack={() => reorderSelected("back")}
        onDelete={deleteSelected}
        isTextSelected={selectedObject?.type === "Text"}
        textColor={selectedObject?.type === "Text" ? selectedObject.fill : undefined}
        onTextColorChange={(color:any) => patchSelected({ fill: color })}
        onExport={openExportModal}
      />

      <div className="flex justify-center overflow-x-hidden p-3 pt-32 sm:pt-28">
        <div style={{ width: PAGE_WIDTH * scale, height: PAGE_HEIGHT * scale }} className="relative">
          <div
            ref={wrapperRef}
            className="relative origin-top-left"
            style={{ width: PAGE_WIDTH, height: PAGE_HEIGHT, transform: `scale(${scale})` }}
          >
            <Stage
              ref={stageRef}
              width={PAGE_WIDTH}
              height={PAGE_HEIGHT}
              style={{
                background: "white",
                boxShadow: "0 0 20px rgba(0,0,0,.2)",
              }}
              onMouseDown={(e) => {
                if (e.target === e.target.getStage()) {
                  setSelected(null);
                  if (editingId) commitEditing(editingObject?.text ?? "");
                }
              }}
            >
              <Layer>
                {objects.map((object: any) => {
                  if (object.type === "Image") {
                    return (
                      <EditableImage
                        key={object.id}
                        item={object}
                        selected={selected === object.id}
                        onSelect={() => setSelected(object.id)}
                        onChange={updateObject}
                      />
                    );
                  }
                  if (object.type === "Text") {
                    return (
                      <EditableText
                        key={object.id}
                        item={object}
                        selected={selected === object.id}
                        isEditing={editingId === object.id}
                        onSelect={() => setSelected(object.id)}
                        onDblClick={() => startEditing(object.id)}
                        onChange={updateObject}
                        registerNode={(node) => (nodeRefs.current[object.id] = node)}
                      />
                    );
                  }
                  return null;
                })}
              </Layer>
            </Stage>
          </div>

          {/* Inline edit overlay: sits exactly over the Konva text node, scaled
              to match so it lines up on mobile too. */}
          {editingObject && popupRect && (
            <textarea
              ref={textareaRef}
              defaultValue={editingObject.text}
              onBlur={(e) => commitEditing(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") commitEditing(editingObject.text);
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  commitEditing((e.target as HTMLTextAreaElement).value);
                }
              }}
              className="absolute z-20 resize-none overflow-hidden border-2 border-blue-400 bg-white/90 outline-none"
              style={{
                top: popupRect.y * scale,
                left: popupRect.x * scale,
                width: Math.max(popupRect.width, 40) * scale,
                minHeight: popupRect.height * scale,
                fontSize: editingObject.fontSize * scale,
                fontFamily: editingObject.fontFamily,
                fontWeight: editingObject.bold ? "bold" : "normal",
                fontStyle: editingObject.italic ? "italic" : "normal",
                textDecoration: editingObject.underline ? "underline" : "none",
                textAlign: editingObject.align,
                color: editingObject.fill,
                lineHeight: 1.2,
                padding: 0,
                transformOrigin: "top left",
              }}
            />
          )}

          {/* Floating text-format popup: appears directly under the selected text */}
          {selectedObject?.type === "Text" && popupRect && (
            <TextFormatPopup rect={popupRect} scale={scale} item={selectedObject} onChange={patchSelected} />
          )}
        </div>
      </div>

      {showExportModal && (
        <ExportPdfModal
          value={exportName}
          onChange={setExportName}
          onCancel={() => !exporting && setShowExportModal(false)}
          onConfirm={confirmExport}
          busy={exporting}
        />
      )}
    </main>
  );
}