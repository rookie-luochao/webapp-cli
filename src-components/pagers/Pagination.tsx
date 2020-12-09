import { useObservable } from "@reactorx/core";
import { map } from "lodash";
import { shade, tint } from "polished";
import React, { ReactNode } from "react";
import { useDesignSystem, defaultTheme } from "src-core/ds";
import { withoutBubble } from "src-core/react/dom-helpers";
import { IPager, useSearch } from "src-components/search/SearchContext";
import { Select } from "antd";
import { flex } from "src-core/styling/layout";

export interface IPaginationProps {
  total: number;
  pager: IPager;
  onPagerChange: (nextPager: IPager) => void;
  pageSizeOptions?: Array<number>;
  onShowSizeChange?: (nextPager: IPager) => void;
}

export const getPageNums = (total: number, current: number, offset = 3): Array<number | null> => {
  const nums: Array<number | null> = [];

  let n = total + 1;

  while (n--) {
    if (n > 0) {
      if (n >= total - offset) {
        nums.push(n);
      } else if (n <= 1 + offset) {
        nums.push(n);
      } else if (n >= current - offset && n <= current + offset) {
        nums.push(n);
      } else if (n === current + offset + 1 || n === current - offset - 1) {
        nums.push(null);
      }
    } else {
      break; //防止当size为-1时无限循环
    }
  }

  return nums.reverse();
};

export const Pager = () => {
  const { searchState$, updatePager } = useSearch();
  const { total, pager } = useObservable(searchState$);

  return <Pagination total={total} pager={pager} onPagerChange={updatePager} />;
};

export const Pagination = ({
  total,
  pager,
  onPagerChange,
  pageSizeOptions = [],
  onShowSizeChange,
  ...otherProps
}: IPaginationProps) => {
  const { size = 10, offset = 0 } = pager;
  const ds = useDesignSystem();
  const totalPage = Math.ceil(total / size);
  const currentPage = Math.floor(offset / size) + 1;

  const pageNums = getPageNums(totalPage, currentPage, 2);

  const updatePage = (nextPage: number) => {
    onPagerChange({
      offset: (nextPage - 1) * size,
      size,
    });
  };

  const itemStyle = {
    padding: "0.3em 0.6em",
    borderRadius: ds.radius.s,
    cursor: "pointer",
    color: tint(0.2, ds.color.textLight),
    backgroundColor: shade(0.03, ds.color.bgHover),
  };

  const pageNumItems = map(pageNums, (pageNum, idx) => {
    return (
      <a
        href={"#"}
        key={idx}
        onClick={withoutBubble(() => !!pageNum && currentPage !== pageNum && updatePage(pageNum))}
        css={[
          itemStyle,
          currentPage === pageNum && {
            color: ds.colorReverse$$.text,
            backgroundColor: ds.color.primary,
          },
        ]}>
        {pageNum ? pageNum : "..."}
      </a>
    );
  });

  return (
    <div
      css={{
        ...flex({
          alignItems: "center",
          justifyContent: "flex-end",
        }),
        width: "100%",
        margin: "2em 0",
      }}
      {...otherProps}>
      {pageNumItems.length > 0 && (
        <>
          {currentPage !== 1 && (
            <a
              css={[itemStyle, { marginRight: "0.2em" }]}
              href={"#"}
              onClick={withoutBubble(() => updatePage(currentPage - 1))}>
              上一页
            </a>
          )}
          <div css={[itemStyle, { marginRight: "0.2em", cursor: "default" }]}>{total} 条</div>
          <div css={{ "& > *": { margin: "0 0.2em" } }}>{pageNumItems}</div>
          {currentPage !== totalPage && (
            <a css={itemStyle} href={"#"} onClick={withoutBubble(() => updatePage(currentPage + 1))}>
              下一页
            </a>
          )}
        </>
      )}
      {pageSizeOptions.length > 0 && onShowSizeChange && (
        <Select
          style={{ marginLeft: 8, fontSize: defaultTheme.size.xxs, width: 120 }}
          value={size}
          options={map(pageSizeOptions, (item) => ({
            label: `${item}条 / 页`,
            value: item,
          }))}
          onChange={(val: number) => {
            onShowSizeChange({ size: val, offset });
          }}
        />
      )}
    </div>
  );
};

export interface IPagerWithTotal {
  offset: number;
  size: number;
  total?: number;
}

export const ContainerWithPagination = ({
  pager,
  children,
  onPagerChange,
}: {
  pager: IPagerWithTotal;
  onPagerChange: IPaginationProps["onPagerChange"];
  children: ReactNode;
}) => (
  <div css={{ display: "flex", flexDirection: "column" }}>
    <div css={() => ({ flex: 1 })}>{children}</div>
    {!!pager.total && <Pagination total={pager.total} pager={pager} onPagerChange={onPagerChange} />}
  </div>
);
