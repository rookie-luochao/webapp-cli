import { defaultTheme } from "src-core/ds";

export const ds: typeof defaultTheme = {
  ...defaultTheme,
  color: {
    ...defaultTheme.color,
    primary: "#1890ff",
    secondary: "#EFF0FE",
    linkHover: "#1662ff",
  },
  colorReverse: {
    ...defaultTheme.colorReverse,
    primary: "#1890ff",
    secondary: "#EFF0FE",
    linkHover: "#1662ff",
  },
};
