import { BaseBoxShapeTool } from "tldraw";

export class EllipseShapeTool extends BaseBoxShapeTool {
  static id = "ellipse";
  shapeType = "geo";

  onExit = () => {
    const shapeId = this.editor.getSelectedShapeIds()[0];
    if (!shapeId) return;

    this.editor.updateShape({
      id: shapeId,
      props: {
        geo: "ellipse"
      }
    });
  };
}
