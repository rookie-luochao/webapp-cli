import React from "react";
import { createBootstrap } from "src-core/react/Bootstrap";
import { SwitchByRoute } from "src-core/react/RouteTree";
import { route } from "./route";
import { TalkErrTrigger } from "src-core/error-handle/TalkErrTrigger";
import moment from "moment";
import { ConfigProvider } from "antd";
import zhCN from "antd/es/locale/zh_CN";
import { ds } from "./ds";

moment.locale("zh-cn");

export const bootstrap = createBootstrap(
  (
    <ConfigProvider locale={zhCN}>
      <TalkErrTrigger />
      <SwitchByRoute route={route()} />
    </ConfigProvider>
  ),
  ds
);
