import React, { createElement, useMemo } from "react";
import { basicCenterLayoutStyle, basicWrapStyle } from "../style";
import { find, map } from "lodash";
import { routes } from "../route";
import { Link } from "@reactorx/router";
import { ds } from "../ds";

export function Home() {
  const componentDemoroutes = useMemo(() => {
    const allRoutes = routes();
    return find(allRoutes.routes, item => item.pathname === "component-demo")?.routes;
  }, []);

  return (
    <div css={basicWrapStyle}>
      <div css={[basicCenterLayoutStyle, { padding: "2em 0em" }]}>
        <h2>this is some components demo</h2>
        {
          map(componentDemoroutes, item => (
            <div
              key={item.path}
              css={{ 
                backgroundColor: ds.color.bg,
                padding: "12px 4px",
                "& + &": { borderTop: "1px solid rgb(240, 244, 248)" }
              }}>
              <Link to={item.path} key={item.path}>
                {item.title && createElement(item.title)}
              </Link>
            </div>
          ))
        }
      </div>
    </div>
  )
}