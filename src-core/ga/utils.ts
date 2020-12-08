export const loadScript = (script: string) => {
  const a = document.createElement("script");
  a.async = true;
  a.src = script;
  document.body.appendChild(a);
};

export const gtag = (...args: any[]) => {
  (globalThis as any).gtag && (globalThis as any).gtag(...args);
};

export const event = <TParams extends { [k: string]: any } = any>(
  action: string,
  params: TParams,
  event_category?: string,
  event_label?: string,
) => {
  gtag("event", action, {
    ...params,
    label: Object.keys(params)[0],
    event_label: event_label,
    event_category: event_category,
  });
};

export const pageView = (path: string) => {
  event("page_view", {
    page_path: path,
    page_location: globalThis.location.origin,
    page_title: document.title,
  });
};

// see more https://developers.google.com/analytics/devguides/collection/gtagjs/events?hl=zh-cn
export const login = (params: { method: string }) => {
  return event<typeof params>("login", params);
};

export const timingComplete = (
  params: {
    name: string;
    value: number;
  },
  event_category: string,
) => {
  return event<typeof params>("timing_complete", params, event_category);
};

export const exception = (description?: string, fatal?: boolean) => {
  event("exception", {
    description,
    fatal,
  });
};

export const initialize = (trackingID = "") => {
  loadScript(`//www.googletagmanager.com/gtag/js?id=${trackingID}`);

  (globalThis as any).dataLayer = (globalThis as any).dataLayer || [];

  (globalThis as any).gtag = function() {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line prefer-rest-params
      console.log(`GTag${JSON.stringify(Array.from(arguments))}`);
    }

    // eslint-disable-next-line prefer-rest-params
    (globalThis as any).dataLayer.push(arguments);
  };

  gtag("js", new Date());
  gtag("config", trackingID);

  globalThis.onerror = (msg: any, url: any, lineNo: any, columnNo: any, error: any) => {
    exception(`${msg} (${url}:${lineNo},${columnNo || ""}) ${error || ""}`, true);
  };

  if (globalThis.performance) {
    const timeSincePageLoad = Math.round(performance.now());

    timingComplete(
      {
        name: "load",
        value: timeSincePageLoad,
      },
      "JS Dependencies",
    );
  }
};
