import React, { useEffect, useRef } from "react";

import { TextElement } from '@/types';

interface CertificateCanvasProps {
  templateUrl: string;
  name: string;
  textElements: TextElement[];
  onTextClick?: (id: string) => void;
  onTextMove?: (id: string, x: number, y: number) => void;
  onTextResize?: (id: string, width: number, height: number) => void;
  selectedElementId?: string | null;
}

export default function CertificateCanvas({ 
  templateUrl, 
  name, 
  textElements,
  onTextClick,
  onTextMove,
  onTextResize,
  selectedElementId 
}: CertificateCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Fungsi word-wrap manual
  function drawTextWithWrap(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
    const words = text.split(' ');
    let line = '';
    let lines: string[] = [];
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (maxWidth && testWidth > maxWidth && n > 0) {
        lines.push(line);
        line = words[n] + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line);
    lines.forEach((l, i) => ctx.fillText(l, x, y + i * lineHeight, maxWidth));
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const image = new window.Image();
    image.src = templateUrl;
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0, image.width, image.height);
      textElements.forEach(el => {
        const fontFamily = el.fontFamily || "Arial";
        const fontWeight = el.fontWeight || "normal";
        const fontSize = el.fontSize || 32;
        ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
        ctx.fillStyle = el.fontColor || "#222";
        ctx.textAlign = el.textAlign || "left";
        ctx.textBaseline = "top";
        const text = el.text.replace(/\{name\}/g, name);
        const lineHeight = el.lineHeight || fontSize * 1.2;
        const maxWidth = el.width || undefined;
        // Convert percentage positions to actual pixel positions
        const xPos = (el.x / 100) * canvas.width;
        const yPos = (el.y / 100) * canvas.height;
        
        if (maxWidth) {
          drawTextWithWrap(ctx, text, xPos, yPos, maxWidth, lineHeight);
        } else {
          ctx.fillText(text, xPos, yPos);
        }
      });
    };
  }, [templateUrl, name, textElements]);

  return <canvas ref={canvasRef} style={{ maxWidth: "100%", border: "1px solid #eee" }} />;
}
