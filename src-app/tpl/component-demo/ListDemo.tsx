import { Tabs } from "antd";
import { map } from "lodash";
import React, { useState } from "react";
import {IListRecordItemConfig, List } from "src-components/list/List";
import { ds } from "../ds";
import {basicCenterLayoutStyle, basicWrapStyle, defaultTagStyle, tagBasicStyle} from "../style";
import {IPerson, usePersonInfoList } from "./mock";
import { displayPersonInfo } from "./translate";

const { TabPane } = Tabs;

export function ListDemo() {

  return (
    <div css={basicWrapStyle}>
      <div css={[basicCenterLayoutStyle, { backgroundColor: "#fff", padding: "2em" }]}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="普通列表" key="1">
            <BasicList />
          </TabPane>
          <TabPane tab="可勾选的列表" key="2">
            <AllowSelectList />
          </TabPane>
        </Tabs>
      </div>
    </div>
  )
}

const sortedKeyConfig = [
  {
    keyName: "name",
    isDisplayKeyName: false,
    rowItemPercent: 10,
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
    keyName: "love",
    rowItemPercent: 100,
  },
  {
    keyName: "birthplace",
    rowItemPercent: 100,
  },
] as IListRecordItemConfig<keyof IPerson>[];

const displayLove = (values: string[]) => {
  return (
    <>
      {map(values, item => (
        <span key={item} css={[tagBasicStyle, defaultTagStyle]}>
          {item}
        </span>
      ))}
    </>
  )
}

function BasicList() {
  const dataSource = usePersonInfoList(10);

  return (
    <List
      dataSource={dataSource}
      rowId="id"
      sortedKeyConfig={sortedKeyConfig}
      displayLabel={displayPersonInfo}
      formatters={{
        love: displayLove
      }}
    />
  )
}

function AllowSelectList() {
  const [dataSource, setDataSource] = useState(usePersonInfoList(10))

  return (
    <List
      dataSource={dataSource}
      rowId="id"
      sortedKeyConfig={sortedKeyConfig}
      displayLabel={displayPersonInfo}
      formatters={{
        love: displayLove
      }}
      showRowSelectBar
      onRowSelectChange={(values) => {
        setDataSource(values);
      }}
    />
  )
}