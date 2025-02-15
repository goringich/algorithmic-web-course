import Konva from 'konva';
import React from 'react';

export async function waitForLayerRef(
  layerRef: React.MutableRefObject<Konva.Layer | null>,
  timeout = 2000,
  interval = 50
): Promise<Konva.Layer | null> {
  console.log(`[INFO] Waiting for layerRef to be available...`);
  let waited = 0;
  while (!layerRef.current && waited < timeout) {
    await new Promise((resolve) => setTimeout(resolve, interval));
    waited += interval;
  }
  if (layerRef.current) {
    console.log(`[INFO] layerRef is now available after ${waited}ms.`);
  } else {
    console.error(`[ERROR] layerRef still null after waiting ${timeout}ms.`);
  }
  return layerRef.current;
}
