import { Actor } from "@reactorx/core";
import { formSetErrors, formStartSubmit } from "@reactorx/form";
import { routerChanged } from "@reactorx/router";
import { merge, Observable } from "rxjs";
import { filter as rxFilter, ignoreElements as rxIgnoreElements, tap as rxTap } from "rxjs/operators";
import { event, initialize, pageView } from "./utils";

export const createGAEpic = (trackingID: string) => {
  initialize(trackingID);

  return (actor$: Observable<Actor>) => {
    return merge(
      actor$.pipe(
        rxFilter(routerChanged.is),
        rxTap(({ arg }) => {
          pageView((arg.pathname || "") + arg.search);
        }),
      ),
      actor$.pipe(
        rxFilter(formStartSubmit.is),
        rxTap(({ opts }) => {
          event("form", {
            event_label: opts.form,
          });
        }),
      ),
      actor$.pipe(
        rxFilter(formStartSubmit.is),
        rxTap(({ opts }) => {
          event("form", {}, "form", opts.form);
        }),
      ),
      actor$.pipe(
        rxFilter(formSetErrors.is),
        rxTap(({ arg, opts }) => {
          event("form", {
            event_category: "form",
            event_label: opts.form,
            label: "errors",
            errors: arg,
          });
        }),
      ),
    ).pipe(rxIgnoreElements());
  };
};
