import { Actor, AsyncStage, epicOn, Store, StoreProvider } from "@reactorx/core";
import { ReactorxRouter } from "@reactorx/router";
import { createBrowserHistory } from "history";
import { isFunction } from "lodash";
import React, { ReactElement, useEffect } from "react";
import { render } from "react-dom";
import { defaultTheme, ThemeProvider } from "src-core/ds";
import { createGAEpic } from "src-core/ga";
import { createPersister } from "@querycap/persister";

export const persister = createPersister({
  name: process.env.APP || "app",
});

const Bootstrap = (props: { initialValues?: any; children?: React.ReactNode }) => {
  const history = createBrowserHistory({
    basename: "",
    forceRefresh: false,
    keyLength: 6,
    getUserConfirmation: (message, callback) => callback(globalThis.confirm(message)),
  });

  const store$ = Store.create(props.initialValues || {});

  if (process.env.NODE_ENV !== "production" && process.env?.LOG === "1") {
    store$.applyMiddleware(
      require("redux-logger").createLogger({
        duration: true,
        collapsed: true,
        errorTransformer: (e: any) => {
          throw e;
        },
        colors: {
          title: (actor: Actor) => {
            switch (actor.stage) {
              case AsyncStage.STARTED:
                return "blue";
              case AsyncStage.DONE:
                return "green";
              case AsyncStage.FAILED:
                return "red";
              case AsyncStage.CANCEL:
                return "orange";
            }
            return "black";
          },
        },
      }),
    );
  }

  return (
    <>
      <PersisterConnect store$={store$} />
      <StoreProvider value={store$}>
        <ReactorxRouter history={history}>{props.children}</ReactorxRouter>
      </StoreProvider>
    </>
  );
};

function PersisterConnect({ store$ }: { store$: Store }) {
  useEffect(() => {
    const cleanup = persister.connect(store$);
    return () => {
      cleanup();
    };
  }, []);
  return null;
}

export const createBootstrap = (
  e: ReactElement<any> | (() => ReactElement<any>),
  ds = defaultTheme,
  tackingID?: string,
) => {
  return ($root: Element, _ = false) => {
    persister.hydrate((storeValues) => {
      render(
        <Bootstrap initialValues={storeValues}>
          {tackingID && epicOn(createGAEpic(tackingID))}
          <ThemeProvider theme={ds}>{isFunction(e) ? e() : e}</ThemeProvider>
        </Bootstrap>,
        $root,
      );
    });
  };
};
