import { Canvas } from "../components/canvas/Canvas";
import { CanvasToolbar } from "../components/canvas/CanvasToolbar";
import { CanvasControls } from "../components/canvas/CanvasControls";
import { PropertyPanel } from "../components/canvas/PropertyPanel";
import { OnlineUsersList } from "../components/collaboration/OnlineUsersList";
import { Header } from "../components/layout/Header";

export default function CanvasPage() {
  return (
    <div className="w-screen h-screen overflow-hidden bg-gray-100">
      <Header />
      <CanvasToolbar />
      <Canvas />
      <CanvasControls />
      <PropertyPanel />
      <OnlineUsersList />
    </div>
  );
}
