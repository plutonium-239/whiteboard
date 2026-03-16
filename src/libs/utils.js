import {
  Box,
  compact,
  AssetRecordType,
  getHashForString,
  uniqueId,
  MediaHelpers
} from "tldraw";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/svg+xml"];

export function groupByCount(arr, size = 1) {
  if (arr.length < size) return [arr];

  return arr.reduce((acc, cur, idx) => {
    if (idx % size === 0) acc.push([cur]);
    else acc[acc.length - 1].push(cur);

    return acc;
  }, []);
}

export function duplicateShapes(editor) {
  const ids = editor.getSelectedShapeIds();
  const commonBounds = Box.Common(
    compact(ids.map((id) => editor.getShapePageBounds(id)))
  );
  const offset = editor.getInstanceState().canMoveCamera
    ? {
        x: commonBounds.width + 10,
        y: 0
      }
    : {
        x: 16 / editor.getZoomLevel(),
        y: 16 / editor.getZoomLevel()
      };

  editor.markHistoryStoppingPoint("duplicate shapes");
  editor.duplicateShapes(ids, offset);
}

export function isStoreUpdateEmpty(res) {
  const { added, removed, updated } = res.changes;

  for (const _ in added) return false;
  for (const _ in removed) return false;

  const keys = Object.keys(updated);

  if (keys.length > 1) return false;
  if (keys[0] !== "pointer:pointer") return false;

  return true;
}

export async function uploadAsset(projectId, file) {
  const id = uniqueId();

  // Read the file as a data URL so no server upload is needed
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const assetId = AssetRecordType.createId(getHashForString(id + file.name));

  let size;
  let isAnimated;
  let shapeType;

  if (IMAGE_TYPES.includes(file.type)) {
    shapeType = "image";
    size = await MediaHelpers.getImageSize(dataUrl);
    isAnimated = file.type === "image/gif" && (await MediaHelpers.isAnimated(file));
  } else {
    shapeType = "video";
    isAnimated = true;
    size = await MediaHelpers.getVideoSize(dataUrl);
  }

  const asset = AssetRecordType.create({
    id: assetId,
    type: shapeType,
    typeName: "asset",
    props: {
      name: file.name,
      src: dataUrl,
      w: size.w,
      h: size.h,
      mimeType: file.type,
      isAnimated
    }
  });

  return asset;
}
