import { useState, useRef, useEffect } from "react";
import resampleCanvas from "./utils/resampleCanvas";
import BarChart from "./BarChart";

const { VITE_PREDICT_URL } = import.meta.env;

export default function App() {
  const inputCanvasRef = useRef<HTMLCanvasElement>(null);
  const outputCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [result, setResult] = useState<{
    predicted_class: number;
    softmax: number[];
  } | null>(null);

  useEffect(() => {
    const canvas = inputCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = 400;
    canvas.height = 400;

    // Fill with white background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const imgToArray = (canvas: HTMLCanvasElement): number[][] | null => {
    if (!canvas) return null;

    const imgData = canvas.getContext("2d")?.getImageData(0, 0, 28, 28).data;

    if (!imgData) return null;

    const imgInNumbers: number[][] = [];
    let i = 0;
    for (let j = 0; j < 28; j++) {
      imgInNumbers[j] = [];
      for (let k = 0; k < 28; k++) {
        const r = imgData[i];
        const g = imgData[i + 1];
        const b = imgData[i + 2];
        // Convierte a blanco o negro usando promedio simple
        const gray = (r + g + b) / 3;
        const value = (255 - gray) / 255;
        imgInNumbers[j][k] = value;
        i += 4;
      }
    }

    return imgInNumbers;
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing && e.type !== "mousedown") return;

    const canvas = inputCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = 15;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";

    if (e.type === "mousedown") {
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const clearCanvas = () => {
    const canvas = inputCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    clearCanvas();
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    console.log("Stopping drawing");
    setIsDrawing(false);
    const canvas = inputCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.beginPath();
    if (outputCanvasRef.current) {
      resampleCanvas(canvas, 28, 28, outputCanvasRef.current);
      predict();
    }
    if (!initialized) {
      setInitialized(true);
    }
  };

  const predict = async () => {
    try {
      if (!initialized) return;

      if (!outputCanvasRef.current) return;

      const imgArray = imgToArray(outputCanvasRef.current);

      if (!imgArray) return;

      const response = await fetch(VITE_PREDICT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: [imgArray],
        }),
      });

      if (!response.ok) {
        throw new Error("Error en la petición");
      }

      const result = await response.json();

      setResult(result);
    } catch (error) {
      setResult(null);
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-100/40 via-purple-50/40 to-blue-50/40">
      {/* Header */}
      <header className="flex items-center w-full justify-center px-8 mb-6">
        <div className="text-center mb-12">
          <h1 className="text-[100px] font-bold text-purple-600">Numi</h1>
          <h2 className="text-2xl font-bold text-gray-400">
            Dibuja un número aquí
          </h2>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center px-4 gap-[400px]">
        {/* Drawing Canvas Container */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-linear-to-r from-purple-400 via-blue-400 to-purple-400 rounded-3xl blur-xl opacity-60"></div>
          <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
            <canvas
              ref={inputCanvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              className="border-4 border-gray-100 rounded-xl cursor-crosshair shadow-inner"
            />
            <canvas
              ref={outputCanvasRef}
              width={28}
              height={28}
              className="hidden"
            ></canvas>
          </div>
        </div>
        {result && (
          <BarChart
            values={result.softmax}
            selectedClass={result.predicted_class}
          />
        )}
      </main>
    </div>
  );
}
