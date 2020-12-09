import React, { useEffect, useMemo, useState } from "react";
import { IPager } from "src-components/search/SearchContext";
import { DragableTableWithPagination } from "src-components/table/DragableTableWithPagination";
import { ParsedUrlQuery, useQuery } from "src-core/hooks/useQuery";
import { ds } from "../ds";
import { basicCenterLayoutStyle, basicWrapStyle } from "../style";

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
    title: "姓名",
    onHeaderCell(column: any) {
      return column;
    },
  },
  {
    index: 1,
    dataIndex: "age",
    title: "年龄",
    
    onHeaderCell(column: any) {
      return column;
    },
  },
  {
    index: 2,
    dataIndex: "height",
    title: "身高（cm）",
    onHeaderCell(column: any) {
      return column;
    },
  },
  {
    index: 3,
    dataIndex: "weight",
    title: "体重（kg）",
    onHeaderCell(column: any) {
      return column;
    },
  },
  {
    index: 4,
    dataIndex: "level",
    title: "学历",
    onHeaderCell(column: any) {
      return column;
    },
  },
  {
    index: 5,
    dataIndex: "maritalStatus",
    title: "婚姻状况",
    onHeaderCell(column: any) {
      return column;
    },
  },
  {
    index: 6,
    dataIndex: "income",
    title: "收入（元）",
    onHeaderCell(column: any) {
      return column;
    },
  },
  {
    index: 7,
    dataIndex: "birthplace",
    title: "出生地址",
    onHeaderCell(column: any) {
      return column;
    },
  },
];

interface IPersonInfo {
  id: string;
  name: string;
  age: number;
  height: number;
  weight: number;
  level: string;
  maritalStatus: string;
  income: number;
  birthplace: string;
}

interface IQueryData extends ParsedUrlQuery {
  offset: string;
  size: string;
}

export function DragTableDemo() {
  const [fields, setFields] = useState(columns);
  const [query, setQuery] = useQuery<IQueryData>();
  const offset = Number(query.offset || 0);
  const size = Number(query.size || 10);

  const [list, setList] = useState([] as IPersonInfo[]);
  const total = 100;

  const allPersonInfos = useMemo(() => {
    const returnAllPersonInfos = [];
    for(let i = 0; i <= 100; i = i + 1) {
      returnAllPersonInfos.push({
        id: i.toString(),
        name: `张三${i}`,
        age: 20,
        height: 185,
        weight: 75,
        level: "博士研究生",
        maritalStatus: "已婚",
        income: 30000,
        birthplace: "四川省成都市高新区天府四街02001号",
      } as IPersonInfo);
    }
    return returnAllPersonInfos;
  }, []);

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