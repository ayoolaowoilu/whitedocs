"use client"
import dynamic from "next/dynamic";

const NewEditor = dynamic(() => import("./NewComponent"), { ssr: false });

export default function NewEditorPage() {
  return <NewEditor />;
}