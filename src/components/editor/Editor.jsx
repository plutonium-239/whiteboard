import { useState, useLayoutEffect, useCallback } from "react";

import { useParams } from "react-router-dom";

import {
  Tldraw,
  createTLStore,
  defaultShapeUtils,
  throttle
} from "@tldraw/tldraw";

import { getAssetUrls } from "@tldraw/assets/selfHosted";

import { isStoreUpdateEmpty, uploadAsset } from "../../libs/utils";
import { getSnapshot, saveSnapshot } from "../../libs/storage";

import { customShapeUtils, customTools } from "../../shapes";

import CustomUI from "./CustomUI";

const assetUrls = getAssetUrls({
  baseUrl: "/assets/"
});

const allShapeUtils = [...defaultShapeUtils, ...customShapeUtils];

export default function Editor() {
  const { id: projectId } = useParams();
  const [store] = useState(() => createTLStore({ shapeUtils: allShapeUtils }));
  const [status, setStatus] = useState({
    loading: true,
    error: false,
    message: ""
  });

  useLayoutEffect(() => {
    const loadSnapshot = () => {
      setStatus({
        ...status,
        loading: true
      });

      const data = getSnapshot(projectId);
      if (data.store) store.loadSnapshot(data);

      setStatus({
        ...status,
        loading: false
      });
    };

    const unlisten = store.listen(
      throttle((res) => {
        if (isStoreUpdateEmpty(res)) return;

        saveSnapshot(projectId, store.getSnapshot());
      }, 500)
    );

    loadSnapshot();

    return () => unlisten();
  }, [store]);

  const onMount = useCallback((editor) => {
    // When a user uploads a file, create an asset from it
    editor.registerExternalAssetHandler("file", async ({ file }) => {
      let asset = null;

      try {
        asset = await uploadAsset(projectId, file);
      } catch (err) {
        console.error(err);
      }

      return asset;
    });
  }, []);

  if (status.loading === true) {
    return (
      <div className="center">
        <h2>Loading...</h2>
      </div>
    );
  }

  if (status.loading === false && status.error) {
    return (
      <div className="center">
        <h2>Error!</h2>
        <p>{status.message}</p>
      </div>
    );
  }

  return (
    <Tldraw
      assetUrls={assetUrls}
      shapeUtils={customShapeUtils}
      tools={customTools}
      onMount={onMount}
      store={store}
      autoFocus
      hideUi
    >
      <CustomUI />
    </Tldraw>
  );
}
