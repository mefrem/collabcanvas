import { useRef, useEffect, useState } from "react";
import { Stage, Layer, Rect, Circle, Text, Transformer } from "react-konva";
import { useCanvas } from "../../contexts/CanvasContext";
import { useAuth } from "../../contexts/AuthContext";
import {
  createObject,
  updateObject,
  deleteObject,
} from "../../services/canvasService";
import type { CanvasObject } from "../../lib/types";
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  DEFAULT_SHAPE_COLOR,
  DEFAULT_SHAPE_WIDTH,
  DEFAULT_SHAPE_HEIGHT,
  DEFAULT_FONT_SIZE,
} from "../../utils/constants";
import { MultipleCursors } from "../collaboration/MultipleCursors";
import { useCursors } from "../../hooks/useCursors";
import Konva from "konva";

export const Canvas = () => {
  const {
    objects,
    selectedIds,
    setSelectedIds,
    currentTool,
    zoom,
    setZoom,
    pan,
    setPan,
  } = useCanvas();
  const { currentUser } = useAuth();
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Cursor tracking
  const updateCursor = useCursors(
    currentUser?.uid || "",
    currentUser?.displayName || "Anonymous"
  );

  // Handle transformer selection
  useEffect(() => {
    const transformer = transformerRef.current;
    const stage = stageRef.current;
    if (!transformer || !stage) return;

    const selectedNodes = selectedIds
      .map((id) => stage.findOne(`#${id}`))
      .filter(Boolean);

    transformer.nodes(selectedNodes as Konva.Node[]);
  }, [selectedIds]);

  const handleStageClick = (e: any) => {
    if (!currentUser) return;

    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();

    // Adjust for pan and zoom
    const adjustedPos = {
      x: (pos.x - pan.x) / zoom,
      y: (pos.y - pan.y) / zoom,
    };

    if (currentTool === "select") {
      // Handle selection
      const clickedOnEmpty = e.target === stage;
      if (clickedOnEmpty) {
        setSelectedIds([]);
      }
    } else if (currentTool === "rectangle") {
      // Create rectangle
      const newRect: Omit<CanvasObject, "id" | "createdAt" | "lastModified"> = {
        type: "rectangle",
        x: adjustedPos.x,
        y: adjustedPos.y,
        width: DEFAULT_SHAPE_WIDTH,
        height: DEFAULT_SHAPE_HEIGHT,
        rotation: 0,
        fill: DEFAULT_SHAPE_COLOR,
        zIndex: objects.length,
        createdBy: currentUser.uid,
        lastModifiedBy: currentUser.uid,
      };
      createObject(newRect, currentUser.uid);
    } else if (currentTool === "circle") {
      // Create circle
      const newCircle: Omit<CanvasObject, "id" | "createdAt" | "lastModified"> =
        {
          type: "circle",
          x: adjustedPos.x,
          y: adjustedPos.y,
          width: DEFAULT_SHAPE_WIDTH,
          height: DEFAULT_SHAPE_WIDTH, // Circle uses width for radius
          rotation: 0,
          fill: DEFAULT_SHAPE_COLOR,
          zIndex: objects.length,
          createdBy: currentUser.uid,
          lastModifiedBy: currentUser.uid,
        };
      createObject(newCircle, currentUser.uid);
    } else if (currentTool === "text") {
      // Create text
      const newText: Omit<CanvasObject, "id" | "createdAt" | "lastModified"> = {
        type: "text",
        x: adjustedPos.x,
        y: adjustedPos.y,
        width: 200,
        height: DEFAULT_FONT_SIZE + 10,
        rotation: 0,
        fill: DEFAULT_SHAPE_COLOR,
        zIndex: objects.length,
        text: "Double-click to edit",
        fontSize: DEFAULT_FONT_SIZE,
        createdBy: currentUser.uid,
        lastModifiedBy: currentUser.uid,
      };
      createObject(newText, currentUser.uid);
    }
  };

  const handleShapeClick = (e: any, shapeId: string) => {
    e.cancelBubble = true;

    if (currentTool === "select") {
      const isSelected = selectedIds.includes(shapeId);

      if (e.evt.shiftKey) {
        // Multi-select
        if (isSelected) {
          setSelectedIds(selectedIds.filter((id) => id !== shapeId));
        } else {
          setSelectedIds([...selectedIds, shapeId]);
        }
      } else {
        // Single select
        setSelectedIds(isSelected ? [] : [shapeId]);
      }
    }
  };

  const handleShapeDragEnd = (e: any, shapeId: string) => {
    if (!currentUser) return;

    const node = e.target;
    updateObject(
      shapeId,
      {
        x: node.x(),
        y: node.y(),
      },
      currentUser.uid
    );
  };

  const handleTransformEnd = (e: any) => {
    if (!currentUser) return;

    const node = e.target;
    const shapeId = node.id();

    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    updateObject(
      shapeId,
      {
        x: node.x(),
        y: node.y(),
        width: Math.max(5, node.width() * scaleX),
        height: Math.max(5, node.height() * scaleY),
        rotation: node.rotation(),
      },
      currentUser.uid
    );

    // Reset scale
    node.scaleX(1);
    node.scaleY(1);
  };

  const handleWheel = (e: any) => {
    e.evt.preventDefault();

    const scaleBy = 1.02;
    const stage = stageRef.current;
    if (!stage) return;

    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    let direction = e.evt.deltaY > 0 ? -1 : 1;

    // when we zoom on trackpad, e.evt.ctrlKey is true
    // in that case lets revert direction
    if (e.evt.ctrlKey) {
      direction = -direction;
    }

    const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    const clampedScale = Math.max(0.1, Math.min(2, newScale));

    setZoom(clampedScale);

    const newPos = {
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
    };
    setPan(newPos);
  };

  const handleStageDragStart = () => {
    if (currentTool === "pan") {
      setIsDragging(true);
      const stage = stageRef.current;
      if (stage) {
        setDragStart({ x: stage.x(), y: stage.y() });
      }
    }
  };

  const handleStageDragEnd = () => {
    if (currentTool === "pan") {
      setIsDragging(false);
      const stage = stageRef.current;
      if (stage) {
        setPan({ x: stage.x(), y: stage.y() });
      }
    }
  };

  const handleTextEdit = (textId: string, currentText: string) => {
    if (!currentUser) return;

    const newText = prompt("Edit text:", currentText);
    if (newText !== null) {
      updateObject(textId, { text: newText }, currentUser.uid);
    }
  };

  const handleMouseMove = (e: any) => {
    if (!currentUser) return;

    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();

    if (pos) {
      // Adjust for pan and zoom
      const adjustedPos = {
        x: (pos.x - pan.x) / zoom,
        y: (pos.y - pan.y) / zoom,
      };
      updateCursor(adjustedPos.x, adjustedPos.y);
    }
  };

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!currentUser) return;

      if (
        (e.key === "Delete" || e.key === "Backspace") &&
        selectedIds.length > 0
      ) {
        selectedIds.forEach((id) => deleteObject(id));
        setSelectedIds([]);
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "d") {
        e.preventDefault();
        selectedIds.forEach((id) => {
          const obj = objects.find((o) => o.id === id);
          if (obj) {
            const duplicate = {
              ...obj,
              x: obj.x + 20,
              y: obj.y + 20,
            };
            delete (duplicate as any).id;
            delete (duplicate as any).createdAt;
            delete (duplicate as any).lastModified;

            createObject(duplicate, currentUser.uid);
          }
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIds, objects, currentUser]);

  const renderShape = (obj: CanvasObject) => {
    const isSelected = selectedIds.includes(obj.id);
    const commonProps = {
      id: obj.id,
      x: obj.x,
      y: obj.y,
      draggable: currentTool === "select",
      onClick: (e: any) => handleShapeClick(e, obj.id),
      onDragEnd: (e: any) => handleShapeDragEnd(e, obj.id),
      onTransformEnd: handleTransformEnd,
    };

    switch (obj.type) {
      case "rectangle":
        return (
          <Rect
            key={obj.id}
            {...commonProps}
            width={obj.width}
            height={obj.height}
            fill={obj.fill}
            stroke={isSelected ? "#0066ff" : undefined}
            strokeWidth={isSelected ? 2 : 0}
          />
        );
      case "circle":
        return (
          <Circle
            key={obj.id}
            {...commonProps}
            radius={obj.width / 2}
            fill={obj.fill}
            stroke={isSelected ? "#0066ff" : undefined}
            strokeWidth={isSelected ? 2 : 0}
          />
        );
      case "text":
        return (
          <Text
            key={obj.id}
            {...commonProps}
            text={obj.text || "Double-click to edit"}
            fontSize={obj.fontSize || DEFAULT_FONT_SIZE}
            fill={obj.fill}
            width={obj.width}
            align="center"
            verticalAlign="middle"
            onDblClick={() => handleTextEdit(obj.id, obj.text || "")}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full bg-gray-50">
      <Stage
        ref={stageRef}
        width={window.innerWidth}
        height={window.innerHeight}
        scaleX={zoom}
        scaleY={zoom}
        x={pan.x}
        y={pan.y}
        onWheel={handleWheel}
        onClick={handleStageClick}
        onMouseMove={handleMouseMove}
        onDragStart={handleStageDragStart}
        onDragEnd={handleStageDragEnd}
        draggable={currentTool === "pan"}
      >
        <Layer>
          {/* Grid background */}
          {Array.from({ length: Math.floor(CANVAS_WIDTH / 50) }).map((_, i) => (
            <Rect
              key={`grid-v-${i}`}
              x={i * 50}
              y={0}
              width={1}
              height={CANVAS_HEIGHT}
              fill="#e5e7eb"
            />
          ))}
          {Array.from({ length: Math.floor(CANVAS_HEIGHT / 50) }).map(
            (_, i) => (
              <Rect
                key={`grid-h-${i}`}
                x={0}
                y={i * 50}
                width={CANVAS_WIDTH}
                height={1}
                fill="#e5e7eb"
              />
            )
          )}

          {/* Canvas objects */}
          {objects.sort((a, b) => a.zIndex - b.zIndex).map(renderShape)}

          {/* Multiple cursors */}
          <MultipleCursors />

          <Transformer
            ref={transformerRef}
            boundBoxFunc={(oldBox, newBox) => {
              // Limit resize
              if (newBox.width < 5 || newBox.height < 5) {
                return oldBox;
              }
              return newBox;
            }}
          />
        </Layer>
      </Stage>
    </div>
  );
};
