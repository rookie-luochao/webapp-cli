import React, {ReactNode} from "react";
import { Dictionary, map, reduce } from "lodash";
import { CSSObject } from "@emotion/core";

type IFormatter<T> = {
  [key in keyof T]?: (data: T[key], record?: T) => ReactNode;
}

export interface IListRecordItemConfig<K extends any> {
  keyName: K;
  isDisplayKeyName?: boolean;
  rowItemPercent?: number;
  rowItemKeyNamePercent?: number;
  keyNameStyle?: CSSObject;
  valueStyle?: CSSObject;
  isValueHighLight?: boolean;
  flexAdaptiveRelativeDistance?: number;
}

interface IListProps<T> {
  dataSource: T[];
  sortedKeyConfig: IListRecordItemConfig<keyof T>[]; // 可排序
  rowId: keyof T;
  displayLabel?: (field: keyof T) => string;
  formatters?: IFormatter<T>;
}

export function List<T extends Dictionary<any>>(props: IListProps<T>) {
  const {
    dataSource,
    sortedKeyConfig,
    rowId,
    displayLabel,
    formatters = {} as IFormatter<T>,
  } = props;
  const defaultFormatKeyName = (v: keyof T) => v || "-";

  const listRowStyle: CSSObject = {
    display: "flex",
    flexWrap: "wrap",
    padding: "1.2em 1.4em",
    "& + &": {
      borderTop: "1px solid #f0f0f0",
    }
  }

  const rowItemStyle: CSSObject = {
    display: "flex",
    alignItems: "center",
    marginBottom: "1em",
  }

  return (
    <div css={{ border: "1px solid #d9d9d9", borderRadius: "2px" }}>
      {map(dataSource, item => (
        <div key={item[rowId]} css={listRowStyle}>
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
            } = keyConfig;
            const formatter = formatters[keyName];
            const value = item[keyName];
            let restFlexBasis = 0;

            const basicKeyStyle: CSSObject = {
              opacity: 0.4,
              width: rowItemKeyNamePercent ? `${rowItemKeyNamePercent}%` : "auto",
            }

            const basicValueStyle: CSSObject = {
              opacity: isDisplayKeyName || isValueHighLight ? 1 : 0.4,
            }

            if (flexAdaptiveRelativeDistance) {
              const flexBasisTotal = reduce(
                sortedKeyConfig.slice(index - flexAdaptiveRelativeDistance, index),
                (pre, cItem) => pre + (cItem.rowItemPercent || 0), 0);
              restFlexBasis = 100 - flexBasisTotal;
            }

            return (
              <div
                key={keyName as string}
                css={[
                  rowItemStyle,
                  flexAdaptiveRelativeDistance ? { flexBasis: `${restFlexBasis}%` } : { flexBasis: `${rowItemPercent}%` }
                ]}>
                {isDisplayKeyName && (
                  <label css={[basicKeyStyle, keyNameStyle]}>
                    {displayLabel ? displayLabel(keyName) || keyName : defaultFormatKeyName(keyName) }：
                  </label>
                )}
                <span css={[basicValueStyle, valueStyle]}>
                  {formatter ? formatter(value) : value }
                </span>
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}