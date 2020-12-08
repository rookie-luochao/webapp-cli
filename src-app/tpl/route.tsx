import { RouteTree } from "src-core/react/RouteTree";
import { getRoute } from "src-core/platform/route";
import homeRoutes from "./home/routes";
import { Login } from "./common/Login";

export const route = () => {
  return RouteTree.path("/")
    .withRoutes(
      RouteTree.path("login").withComp(Login),
      RouteTree.path("").withRoutes(...getRoute(homeRoutes)),
    );
};
