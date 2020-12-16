import React, { ReactNode, useRef } from "react";
import { Dictionary, keys, map } from "lodash";
import { CSSObject } from "@emotion/core";
import { pickDOMAttrs } from "src-core/react/utils";
import {BackgroundColorProperty} from "csstype";

interface IInfoListProps<TData> {
  dataSource: TData;
  formatters?: {
    [key in keyof TData]?: (data: TData[keyof TData], record?: TData) => ReactNode;
  };
  displayLabel?: (field: keyof TData) => string;
  leftLabelPercent?: number;
  sortedKeys?: Array<keyof TData>;
  rowItemCount?: number; // 默认一行2个
  rowItemSpace?: number; // 默认4px
  oddAndEvenRowBgColorsTuple?: [BackgroundColorProperty, BackgroundColorProperty];
}

export function InfoList<TData extends Dictionary<any>>(props: IInfoListProps<TData>) {
  const { dataSource, formatters = {} as TData, displayLabel, leftLabelPercent = 30,sortedKeys, rowItemCount = 2,
    rowItemSpace = 4, oddAndEvenRowBgColorsTuple = ["#EFF3F6", "#f8fafb"], ...otherProps } = props;
  const isSorted = !!sortedKeys;
  const defaultFormatValue = (v: keyof TData) => v || "-";
  const countRef = useRef<number>(0);

  const infoItemStyle: CSSObject = {
    padding: "15px 20px",
    marginBottom: rowItemSpace,
    height: `calc(100% - ${rowItemSpace}px)`,
    "& > label": {
      display: "inline-block",
      width: `${leftLabelPercent}%`,
      color: "#6A6E75",
    },
  };

  interface IUICompProps {
    keyName: keyof TData;
    index: number;
    render?: (data: TData[keyof TData], record?: TData) => ReactNode;
  }

  const UIComp = (props: IUICompProps) => {
    const { keyName, index, render } = props;
    const quotient = Math.ceil(index / rowItemCount);
    const remainder = index % rowItemCount;
    let bgColorStyle: CSSObject = { backgroundColor: oddAndEvenRowBgColorsTuple[0] };

    if (quotient % 2 === 0) {
      bgColorStyle = { backgroundColor: oddAndEvenRowBgColorsTuple[1] };
    }

    const halfRowItemSpace = rowItemSpace / 2;
    const rowItemPaddingStyle: CSSObject = remainder !== 0 || remainder !== rowItemCount - 1
      ? { paddingLeft: halfRowItemSpace, paddingRight: halfRowItemSpace }
      : remainder === 0 ? { paddingRight: halfRowItemSpace } : { paddingLeft: halfRowItemSpace }

    return (
      <div
        css={[{ flex: `0 0 ${100 / rowItemCount}%` }, rowItemPaddingStyle]}>
        <div css={[infoItemStyle, bgColorStyle]}>
          <label>{displayLabel ? displayLabel(keyName) || keyName : keyName}</label>
          <span>
            {render ? render(dataSource[keyName], dataSource) : defaultFormatValue(dataSource[keyName])}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div css={{ display: "flex", flexWrap: "wrap" }} {...pickDOMAttrs(otherProps)}>
      {
        isSorted ? (
          <>
            {map(sortedKeys, (key, index) => {
              const render = formatters[key];
              return (
                <UIComp key={key as string} keyName={key} index={index + 1} render={render} />
              );
            })}
          </>
        ) : (
          <>
            {map(keys(dataSource), (key) => {
              const render = formatters[key];
              countRef.current = countRef.current + 1;
              return (
                <UIComp key={key} keyName={key} index={countRef.current} render={render} />
              );
            })}
          </>
        )
      }
    </div>
  );
}