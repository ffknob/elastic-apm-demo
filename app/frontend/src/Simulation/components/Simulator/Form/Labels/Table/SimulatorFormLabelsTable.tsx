import React, { useState } from 'react';

import {
  EuiBasicTable,
  EuiBasicTableColumn,
  EuiTableSortingType,
  EuiTableSelectionType,
  Direction,
  SortDirection,
} from '@elastic/eui';

import APMLabel from '../../../../../../shared/interfaces/APMLabel';

import './SimulatorFormLabelsTable.scss';

export interface SimulatorFormLabelsTableProps {
  labels: APMLabel[];
  onSelectedLabelsChange: (selectedLabels: APMLabel[]) => void;
  onCopyLabel: (label: APMLabel) => void;
  onRemoveLabel: (label: APMLabel) => void;
}

const PAGE_INDEX = 0;
const PAGE_SIZE = 5;
const PAGE_SIZE_OPTIONS = [3, 5, 10, 15];
const SORT_FIELD = 'key';
const SORT_DIRECTION = SortDirection.ASC;

const SimulatorFormLabel: React.FC<SimulatorFormLabelsTableProps> = (
  props: SimulatorFormLabelsTableProps
) => {
  const { labels, onSelectedLabelsChange, onCopyLabel, onRemoveLabel } = props;

  const [pageIndex, setPageIndex] = useState<number>(PAGE_INDEX);
  const [pageSize, setPageSize] = useState<number>(PAGE_SIZE);
  const pageSizeOptions = PAGE_SIZE_OPTIONS;
  const pageItems = labels.slice(pageIndex, (pageIndex + 1) * pageSize);

  const [sortField, setSortField] = useState<keyof APMLabel>(SORT_FIELD);
  const [sortDirection, setSortDirection] = useState<Direction>(SORT_DIRECTION);
  const [totalItemCount] = useState<number>(labels.length);

  const columns: EuiBasicTableColumn<APMLabel>[] = [
    {
      field: 'key',
      name: 'Key',
      sortable: true,
      truncateText: true,
      width: '100px',
      mobileOptions: {
        show: false,
      },
    },
    {
      field: 'value',
      name: 'Value',
      truncateText: true,
      sortable: true,
      width: '100px',
      mobileOptions: {
        show: false,
      },
    },
    {
      name: 'Actions',
      width: '100px',
      actions: [
        {
          name: 'Copy',
          description: 'Copy label',
          type: 'icon',
          icon: 'copy',
          onClick: (label: APMLabel) => onCopyLabel(label),
        },
        {
          name: 'Remove',
          description: 'Remove label',
          type: 'icon',
          icon: 'trash',
          onClick: (label: APMLabel) => onRemoveLabel(label),
        },
      ],
    },
  ];

  const pagination = {
    pageIndex: pageIndex,
    pageSize: pageSize,
    totalItemCount: totalItemCount,
    pageSizeOptions: pageSizeOptions,
  };

  const sorting: EuiTableSortingType<APMLabel> = {
    sort: {
      field: sortField,
      direction: sortDirection,
    },
  };

  const selection: EuiTableSelectionType<APMLabel> = {
    onSelectionChange: (selection: APMLabel[]) => {
      const newSelectedItems = Array.from(new Set(selection));
      onSelectedLabelsChange(newSelectedItems);
    },
  };

  const tableChanged = (page: any, sort: any) => {
    setPageIndex(page.index);
    setPageSize(page.size);

    setSortField(sort.field);
    setSortDirection(sort.direction);
  };

  return (
    labels && (
      <EuiBasicTable
        items={pageItems}
        itemId="key"
        columns={columns}
        pagination={pagination}
        sorting={sorting}
        isSelectable={true}
        selection={selection}
        compressed={true}
        onChange={({ page, sort }) => tableChanged(page, sort)}
      />
    )
  );
};

export default SimulatorFormLabel;
