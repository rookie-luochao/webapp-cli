import { CSSObject } from "@emotion/core";
import {
  JustifyContentProperty,
  AlignItemsProperty,
  FlexDirectionProperty,
  FlexWrapProperty,
  FlexProperty,
  AlignContentProperty,
} from "csstype";

export interface IFlexOptions {
  justifyContent?: JustifyContentProperty;
  alignItems?: AlignItemsProperty;
  flexDirection?: FlexDirectionProperty;
  flexWrap?: FlexWrapProperty;
  flex?: FlexProperty<string>;
  alignContent?: AlignContentProperty;
}

export const flex = (flexOpts: IFlexOptions = {}) => ({
  display: "flex",
  ...flexOpts,
}) as CSSObject;

export const flexCenterOption = (arg: IFlexOptions = {}) => {
  return {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    ...arg,
  };
};