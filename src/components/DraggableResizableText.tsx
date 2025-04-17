import React, { useRef, useState } from "react";

interface DraggableResizableTextProps {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  color: string;
  textAlign: CanvasTextAlign;
  lineHeight: number;
  value: string;
  selected: boolean;
  onChange: (props: Partial<DraggableResizableTextProps>) => void;
  onSelect: () => void;
}

export default function DraggableResizableText({
  x, y, width, height, fontSize, fontFamily, fontWeight, color, textAlign, lineHeight, value, selected, onChange, onSelect
}: DraggableResizableTextProps) {
  const textRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState<null | "right" | "bottom" | "corner">(null);
  const [start, setStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [startBox, setStartBox] = useState<{ x: number; y: number; width: number; height: number }>({ x, y, width, height });

  // Drag
  const onMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDragging(true);
    setStart({ x: e.clientX, y: e.clientY });
    setStartBox({ x, y, width, height });
    onSelect();
  };
  // Resize
  const onResizeDown = (dir: "right" | "bottom" | "corner") => (e: React.MouseEvent) => {
    e.stopPropagation();
    setResizing(dir);
    setStart({ x: e.clientX, y: e.clientY });
    setStartBox({ x, y, width, height });
    onSelect();
  };

  React.useEffect(() => {
    if (!dragging && !resizing) return;
    const onMove = (e: MouseEvent) => {
      if (dragging) {
        const dx = e.clientX - start.x;
        const dy = e.clientY - start.y;
        const container = textRef.current?.parentElement;
        if (container) {
          const rect = container.getBoundingClientRect();
          const newX = ((startBox.x + dx) / rect.width) * 100;
          const newY = ((startBox.y + dy) / rect.height) * 100;
          onChange({ x: Math.max(0, Math.min(100, newX)), y: Math.max(0, Math.min(100, newY)) });
        }
      } else if (resizing) {
        const dx = e.clientX - start.x;
        const dy = e.clientY - start.y;
        let newWidth = startBox.width;
        let newHeight = startBox.height;
        if (resizing === "right" || resizing === "corner") newWidth = Math.max(30, startBox.width + dx);
        if (resizing === "bottom" || resizing === "corner") newHeight = Math.max(20, startBox.height + dy);
        onChange({ width: newWidth, height: newHeight });
      }
    };
    const onUp = () => {
      setDragging(false);
      setResizing(null);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragging, resizing, start, startBox, onChange]);

  // Inline style
  const style: React.CSSProperties = {
    position: "absolute",
    left: `${x}%`,
    top: `${y}%`,
    transform: 'translate(-50%, -50%)',
    width,
    height,
    fontSize,
    fontFamily,
    fontWeight,
    color,
    textAlign,
    lineHeight: `${lineHeight}px`,
    cursor: dragging ? "move" : "pointer",
    border: selected ? "1.5px solid #2a72e5" : "1px dashed #bbb",
    background: selected ? "rgba(42,114,229,0.05)" : "transparent",
    userSelect: "none",
    overflow: "hidden",
    padding: 2,
    boxSizing: "border-box"
  };

  return (
    <div
      ref={textRef}
      style={style}
      onMouseDown={onMouseDown}
      tabIndex={0}
      onClick={onSelect}
    >
      {value}
      {/* Resize handles */}
      {selected && (
        <>
          {/* Right */}
          <div style={{position:'absolute', right:-6, top:'50%', width:12, height:12, cursor:'ew-resize', background:'#fff', border:'1px solid #2a72e5', borderRadius:6, transform:'translateY(-50%)'}} onMouseDown={onResizeDown("right")} />
          {/* Bottom */}
          <div style={{position:'absolute', left:'50%', bottom:-6, width:12, height:12, cursor:'ns-resize', background:'#fff', border:'1px solid #2a72e5', borderRadius:6, transform:'translateX(-50%)'}} onMouseDown={onResizeDown("bottom")} />
          {/* Corner */}
          <div style={{position:'absolute', right:-6, bottom:-6, width:14, height:14, cursor:'nwse-resize', background:'#fff', border:'2px solid #2a72e5', borderRadius:8}} onMouseDown={onResizeDown("corner")} />
        </>
      )}
    </div>
  );
}
