import { X, PenTool, Eraser, Trash2, Download } from "lucide-react";

export default function WhiteboardOverlay({
  setShowWhiteboard,
  whiteboardMode,
  setWhiteboardMode,
  whiteboardColor,
  setWhiteboardColor,
  clearWhiteboard,
  downloadWhiteboard,
  canvasRef,
  startDrawing,
  draw,
  stopDrawing,
}) {
  return (
    <div className="absolute inset-0 z-40 bg-black/90 backdrop-blur-lg flex flex-col">
      <div className="bg-black/60 backdrop-blur-xl p-4 flex items-center gap-3 border-b border-white/10">
        <div className="flex gap-2">
          <button
            onClick={() => setWhiteboardMode("draw")}
            className={`p-2 rounded-lg transition ${whiteboardMode === "draw" ? "bg-cyan-600" : "bg-white/10 hover:bg-white/20"}`}
          >
            <PenTool size={18} />
          </button>
          <button
            onClick={() => setWhiteboardMode("erase")}
            className={`p-2 rounded-lg transition ${whiteboardMode === "erase" ? "bg-cyan-600" : "bg-white/10 hover:bg-white/20"}`}
          >
            <Eraser size={18} />
          </button>
          <input
            type="color"
            value={whiteboardColor}
            onChange={(e) => setWhiteboardColor(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer"
          />
          <button
            onClick={clearWhiteboard}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
          >
            <Trash2 size={18} />
          </button>
          <button
            onClick={downloadWhiteboard}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
          >
            <Download size={18} />
          </button>
        </div>
        <button
          onClick={() => setShowWhiteboard(false)}
          className="ml-auto p-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
        >
          <X size={18} />
        </button>
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className="flex-1 cursor-crosshair"
        style={{ touchAction: "none" }}
      />
    </div>
  );
}