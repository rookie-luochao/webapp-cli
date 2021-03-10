import React, { ReactNode } from "react";
import { Dictionary, map, reduce, findIndex, filter } from "lodash";
import { CSSObject } from "@emotion/core";
import { Checkbox } from "antd";

interface IRowWithIsChecked {
  isChecked?: boolean;
}

type IFormatter<T> = {
  [key in keyof T]?: (data: T[key], record?: T) => ReactNode;
};

export interface IListRecordItemConfig<K extends any> {
  keyName: K;
  isDisplayKeyName?: boolean;
  rowItemPercent?: number;
  rowItemKeyNamePercent?: number;
  keyNameStyle?: CSSObject;
  valueStyle?: CSSObject;
  isValueHighLight?: boolean;
  flexAdaptiveRelativeDistance?: number;
  noMargin?: boolean;
}

interface IListProps<T> {
  dataSource: Array<T & IRowWithIsChecked>;
  sortedKeyConfig: IListRecordItemConfig<keyof T>[]; // 可排序
  rowId: keyof T;
  displayLabel?: (field: keyof T) => string;
  formatters?: IFormatter<T>;
  onRowSelectChange?: (allRowData: Array<T & IRowWithIsChecked>) => void;
  showRowSelectBar?: boolean;
  activeRowId?: string;
  contentStyle?: CSSObject;
}

export function List<T extends Dictionary<any>>(props: IListProps<T>) {
  const {
    dataSource,
    sortedKeyConfig,
    rowId,
    displayLabel,
    formatters = {} as IFormatter<T>,
    onRowSelectChange,
    showRowSelectBar = false,
    activeRowId,
    contentStyle,
  } = props;
  const defaultFormatKeyName = (v: keyof T) => v || "-";

  const listRowStyle: CSSObject = {
    display: "flex",
    padding: "1.2em 1.4em",
    "& + &": {
      borderTop: "1px solid #f0f0f0",
    },
  };

  const flexRowStyle: CSSObject = {
    display: "flex",
    flexWrap: "wrap",
    flex: 1,
  };

  const rowItemStyle: CSSObject = {
    display: "flex",
    alignItems: "center",
    marginBottom: "4px",
  };

  const getNewList = (props: { rowData: T; isChecked: boolean }) => {
    const { rowData, isChecked } = props;
    const newItem = { ...rowData, isChecked: !!isChecked };
    const index = findIndex(dataSource, (listItem) => listItem[rowId] === rowData[rowId]);
    dataSource.splice(index, 1, newItem);
    onRowSelectChange && onRowSelectChange([...dataSource]);
  };

  const selectedDataSource = filter(dataSource, (item) => !!item.isChecked);

  return (
    <div>
      {onRowSelectChange && showRowSelectBar && (
        <div
          css={{
            marginBottom: 8,
            padding: "12px 24px",
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: "#e6f7ff",
            border: "1px solid #91d5ff",
            borderRadius: 2,
          }}>
          <div>已选择&nbsp;{selectedDataSource.length}&nbsp;项</div>
          <div>
            {selectedDataSource.length !== dataSource.length && (
              <a
                css={{ marginRight: 6 }}
                onClick={() => {
                  onRowSelectChange(
                    map(dataSource, (item) => ({
                      ...item,
                      isChecked: true,
                    })),
                  );
                }}>
                全选
              </a>
            )}
            {selectedDataSource.length > 0 && (
              <a
                onClick={() => {
                  onRowSelectChange(
                    map(dataSource, (item) => ({
                      ...item,
                      isChecked: false,
                    })),
                  );
                }}>
                取消选择
              </a>
            )}
          </div>
        </div>
      )}
      <div css={[{ border: "1px solid #d9d9d9", borderRadius: "2px" }, contentStyle]}>
        {map(dataSource, (item) => (
          <div
            key={item[rowId]}
            css={[
              listRowStyle,
              activeRowId && activeRowId === item[rowId]
                ? { border: "1px dashed #1890ff", margin: 4, borderRadius: 2 }
                : {},
            ]}>
            {onRowSelectChange && (
              <Checkbox
                checked={item.isChecked}
                onChange={(e) => {
                  getNewList({ rowData: item, isChecked: e.target.checked });
                }}
                style={{ marginRight: 12, marginTop: 3 }}
              />
            )}
            <div css={flexRowStyle}>
              {map(sortedKeyConfig, (keyConfig, index) => {
                const {
                  keyName,
                  isDisplayKeyName = true,
                  rowItemPercent = 100,
                  rowItemKeyNamePercent,
                  keyNameStyle,
                  valueStyle,
                  isValueHighLight = false,
                  flexAdaptiveRelativeDistance = 0,
                  noMargin = false,
                } = keyConfig;
                const formatter = formatters[keyName];
                const value = item[keyName];
                let restFlexBasis = 0;

                const basicKeyStyle: CSSObject = {
                  opacity: 0.4,
                  width: rowItemKeyNamePercent ? `${rowItemKeyNamePercent}%` : "auto",
                };

                const basicValueStyle: CSSObject = {
                  opacity: isDisplayKeyName || isValueHighLight ? 1 : 0.4,
                  wordBreak: "break-all",
                  flex: 1,
                };

                if (flexAdaptiveRelativeDistance) {
                  const flexBasisTotal = reduce(
                    sortedKeyConfig.slice(index - flexAdaptiveRelativeDistance, index),
                    (pre, cItem) => pre + (cItem.rowItemPercent || 0),
                    0,
                  );
                  restFlexBasis = 100 - flexBasisTotal;
                }

                return (
                  <div
                    key={keyName as string}
                    css={[
                      rowItemStyle,
                      flexAdaptiveRelativeDistance
                        ? { flexBasis: `${restFlexBasis}%` }
                        : { flexBasis: `${rowItemPercent}%` },
                      noMargin ? { margin: 0 } : {},
                    ]}>
                    {isDisplayKeyName && (
                      <div css={[basicKeyStyle, keyNameStyle]}>
                        {displayLabel ? displayLabel(keyName) || keyName : defaultFormatKeyName(keyName)}：
                      </div>
                    )}
                    <div css={[basicValueStyle, valueStyle]}>{formatter ? formatter(value, item) : value}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}