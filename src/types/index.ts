export interface TextElement {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontColor: string;
  fontFamily?: string;
  fontWeight?: string;
  textAlign?: CanvasTextAlign;
  width?: number;
  height?: number;
  lineHeight?: number;
}
