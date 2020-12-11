import React from "react";
import { Card } from "antd";
import { InfoList } from "src-components/info-list/InfoList";
import {basicCenterLayoutStyle, basicWrapStyle} from "../style";
import {IPerson, personInfo} from "./mock";
import { displayPersonInfo } from "./translate";
import { omit } from "lodash";

export function InfoListDemo() {
  const sortedKeys: Array<keyof IPerson> = [
    "fatherName",
    "fatherAge",
    "fatherProfession",
    "motherName",
    "motherAge",
    "motherProfession",
    "name",
    "age",
    "birthplace",
    "weight",
    "height",
    "income",
    "maritalStatus",
    "level",
  ];

  return (
    <div css={basicWrapStyle}>
      <div css={[basicCenterLayoutStyle, { "& > *": { marginBottom: 10 }}]} >
        <Card title={"未排序的数据展示（默认每行2个数据）"}>
          <InfoList
            dataSource={omit(personInfo, ["id"])}
            displayLabel={displayPersonInfo}
          />
        </Card>
        <Card title={"排序的数据展示（默认每行2个数据）"}>
          <InfoList
            dataSource={personInfo}
            displayLabel={displayPersonInfo}
            sortedKeys={sortedKeys}
          />
        </Card>
        <Card title={"排序的数据展示（每行1个数据）"}>
          <InfoList
            dataSource={personInfo}
            displayLabel={displayPersonInfo}
            sortedKeys={sortedKeys}
            rowItemCount={1}
          />
        </Card>
        <Card title={"排序的数据展示（每行3个数据）"}>
          <InfoList
            dataSource={personInfo}
            displayLabel={displayPersonInfo}
            sortedKeys={sortedKeys}
            rowItemCount={3}
          />
        </Card>
        <Card title={"排序的数据展示（每行4个数据）"}>
          <InfoList
            dataSource={personInfo}
            displayLabel={displayPersonInfo}
            sortedKeys={sortedKeys}
            rowItemCount={4}
          />
        </Card>
        <Card title={"排序的数据展示（每行1个数据），卡片间距为2px"}>
          <InfoList
            dataSource={personInfo}
            displayLabel={displayPersonInfo}
            sortedKeys={sortedKeys}
            rowItemCount={1}
            rowItemSpace={2}
          />
        </Card>
        <Card title={"排序的数据展示（每行1个数据），自定义奇数行偶数行背景颜色"}>
          <InfoList
            dataSource={personInfo}
            displayLabel={displayPersonInfo}
            sortedKeys={sortedKeys}
            rowItemCount={2}
            rowItemSpace={2}
            oddAndEvenRowBgColorsTuple={["red", "yellow"]}
          />
        </Card>
      </div>
    </div>
  )
}