import React from "react";
import {IListRecordItemConfig, List } from "src-components/list/List";
import { ds } from "../ds";
import {basicCenterLayoutStyle, basicWrapStyle} from "../style";
import {IPerson, usePersonInfoList } from "./mock";
import { displayPersonInfo } from "./translate";

export function ListDemo() {
  const dataSource = usePersonInfoList(10);

  const sortedKeyConfig = [
    {
      keyName: "name",
      isDisplayKeyName: false,
      rowItemPercent: 15,
      valueStyle: {
        fontSize: 24,
        fontWeight: 500,
        color: ds.color.primary,
      },
      isValueHighLight: true,
    },
    {
      keyName: "age",
      isDisplayKeyName: false,
      rowItemPercent: 5,
    },
    {
      keyName: "height",
      isDisplayKeyName: false,
      rowItemPercent: 5,
    },
    {
      keyName: "weight",
      isDisplayKeyName: false,
      flexAdaptiveRelativeDistance: 3
    },
    {
      keyName: "level",
      rowItemPercent: 50,
    },
    {
      keyName: "maritalStatus",
      rowItemPercent: 50,
    },
    {
      keyName: "birthplace",
      rowItemPercent: 100,
    },
  ] as IListRecordItemConfig<keyof IPerson>[];

  return (
    <div css={basicWrapStyle}>
      <div css={[basicCenterLayoutStyle, { backgroundColor: "#fff", padding: "2em" }]}>
        <List
          dataSource={dataSource}
          rowId="id"
          sortedKeyConfig={sortedKeyConfig}
          displayLabel={displayPersonInfo}
        />
      </div>
    </div>
  )
}