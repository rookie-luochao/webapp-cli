import { IRoute } from "src-core/platform/route";
import { DragTableDemo } from "./DragTableDemo";
import { InfoListDemo } from "./InfoListDemo";

export default [
  {
    path: "drag-table",
    title: "可拖拽表格列排序",
    component: DragTableDemo,
  },
  {
    path: "info-list",
    title: "信息列表",
    component: InfoListDemo,
  },
  // {
  //   path: "search-bar",
  //   title: "搜索条",
  //   component: SearchBarDemo,
  // }
] as IRoute[];