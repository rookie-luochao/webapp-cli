import React from "react";
import { RouteTree } from "src-core/react/RouteTree";

export interface IRouteMeta {
  permissionKeys: string[];
  outer?: boolean;
}

export interface IRoute {
  path: string;
  title: string;
  icon?: (props: any) => JSX.Element;
  component?: (props: any) => JSX.Element;
  lazyLoad?: JSX.Element;
  childrenRoutes?: IRoute[];
  meta?: IRouteMeta;
}

export const getRoute = (routes: IRoute[] = []): any[] => {
  return routes.map((route) => {
    let routeTree = RouteTree.path(route.path).withTitle(route.title);

    if (route?.icon) {
      routeTree = routeTree.withIcon(route.icon);
    }

    if (route.component) {
      routeTree = routeTree.withComp(route.component);
    }
    if (route.lazyLoad) {
      const Comp = () => <>{route.lazyLoad}</>;
      routeTree = routeTree.withComp(Comp);
    }
    if (route.childrenRoutes && route.childrenRoutes.length) {
      routeTree = routeTree.withRoutes(...getRoute(route.childrenRoutes));
    }
    if (route.meta) {
      routeTree.state = { ...routeTree.state, ...route.meta };
    }

    return routeTree;
  });
};
