"use client";

import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Image, Text, Rect, Transformer } from "react-konva";
import useImage from "use-image";
import jsPDF from "jspdf";
import { motion } from "framer-motion";

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
const NAV_HEIGHT = 88;

const FONT_FAMILIES = ["Arial", "Georgia", "Times New Roman", "Courier New", "Verdana"];

type Selection = { page: number; id: string } | null;



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



function StaticExportImage({ item, imageCache }: { item: any; imageCache: Map<string, HTMLImageElement> }) {
  const img = imageCache.get(item.src);
  if (!img) return null;
  return (
    <Image
      image={img}
      x={item.x}
      y={item.y}
      width={item.width}
      height={item.height}
      rotation={item.rotation}
    />
  );
}

function ExportStage({
  page,
  imageCache,
  stageRef,
}: {
  page: any | null;
  imageCache: Map<string, HTMLImageElement>;
  stageRef: React.RefObject<any>;
}) {
  return (
    <div style={{ position: "fixed", top: 0, left: -99999, pointerEvents: "none" }}>
      <Stage ref={stageRef} width={PAGE_WIDTH} height={PAGE_HEIGHT}>
        <Layer>
          <Rect x={0} y={0} width={PAGE_WIDTH} height={PAGE_HEIGHT} fill="#ffffff" />
          {page?.objects.map((object: any) => {
            if (object.type === "Image") {
              return <StaticExportImage key={object.id} item={object} imageCache={imageCache} />;
            }
            if (object.type === "Text") {
              return (
                <Text
                  key={object.id}
                  text={object.text}
                  x={object.x}
                  y={object.y}
                  width={object.width}
                  fontSize={object.fontSize}
                  fontFamily={object.fontFamily}
                  fontStyle={
                    [object.bold ? "bold" : "", object.italic ? "italic" : ""].join(" ").trim() ||
                    "normal"
                  }
                  textDecoration={object.underline ? "underline" : ""}
                  align={object.align}
                  fill={object.fill}
                  rotation={object.rotation}
                />
              );
            }
            return null;
          })}
        </Layer>
      </Stage>
    </div>
  );
}

function preloadImage(src: string, cache: Map<string, HTMLImageElement>) {
  return new Promise<void>((resolve) => {
    if (cache.has(src)) return resolve();
    const img = new window.Image();
    img.onload = () => {
      cache.set(src, img);
      resolve();
    };
    img.onerror = () => resolve();
    img.src = src;
  });
}


function PageBlock({
  page,
  pageIndex,
  scale,
  selected,
  editingId,
  onFocusPage,
  onSelectObject,
  onDeselect,
  onUpdateObject,
  onStartEditing,
  onCommitEditing,
  onDeletePage,
  canDelete,
}: {
  page: any;
  pageIndex: number;
  scale: number;
  selected: Selection;
  editingId: Selection;
  onFocusPage: (i: number) => void;
  onSelectObject: (i: number, id: string) => void;
  onDeselect: () => void;
  onUpdateObject: (i: number, item: any) => void;
  onStartEditing: (i: number, id: string) => void;
  onCommitEditing: (i: number, value: string) => void;
  onDeletePage: (i: number) => void;
  canDelete: boolean;
}) {
  const stageRef = useRef<any>(null);
  const nodeRefs = useRef<Record<string, any>>({});
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [popupRect, setPopupRect] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

  const selId = selected?.page === pageIndex ? selected.id : null;
  const editId = editingId?.page === pageIndex ? editingId.id : null;

  const selectedObject = page.objects.find((o: any) => o.id === selId) || null;
  const editingObject = page.objects.find((o: any) => o.id === editId) || null;

  const recomputeRect = (id: string) => {
    const node = nodeRefs.current[id];
    const stage = stageRef.current;
    if (!node || !stage) return;
    setPopupRect(node.getClientRect({ relativeTo: stage }));
  };

  useEffect(() => {
    if (selId && selectedObject?.type === "Text") {
      recomputeRect(selId);
    } else {
      setPopupRect(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selId, page.objects]);

  useEffect(() => {
    if (editId && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [editId]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="group relative"
      style={{ width: PAGE_WIDTH * scale, height: PAGE_HEIGHT * scale }}
    >
      {/* page number + delete, shown on hover */}
      <div className="pointer-events-none absolute -top-6 left-0 flex w-full items-center justify-between">
        <span className="text-[11px] font-medium text-gray-500">Page {pageIndex + 1}</span>
        {canDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeletePage(pageIndex);
            }}
            className="pointer-events-auto flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium text-gray-400 opacity-0 hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
          >
            <X size={12} /> Remove page
          </button>
        )}
      </div>

      <div
        className="relative origin-top-left"
        style={{ width: PAGE_WIDTH, height: PAGE_HEIGHT, transform: `scale(${scale})` }}
      >
        <Stage
          ref={stageRef}
          width={PAGE_WIDTH}
          height={PAGE_HEIGHT}
          style={{ background: "white", boxShadow: "0 0 20px rgba(0,0,0,.2)" }}
          onMouseDown={(e) => {
            onFocusPage(pageIndex);
            if (e.target === e.target.getStage()) {
              onDeselect();
              if (editId) onCommitEditing(pageIndex, editingObject?.text ?? "");
            }
          }}
        >
          <Layer>
            {page.objects.map((object: any) => {
              if (object.type === "Image") {
                return (
                  <EditableImage
                    key={object.id}
                    item={object}
                    selected={selId === object.id}
                    onSelect={() => {
                      onFocusPage(pageIndex);
                      onSelectObject(pageIndex, object.id);
                    }}
                    onChange={(item) => onUpdateObject(pageIndex, item)}
                  />
                );
              }
              if (object.type === "Text") {
                return (
                  <EditableText
                    key={object.id}
                    item={object}
                    selected={selId === object.id}
                    isEditing={editId === object.id}
                    onSelect={() => {
                      onFocusPage(pageIndex);
                      onSelectObject(pageIndex, object.id);
                    }}
                    onDblClick={() => {
                      recomputeRect(object.id);
                      onStartEditing(pageIndex, object.id);
                    }}
                    onChange={(item) => onUpdateObject(pageIndex, item)}
                    registerNode={(node) => (nodeRefs.current[object.id] = node)}
                  />
                );
              }
              return null;
            })}
          </Layer>
        </Stage>

        {editingObject && popupRect && (
          <textarea
            ref={textareaRef}
            defaultValue={editingObject.text}
            onBlur={(e) => onCommitEditing(pageIndex, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") onCommitEditing(pageIndex, editingObject.text);
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onCommitEditing(pageIndex, (e.target as HTMLTextAreaElement).value);
              }
            }}
            className="absolute z-20 resize-none overflow-hidden border-2 border-blue-400 bg-white/90 outline-none"
            style={{
              top: popupRect.y,
              left: popupRect.x,
              width: Math.max(popupRect.width, 40),
              minHeight: popupRect.height,
              fontSize: editingObject.fontSize,
              fontFamily: editingObject.fontFamily,
              fontWeight: editingObject.bold ? "bold" : "normal",
              fontStyle: editingObject.italic ? "italic" : "normal",
              textDecoration: editingObject.underline ? "underline" : "none",
              textAlign: editingObject.align,
              color: editingObject.fill,
              lineHeight: 1.2,
              padding: 0,
            }}
          />
        )}

        {selectedObject?.type === "Text" && !editingObject && popupRect && (
          <TextFormatPopup
            rect={popupRect}
            scale={1}
            item={selectedObject}
            onChange={(patch) => onUpdateObject(pageIndex, { ...selectedObject, ...patch })}
          />
        )}
      </div>
    </motion.div>
  );
}


export default function Home() {
  const [pages, setPages] = useState<any[]>([{ id: crypto.randomUUID(), objects: [] }]);
  const [activePage, setActivePage] = useState(0);

  const [selected, setSelected] = useState<Selection>(null);
  const [editingId, setEditingId] = useState<Selection>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pageRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [showExportModal, setShowExportModal] = useState(false);
  const [exportName, setExportName] = useState("document");
  const [exporting, setExporting] = useState(false);

  const [exportPage, setExportPage] = useState<any | null>(null);
  const exportStageRef = useRef<any>(null);
  const imageCache = useRef<Map<string, HTMLImageElement>>(new Map());

  const [scale, setScale] = useState(1);
  useEffect(() => {
    const compute = () => {
      const available = window.innerWidth - 24;
      setScale(Math.min(1, available / PAGE_WIDTH));
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

 
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let best: any = null;
        entries.forEach((entry) => {
          const index = Number((entry.target as HTMLElement).dataset.pageIndex);
          if (entry.isIntersecting && (!best || entry.intersectionRatio > best.ratio)) {
            best = { ratio: entry.intersectionRatio, index };
          }
        });
        if (best) setActivePage(best.index);
      },
      { threshold: [0.25, 0.5, 0.75] }
    );

    Object.values(pageRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [pages.length]);

  const selectedObject =
    selected != null ? pages[selected.page]?.objects.find((o: any) => o.id === selected.id) : null;



  const updateObjectOnPage = (pageIndex: number, item: any) => {
    setPages((prev: any) =>
      prev.map((p: any, i: number) =>
        i === pageIndex ? { ...p, objects: p.objects.map((o: any) => (o.id === item.id ? item : o)) } : p
      )
    );
  };

  const patchSelected = (patch: any) => {
    if (!selected || !selectedObject) return;
    updateObjectOnPage(selected.page, { ...selectedObject, ...patch });
  };

  const uploadImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const id = crypto.randomUUID();
      setPages((prev: any) =>
        prev.map((p: any, i: number) =>
          i === activePage
            ? {
                ...p,
                objects: [
                  ...p.objects,
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
                ],
              }
            : p
        )
      );
      setSelected({ page: activePage, id });
    };
    reader.readAsDataURL(file);
  };

  const addText = () => {
    const id = crypto.randomUUID();
    setPages((prev: any) =>
      prev.map((p: any, i: number) =>
        i === activePage
          ? {
              ...p,
              objects: [
                ...p.objects,
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
              ],
            }
          : p
      )
    );
    setSelected({ page: activePage, id });
    setTimeout(() => setEditingId({ page: activePage, id }), 0);
  };

  const deleteSelected = () => {
    if (!selected) return;
    const { page, id } = selected;
    setPages((prev: any) =>
      prev.map((p: any, i: number) => (i === page ? { ...p, objects: p.objects.filter((o: any) => o.id !== id) } : p))
    );
    setSelected(null);
    setEditingId(null);
  };

  const duplicateSelected = () => {
    if (!selected || !selectedObject) return;
    const id = crypto.randomUUID();
    const { page } = selected;
    setPages((prev: any) =>
      prev.map((p: any, i: number) =>
        i === page
          ? { ...p, objects: [...p.objects, { ...selectedObject, id, x: selectedObject.x + 24, y: selectedObject.y + 24 }] }
          : p
      )
    );
    setSelected({ page, id });
  };

  const reorderSelected = (dir: "front" | "back") => {
    if (!selected) return;
    const { page, id } = selected;
    setPages((prev: any) =>
      prev.map((p: any, i: number) => {
        if (i !== page) return p;
        const idx = p.objects.findIndex((o: any) => o.id === id);
        if (idx === -1) return p;
        const arr = [...p.objects];
        const [item] = arr.splice(idx, 1);
        if (dir === "front") arr.push(item);
        else arr.unshift(item);
        return { ...p, objects: arr };
      })
    );
  };

 

  const addPage = () => {
    const newPage = { id: crypto.randomUUID(), objects: [] };
    setPages((prev: any) => [...prev, newPage]);
    setTimeout(() => {
      pageRefs.current[newPage.id]?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const deletePage = (index: number) => {
    setPages((prev: any) => {
      if (prev.length <= 1) return prev;
      return prev.filter((_: any, i: number) => i !== index);
    });
    setSelected(null);
    setEditingId(null);
  };


  const commitEditing = (pageIndex: number, value: string) => {
    if (editingId && editingId.page === pageIndex) {
      const obj = pages[pageIndex]?.objects.find((o: any) => o.id === editingId.id);
      if (obj) updateObjectOnPage(pageIndex, { ...obj, text: value || "" });
    }
    setEditingId(null);
  };

 

  const openExportModal = () => {
    setSelected(null);
    setEditingId(null);
    setExportName("document");
    setShowExportModal(true);
  };

  const nextFrame = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

  const confirmExport = async () => {
    setExporting(true);

    const allSrcs = new Set<string>();
    pages.forEach((p: any) =>
      p.objects.forEach((o: any) => {
        if (o.type === "Image") allSrcs.add(o.src);
      })
    );
    await Promise.all(Array.from(allSrcs).map((src) => preloadImage(src, imageCache.current)));

    const pdf = new jsPDF({ unit: "px", format: [PAGE_WIDTH, PAGE_HEIGHT] });

    for (let i = 0; i < pages.length; i++) {
      setExportPage(pages[i]);
      await nextFrame();

      const dataUrl = exportStageRef.current.toDataURL({ pixelRatio: 2, mimeType: "image/png" });
      if (i > 0) pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      pdf.addImage(dataUrl, "PNG", 0, 0, PAGE_WIDTH, PAGE_HEIGHT);
    }

    setExportPage(null);

    const safeName = exportName.trim().replace(/\.pdf$/i, "") || "document";
    pdf.save(`${safeName}.pdf`);

    setExporting(false);
    setShowExportModal(false);
  };

  return (
    <main className="min-h-screen bg-gray-300 text-black">
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
        onAddImage={() => fileInputRef.current?.click()}
        onAddText={addText}
        onAddPage={addPage}
        hasSelection={!!selected}
        onDuplicate={duplicateSelected}
        onBringToFront={() => reorderSelected("front")}
        onSendToBack={() => reorderSelected("back")}
        onDelete={deleteSelected}
        isTextSelected={selectedObject?.type === "Text"}
        textColor={selectedObject?.type === "Text" ? selectedObject.fill : undefined}
        onTextColorChange={(color: any) => patchSelected({ fill: color })}
        onExport={openExportModal}
        pageLabel={`Page ${activePage + 1} / ${pages.length}`}
      />

    
      <div
        ref={scrollContainerRef}
        className="scroll-smooth flex flex-col items-center gap-10 overflow-y-auto px-3 pb-16"
        style={{ paddingTop: NAV_HEIGHT + 24, height: "100vh" }}
      >
        {pages.map((page, index) => (
          <div
            key={page.id}
            data-page-index={index}
            ref={(el) => {
              pageRefs.current[page.id] = el;
            }}
          >
            <PageBlock
              page={page}
              pageIndex={index}
              scale={scale}
              selected={selected}
              editingId={editingId}
              onFocusPage={setActivePage}
              onSelectObject={(i, id) => setSelected({ page: i, id })}
              onDeselect={() => setSelected(null)}
              onUpdateObject={updateObjectOnPage}
              onStartEditing={(i, id) => setEditingId({ page: i, id })}
              onCommitEditing={commitEditing}
              onDeletePage={deletePage}
              canDelete={pages.length > 1}
            />
          </div>
        ))}

        {/* Add page at the end of the scroll, like turning to a new sheet */}
        <button
          onClick={addPage}
          style={{ width: PAGE_WIDTH * scale, height: 96 * scale }}
          className="flex items-center justify-center rounded-md border-2 border-dashed border-gray-400/60 text-gray-500 transition-colors hover:border-red-400 hover:text-red-500"
        >
          <Plus size={20} className="mr-2" /> Add page
        </button>
      </div>

      {/* Hidden export-only stage */}
      <ExportStage page={exportPage} imageCache={imageCache.current} stageRef={exportStageRef} />

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