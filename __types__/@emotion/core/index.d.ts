import { DetailedHTMLProps } from "react";
import { EmotionCache } from "@emotion/cache";
import css, { Interpolation, SerializedStyles } from "@emotion/css";
import { Keyframes } from "@emotion/serialize";
import { ClassAttributes, Context, createElement, Provider, ReactElement, ReactNode, Ref, SFC } from "react";

export {
  ArrayInterpolation,
  ComponentSelector,
  CSSObject,
  FunctionInterpolation,
  ObjectInterpolation,
} from "@emotion/css";

export { EmotionCache, Interpolation, SerializedStyles, css };

export const ThemeContext: Context<any>;
export const CacheProvider: Provider<EmotionCache>;

export function withEmotionCache<Props, RefType = any>(
  func: (props: Props, context: EmotionCache, ref: Ref<RefType>) => ReactNode,
): SFC<Props & ClassAttributes<RefType>>;

export const jsx: typeof createElement;

export type InterpolationWithTheme<Theme> = Interpolation | ((theme: Theme) => Interpolation);

export interface GlobalProps<Theme> {
  styles: InterpolationWithTheme<Theme>;
}

/**
 * @desc
 * JSX generic are supported only after TS@2.9
 */
export function Global<Theme = any>(props: GlobalProps<Theme>): ReactElement<any>;

export function keyframes(template: TemplateStringsArray, ...args: Array<Interpolation>): Keyframes;
export function keyframes(...args: Array<Interpolation>): Keyframes;

export interface ArrayClassNamesArg extends Array<ClassNamesArg> {}

export type ClassNamesArg = undefined | null | string | boolean | { [className: string]: boolean } | ArrayClassNamesArg;

export interface ClassNamesContent<Theme> {
  css(template: TemplateStringsArray, ...args: Array<Interpolation>): string;

  css(...args: Array<Interpolation>): string;

  cx(...args: Array<ClassNamesArg>): string;

  theme: Theme;
}

export interface ClassNamesProps<Theme> {
  children(content: ClassNamesContent<Theme>): ReactNode;
}

/**
 * @desc
 * JSX generic are supported only after TS@2.9
 */
export function ClassNames<Theme = any>(props: ClassNamesProps<Theme>): ReactElement<any>;

declare module "react" {
  interface DetailedHTMLProps<T> extends DOMAttributes<T> {
    css?: Interpolation | ((t: typeof defaultTheme) => Interpolation);
    title?: string | number;
  }
  interface SVGProps<T> extends DOMAttributes<T> {
    css?: Interpolation | ((t: typeof defaultTheme) => Interpolation);
  }
}
