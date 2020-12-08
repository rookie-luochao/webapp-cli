import { CSSObject } from "@emotion/core";
import { endsWith } from "lodash";
import { rgba } from "polished";

const color = {
  primary: "#19C7B1",
  secondary: "#27326C",

  success: "#4CD964",
  warning: "#F1911E",
  info: "#A9AEFC",
  danger: "#E51D30",

  text: "#333",
  textLight: "#85929A",

  border: "#E8E8E8",

  bg: "#FFFFFF",
  bgHover: "#F5F9FA",

  link: "#1890ff",
  linkHover: "#40a9ff",

  listHover: "#f0f9ff",
};

const colorReverse = {
  ...color,

  text: "#FFFFFF",
  textLight: "#85929A",

  border: "#22243B",
  bg: "#000000",
  bgHover: rgba("#000000", 0.3),
};

export const defaultTheme = {
  reverse() {
    return reverse(this);
  },

  fontFamily: {
    system: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimSun, sans-serif`,
    mono: `"Menlo", "Liberation Mono", "Consolas", "DejaVu Sans Mono", "Ubuntu Mono", "Courier New", "andale mono", "lucida console", monospace`,
  },

  weight: {
    bold: "bold" as CSSObject["fontWeight"],
    normal: "normal" as CSSObject["fontWeight"],
  },

  size: {
    xxs: 10,
    xs: 12,
    s: 14,
    base: 16,
    m: 18,
    l: 24,
    xl: 36,
    xxl: 48,
  },

  color,
  color$$: color,
  colorReverse,
  colorReverse$$: colorReverse,

  zIndex: {
    low: 10,
    mid: 100,
    high: 300,
    higher: 500,
  },

  radius: {
    s: 2,
    base: 4,
    m: 8,
  },

  spacing: {
    base: "0.6em 1em",
  },

  shadow: {
    dp2: `0 2px 2px 0 rgba(0, 0, 0, .04), 0 3px 1px -2px rgba(0, 0, 0, .2), 0 1px 5px 0 rgba(0, 0, 0, .12)`,
    dp3: `0 3px 4px 0 rgba(0, 0, 0, .04), 0 3px 3px -2px rgba(0, 0, 0, .2), 0 1px 8px 0 rgba(0, 0, 0, .12)`,
    dp4: `0 4px 5px 0 rgba(0, 0, 0, .04), 0 1px 10px 0 rgba(0, 0, 0, .12), 0 2px 4px -1px rgba(0, 0, 0, .2)`,
    dp6: `0 6px 10px 0 rgba(0, 0, 0, .04), 0 1px 18px 0 rgba(0, 0, 0, .12), 0 3px 5px -1px rgba(0, 0, 0, .2)`,
    dp8: `0 8px 10px 1px rgba(0, 0, 0, .04), 0 3px 14px 2px rgba(0, 0, 0, .12), 0 5px 5px -3px rgba(0, 0, 0, .2)`,
    dp16: `0 16px 24px 2px rgba(0, 0, 0, .04), 0 6px 30px 5px rgba(0, 0, 0, .12), 0 8px 10px -5px rgba(0, 0, 0, .2)`,
    dp24: `0 9px 46px 8px rgba(0, 0, 0, .04), 0 11px 15px -7px rgba(0, 0, 0, .12), 0 24px 38px 3px rgba(0, 0, 0, .2)`,
  },
};

function reverse<T>(settings: T): T {
  const nextSettings: any = {};

  for (const k in settings) {
    const val = settings[k];

    if (endsWith(k, "Reverse")) {
      continue;
    }

    if ((settings as any)[`${k}Reverse`]) {
      nextSettings[k] = {
        ...val,
        ...(settings as any)[`${k}Reverse`],
      };

      nextSettings[`${k}Reverse`] = {
        ...(settings as any)[`${k}Reverse`],
        ...val,
      };

      continue;
    }

    nextSettings[k] = val;
  }

  return nextSettings;
}

export type TTheme = typeof defaultTheme;
