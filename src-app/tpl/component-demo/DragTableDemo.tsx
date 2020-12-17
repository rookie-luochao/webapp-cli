import React, { useEffect, useState } from "react";
import { IPager } from "src-components/search/SearchContext";
import { DragableTableWithPagination } from "src-components/table/DragableTableWithPagination";
import { ParsedUrlQuery, useQuery } from "src-core/hooks/useQuery";
import { ds } from "../ds";
import { basicCenterLayoutStyle, basicWrapStyle } from "../style";
import { IPersonBasicInfo, usePersonInfoList } from "./mock";
import {displayPersonBasicInfo } from "./translate";

const fixedColumns = [
  {
    title: "操作",
    dataIndex: "operate",
    width: 120,
    render() {
      return <span>操作列拖拽无效</span>
    }
  },
];

const columns = [
  {
    index: 0,
    dataIndex: "name",
    title: displayPersonBasicInfo("name"),
    onHeaderCell(column: any) {
      return column;
    },
  },
  {
    index: 1,
    dataIndex: "age",
    title: displayPersonBasicInfo("age"),
    
    onHeaderCell(column: any) {
      return column;
    },
  },
  {
    index: 2,
    dataIndex: "height",
    title: displayPersonBasicInfo("height"),
    onHeaderCell(column: any) {
      return column;
    },
  },
  {
    index: 3,
    dataIndex: "weight",
    title: displayPersonBasicInfo("weight"),
    onHeaderCell(column: any) {
      return column;
    },
  },
  {
    index: 4,
    dataIndex: "level",
    title: displayPersonBasicInfo("level"),
    onHeaderCell(column: any) {
      return column;
    },
  },
  {
    index: 5,
    dataIndex: "maritalStatus",
    title: displayPersonBasicInfo("maritalStatus"),
    onHeaderCell(column: any) {
      return column;
    },
  },
  {
    index: 6,
    dataIndex: "income",
    title: displayPersonBasicInfo("income"),
    onHeaderCell(column: any) {
      return column;
    },
  },
  {
    index: 7,
    dataIndex: "birthplace",
    title: displayPersonBasicInfo("birthplace"),
    onHeaderCell(column: any) {
      return column;
    },
  },
];

interface IQueryData extends ParsedUrlQuery {
  offset: string;
  size: string;
}

export function DragTableDemo() {
  const [fields, setFields] = useState(columns);
  const [query, setQuery] = useQuery<IQueryData>();
  const offset = Number(query.offset || 0);
  const size = Number(query.size || 10);

  const [list, setList] = useState([] as IPersonBasicInfo[]);
  const total = 100;

  const allPersonInfos = usePersonInfoList();

  useEffect(() => {
    setList(allPersonInfos.slice(offset, offset + size))
  }, [query.offset, query.size])

  function onPagerChange({ size, offset }: IPager) {
    setQuery((preQuery) => {
      return {
        ...preQuery,
        offset: offset.toString(),
        size: size.toString(),
      }
    })
  }
  
  return (
    <div css={basicWrapStyle}>
      <div css={[basicCenterLayoutStyle, { padding: "2em 0em" }]}>
        <h2>基于antd table的可拖拽表格列排序</h2>
        <div css={{ padding: "12px", backgroundColor: ds.color.bg }}>
          <DragableTableWithPagination
            notDragableFields={fixedColumns}
            dragableFields={fields}
            dataSource={list}
            loading={false}
            rowKey="id"
            pager={{ size, offset }}
            onPagerChange={onPagerChange}
            total={total}
            pageSizeOptions={[10, 30, 50, 100]}
            onDragableFieldsChange={(fields) => {
              setFields(fields);
            }}
          />
        </div>
      </div>
    </div>
  )
}