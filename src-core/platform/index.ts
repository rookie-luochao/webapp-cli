// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import map from "core-js/es/map";
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import promise from "core-js/es/promise";
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import set from "core-js/es/set";
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import weakMap from "core-js/es/weak-map";
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import weakSet from "core-js/es/weak-set";

if (!window.globalThis) {
  (window.globalThis as any) = window;
}

globalThis.Promise = globalThis.Promise || promise;
globalThis.Map = globalThis.Map || map;
globalThis.Set = globalThis.Set || set;
globalThis.WeakMap = globalThis.WeakMap || weakMap;
globalThis.WeakSet = globalThis.WeakSet || weakSet;
