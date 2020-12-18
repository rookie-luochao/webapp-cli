import { CSSObject } from "@emotion/core";
import { flex } from "src-core/styling/layout";

export const basicCenterLayoutStyle: CSSObject = {
  width: 1200,
  margin: "0 auto",
};

export const horizontalCenterStyle: CSSObject = flex({ justifyContent: "center" });

export const horizontalSpaceBetweenStyle: CSSObject = flex({ justifyContent: "space-between" });

export const verticalCenterStyle: CSSObject = flex({ alignItems: "center" });

export const basicWrapStyle: CSSObject = {
  backgroundColor: "#fafafa",
  minHeight: globalThis.document.body.offsetHeight,
}

export const tagBasicStyle: CSSObject = {
  display: "inline-block",
  padding: "4px 6px",
  borderRadius: 2,
  marginRight: 6,
};

export const defaultTagStyle: CSSObject = {
  backgroundColor: "#fafafa",
  color: "rgba(0,0,0,.65)",
  border: "1px solid #d9d9d9",
};