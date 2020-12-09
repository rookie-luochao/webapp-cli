import React from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Pagination, IPaginationProps } from "src-components/pagers/Pagination";
import { omit, Dictionary, isNumber, map } from "lodash";
import { IPager } from "src-components/search/SearchContext";
import { Table } from "antd";
import { SizeType } from "antd/lib/config-provider/SizeContext";
import { TableProps } from "antd/lib/table";

const type = "DragableColumn";

export function DragableTableWithPagination<T extends object>({
  dragableFields,
  dataSource,
  loading,
  rowKey,
  pager,
  onPagerChange,
  total,
  pageSizeOptions,
  tableSize = "middle",
  onDragableFieldsChange,
  scrollX,
  scrollY,
  notDragableFields = [],
  onChange,
}: {
  dragableFields: any[];
  dataSource: T[];
  loading: boolean;
  rowKey: string;
  pager: IPager;
  onPagerChange: IPaginationProps["onPagerChange"];
  total: number;
  pageSizeOptions: number[];
  tableSize?: SizeType;
  onDragableFieldsChange: (fields: any[], dragFieldSn: number, hoverFieldSn: number) => void;
  scrollX?: number;
  scrollY?: number;
  notDragableFields?: any[];
} & TableProps<T>) {
  //dragIndex: 当前的列，hoverIndex: 目标列
  function moveColumn(dragIndex: number, hoverIndex: number) {
    if (isNumber(dragIndex) && isNumber(hoverIndex)) {
      if (dragIndex === hoverIndex) return;
      const dragFieldSn = dragableFields[dragIndex].sn;
      const hoverFieldSn = dragableFields[hoverIndex].sn;
      const temp = {
        ...dragableFields[dragIndex],
        index: hoverIndex,
        sn: dragableFields[hoverIndex].sn,
      };
      dragableFields.splice(dragIndex, 1);
      dragableFields.splice(hoverIndex, 0, temp);

      if (dragIndex < hoverIndex) {
        dragableFields = map(dragableFields, (item, index) => {
          if (dragIndex <= index && index < hoverIndex) {
            return {
              ...item,
              index,
              sn: item.sn - 1,
            };
          }
          return item;
        });
      } else {
        dragableFields = map(dragableFields, (item, index) => {
          if (hoverIndex < index && index <= dragIndex) {
            return {
              ...item,
              index,
              sn: item.sn + 1,
            };
          }
          return item;
        });
      }
      onDragableFieldsChange([...dragableFields], dragFieldSn, hoverFieldSn);
    }
  }

  const DragableColumn = ({ index, className, ...restProps }: Dictionary<any>) => {
    const ref = React.useRef<HTMLTableHeaderCellElement>(null);
    const [{ isOver, dropClassName }, drop] = useDrop({
      accept: type,
      collect: (monitor) => {
        const { index: dragIndex } = monitor.getItem() || {};
        if (!~dragIndex || !~index || dragIndex === index) {
          return {};
        }
        return {
          isOver: monitor.isOver(),
          dropClassName: dragIndex < index ? " drop-over-right" : " drop-over-left",
        };
      },
      drop: (item: { type: string; index: number }) => {
        moveColumn(item.index, index);
      },
    });
    const [, drag] = useDrag({
      item: { type, index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });
    drop(drag(ref));
    return (
      <th
        ref={ref}
        className={`${className}${isOver ? dropClassName : ""}`}
        {...omit(restProps, ["dataIndex", "onHeaderCell", "render", "filters", "filterMultiple", "filteredValue"])}
        style={{ cursor: "move" }}
      />
    );
  };

  return (
    <div
      id="components-table-drag-sorting"
      css={{
        "& th.drop-over-right": {
          border: "1px dashed #1890ff !important",
        },
        "& th.drop-over-left": {
          border: "1px dashed #1890ff",
        },
      }}>
      <DndProvider backend={HTML5Backend}>
        <Table
          columns={[...notDragableFields, ...dragableFields]}
          dataSource={dataSource}
          bordered
          pagination={false}
          rowKey={rowKey}
          size={tableSize}
          loading={loading}
          components={{
            header: {
              cell: DragableColumn,
            },
          }}
          scroll={{ x: scrollX, y: scrollY }}
          onChange={onChange}
        />
      </DndProvider>
      <Pagination
        total={total}
        pager={pager}
        onPagerChange={(pager) => {
          onPagerChange(pager);
        }}
        pageSizeOptions={pageSizeOptions}
        onShowSizeChange={(pager) => onPagerChange(pager)}
      />
    </div>
  );
}
