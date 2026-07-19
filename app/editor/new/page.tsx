


"use client";

import { useRef, useState } from "react";
import { Stage, Layer, Image, Transformer } from "react-konva";
import useImage from "use-image";

const PAGE_WIDTH = 794;
const PAGE_HEIGHT = 1123;



function EditableImage({
  item,
  selected,
  onSelect,
  onChange,
}: {
  item: any;
  selected: boolean;
  onSelect: () => void;
  onChange: (item:any) => void;
}) {
  const [image] = useImage(item.src);
  const shapeRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  if (selected && trRef.current && shapeRef.current) {
    trRef.current.nodes([shapeRef.current]);
    trRef.current.getLayer()?.batchDraw();
  }

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

      {selected && (
        <Transformer
          ref={trRef}
          rotateEnabled
          keepRatio={false}
        />
      )}
    </>
  );
}

function EditableTexts(){
     
}

export default function Home() {
  const [objects, setObjects] = useState<any>([]);
  const [selected, setSelected] = useState<string | null>(null);

  const uploadImage = (file: File) => {
    const reader = new FileReader();

    reader.onload = () => {
      setObjects((prev:any) => [
        ...prev,
        {
          type:"Image",
          id: crypto.randomUUID(),
          src: reader.result as string,
          x: 100,
          y: 100,
          width: 200,
          height: 200,
          rotation: 0,
        },
      ]);
    };

    reader.readAsDataURL(file);
  };

  const updateObject = (image: any) => {
    setObjects((prev:any) =>
      prev.map((img:any) => (img.id === image.id ? image : img))
    );
  };

  const deleteSelected = () => {
    if (!selected) return;

    setObjects((prev:any) => prev.filter((i:any) => i.id !== selected));
    setSelected(null);
  };

  return (
    <main className="min-h-screen bg-gray-300 p-6">

      <div className="flex gap-4 mb-5">

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              uploadImage(e.target.files[0]);
            }
          }}
        />

        <button
          onClick={deleteSelected}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Delete
        </button>

      </div>

      <div className="flex justify-center">

        <Stage
          width={PAGE_WIDTH}
          height={PAGE_HEIGHT}
          style={{
            background: "white",
            boxShadow: "0 0 20px rgba(0,0,0,.2)",
          }}
          onMouseDown={(e) => {
            if (e.target === e.target.getStage()) {
              setSelected(null);
            }
          }}
        >
          <Layer>

            {objects.map((object:any,index:number) => {
                 
                 if(object.type === "Image"){
                       return    <EditableImage
                key={object.id}
                item={object}
                selected={selected === object.id}
                onSelect={() => setSelected(object.id)}
                onChange={updateObject}
              />
                 }else if(object.type === "Text"){
                   
                 }
            })}

          </Layer>
        </Stage>

      </div>
    </main>
  );
}