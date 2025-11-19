import { useState, useRef, useEffect } from "react";
import resampleCanvas from "./utils/resampleCanvas";
import BarChart from "./BarChart";
import { LuBrainCircuit } from "react-icons/lu";
import { FaGithub } from "react-icons/fa";

const { VITE_PREDICT_URL } = import.meta.env;

export default function App() {
  const inputCanvasRef = useRef<HTMLCanvasElement>(null);
  const outputCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [result, setResult] = useState<{
    predicted_class: number;
    softmax: number[];
  } | null>(null);

  useEffect(() => {
    const canvas = inputCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

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
  };

  const predict = async () => {
    try {
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
    <>
      <div className="min-h-screen text-white">
        {/* Navigation */}
        <nav className="border-b border-zinc-800 bg-[#0a0a0a]/80 backdrop-blur-sm fixed top-0 w-full z-50">
          <div className="container mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-12">
              <a href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-linear-to-br from-[#bd34fe] to-[#41d1ff] rounded-lg flex items-center justify-center">
                  <LuBrainCircuit className="size-5" />
                </div>
                <span className="font-semibold text-lg">NUMI</span>
              </a>
            </div>
            <div className="flex items-center gap-4">
              <button className="bg-linear-to-r from-[#bd34fe] to-[#41d1ff] hover:opacity-90 text-white border-0 p-2 rounded-lg cursor-pointer">
                <FaGithub />
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="pt-28 px-6">
          <div className="container mx-auto max-w-5xl text-center relative">
            <div className="mb-6 bg-[#bd34fe]/10 text-[#bd34fe] border border-[#bd34fe]/20 hover:bg-[#bd34fe]/20 w-fit rounded-full flex items-center px-2 py-1 text-[10px] font-bold gap-2 m-auto ">
              <LuBrainCircuit className="size-4" />
              AI powered
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight text-balance">
              Predicción inteligente
              <br />
              <span className="vite-text-gradient">con solo un trazo</span>
            </h1>
            {/* <div className="">
              <Animation />
            </div> */}
          </div>

          <div className="container flex justify-center items-center mx-auto mt-20 gap-20">
            <div className="container relative w-fit">
              <div className="absolute inset-0 bg-linear-to-r from-[#bd34fe]/50 to-[#41d1ff]/50 blur-3xl rounded-full" />
              <div className="relative bg-[#1a1a1a] rounded-2xl border border-zinc-800 shadow-2xl p-6 flex gap-2 flex-col">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="relative rounded-lg font-mono text-sm">
                  <canvas
                    ref={inputCanvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    className="border-4 border-gray-100 rounded-xl cursor-crosshair shadow-inner"
                    width={300}
                    height={300}
                  />
                  <canvas
                    ref={outputCanvasRef}
                    width={28}
                    height={28}
                    className="hidden"
                  ></canvas>
                </div>
              </div>
            </div>
            {result && (
              <BarChart
                values={result.softmax}
                selectedClass={result.predicted_class}
              />
            )}
          </div>
        </section>
      </div>
    </>
  );
}
