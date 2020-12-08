import { InterpolationWithTheme, ThemeContext } from "@emotion/core";
import { ThemeProvider as OriginThemeProvider } from "emotion-theming";
import React, { ComponentType, Context, ReactNode, useContext, useMemo } from "react";
import { defaultTheme, TTheme } from "./defaultTheme";

export function ThemeProvider<Theme>(props: {
  theme: Partial<Theme> | ((outerTheme: Theme) => Theme);
  children: React.ReactNode;
}) {
  return <OriginThemeProvider {...props} />;
}

export function useDesignSystem() {
  return useContext(ThemeContext as Context<TTheme>);
}

export function DesignSystemColorReverse({ children }: { children?: ReactNode }) {
  const ds = useDesignSystem();
  const r = useMemo(() => ds.reverse(), []);

  return <ThemeProvider theme={r}>{children}</ThemeProvider>;
}

export function withDesignSystemReverse<TProps>(Comp: ComponentType<TProps>) {
  return function DesignSystemReverse(props: TProps) {
    return (
      <DesignSystemColorReverse>
        <Comp {...props} />
      </DesignSystemColorReverse>
    );
  };
}

export { defaultTheme };

export * from "./reset";

declare module "react" {
  interface DOMAttributes<T> {
    css?: InterpolationWithTheme<TTheme>;
  }
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicAttributes {
      css?: InterpolationWithTheme<TTheme>;
    }
  }
}
