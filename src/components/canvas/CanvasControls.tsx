import { useCanvas } from "../../contexts/CanvasContext";
import { MIN_ZOOM, MAX_ZOOM, ZOOM_STEP } from "../../utils/constants";

export const CanvasControls = () => {
  const { zoom, setZoom, setPan } = useCanvas();

  const handleZoomIn = () => {
    setZoom(Math.min(zoom + ZOOM_STEP, MAX_ZOOM));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - ZOOM_STEP, MIN_ZOOM));
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-2 flex flex-col gap-2 z-10">
      <button
        onClick={handleZoomIn}
        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded"
        title="Zoom In"
      >
        +
      </button>
      <div className="px-3 py-1 text-center text-sm">
        {Math.round(zoom * 100)}%
      </div>
      <button
        onClick={handleZoomOut}
        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded"
        title="Zoom Out"
      >
        −
      </button>
      <button
        onClick={handleResetView}
        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-xs"
        title="Reset View"
      >
        Reset
      </button>
    </div>
  );
};
