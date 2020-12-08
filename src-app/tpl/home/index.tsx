import React from "react";
import { basicCenterLayoutStyle } from "../style";

export function Home() {
  return (
    <div css={{ backgroundColor: "#fafafa" }}>
      <div css={[basicCenterLayoutStyle, { padding: "2em 0em" }]}>
        <h2>this is some components demo</h2>
      </div>
    </div>
  )
}