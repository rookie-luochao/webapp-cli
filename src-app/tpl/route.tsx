import { RouteTree } from "src-core/react/RouteTree";
import { getRoute } from "src-core/platform/route";
import homeRoutes from "./home/routes";
import { Login } from "./common/Login";
import componentDemoRoutes from "./component-demo/routes";

export const routes = () => {
  return RouteTree.path("/")
    .withRoutes(
      RouteTree.path("login").withComp(Login),
      RouteTree.path("component-demo").withRoutes(...getRoute(componentDemoRoutes)),
      RouteTree.path("").withRoutes(...getRoute(homeRoutes)),
    );
};
