import React, { ReactNode, useState, useContext, useEffect } from 'react';

import {
    EuiBasicTable,
    EuiBasicTableColumn,
    EuiTableSortingType,
    EuiTableSelectionType,
    EuiBadge,
    EuiButtonIcon,
    Direction,
    SortDirection,
    RIGHT_ALIGNMENT
} from '@elastic/eui';

import { AVAILABLE_SIMULATIONS } from '../../Simulator';

import SimulationContext from '../../../../shared/context/SimulationContext';
import ISimulationContext from '../../../../shared/interfaces/SimulationContext';

import Simulation from '../../../../shared/interfaces/Simulation';
import SimulationExecution from '../../../../shared/interfaces/SimulationExecution';

import SimulationExecutionTableRowDetails from './SimulationExecutionTableRowDetails';

import './SimulationExecutionTable.scss';

export interface SimulationExecutionTableProps {
    onSelectedSimulationExecutionsChange: (
        simulationExecutions: SimulationExecution[]
    ) => void;
    onRemoveSimulationExecution: (
        simulationExecution: SimulationExecution
    ) => void;
}

interface SimulationExecutionTableRow {
    simulationId: string;
    id: number;
    type: string;
    maxRandomDelay: number;
    timeout: number;
    total: number;
    sent: number;
    timedOut: number;
    completed: number;
    took: number;
    min: number;
    max: number;
    avg: number;
}

interface ItemIdToExpandedRowMap {
    [id: string]: ReactNode;
}

const PAGE_INDEX = 0;
const PAGE_SIZE = 5;
const PAGE_SIZE_OPTIONS = [3, 5, 10, 15, 50, 100];
const SORT_FIELD = 'id';
const SORT_DIRECTION = SortDirection.ASC;

const SimulationExecutionTable: React.FC<SimulationExecutionTableProps> = (
    props: SimulationExecutionTableProps
) => {
    const simulationContext: ISimulationContext = useContext(SimulationContext);

    const {
        onSelectedSimulationExecutionsChange,
        onRemoveSimulationExecution
    } = props;

    const [pageIndex, setPageIndex] = useState<number>(PAGE_INDEX);
    const [pageSize, setPageSize] = useState<number>(PAGE_SIZE);
    const [pageItems, setPageItems] = useState<SimulationExecutionTableRow[]>(
        []
    );
    const [sortField, setSortField] = useState<
        keyof SimulationExecutionTableRow
    >(SORT_FIELD);
    const [sortDirection, setSortDirection] = useState<Direction>(
        SORT_DIRECTION
    );
    const [totalItemCount, setTotalItemCount] = useState<number>(0);
    const [itemIdToExpandedRowMap, setItemIdToExpandedRowMap] = useState<
        ItemIdToExpandedRowMap
    >({});

    const pageSizeOptions = PAGE_SIZE_OPTIONS;

    useEffect(() => {
        setPageItems(
            simulationContext.simulations
                .slice(pageIndex * pageSize, pageIndex * pageSize + pageSize)
                .map(
                    (
                        simulation: Simulation,
                        index: number
                    ): SimulationExecutionTableRow => {
                        return {
                            simulationId: simulation.id!,
                            id: index + 1 + pageIndex * pageSize || 0,
                            type: simulation.type!,
                            maxRandomDelay:
                                simulation.simulationRequest!.parameters
                                    .maxRandomDelay || 0,
                            timeout:
                                simulation.simulationRequest!.parameters
                                    .timeout || 0,
                            total: simulation.stats!.total || 0,
                            sent: simulation.stats!.sent || 0,
                            timedOut: simulation.stats!.timedOut || 0,
                            completed: simulation.stats!.completed || 0,
                            took: simulation.stats?.time?.took || 0,
                            min: simulation.stats?.time?.min || 0,
                            max: simulation.stats?.time?.max || 0,
                            avg: parseInt(
                                (simulation.stats?.time?.avg || 0).toFixed(2)
                            )
                        };
                    }
                )
        );
        setTotalItemCount(simulationContext.simulations.length);
    }, [pageIndex, pageSize, simulationContext.simulations]);

    const columns: EuiBasicTableColumn<SimulationExecutionTableRow>[] = [
        {
            field: 'id',
            name: '#',
            sortable: true,
            truncateText: true,
            mobileOptions: {
                show: false
            }
        },
        {
            field: 'type',
            name: 'Type',
            truncateText: false,
            width: '180px',
            sortable: true,
            mobileOptions: {
                show: false
            },
            render: (name, item) => (
                <EuiBadge
                    color={
                        AVAILABLE_SIMULATIONS.filter(
                            (simulation: Simulation) => simulation.type === name
                        )[0].color
                    }>
                    {name}
                </EuiBadge>
            )
        },
        {
            field: 'maxRandomDelay',
            name: 'Max. random delay',
            truncateText: true,
            sortable: true,
            mobileOptions: {
                show: false
            }
        },
        {
            field: 'timeout',
            name: 'Timeout in',
            truncateText: true,
            sortable: true,
            mobileOptions: {
                show: false
            }
        },
        {
            field: 'total',
            name: 'Total',
            truncateText: true,
            sortable: true,
            mobileOptions: {
                show: false
            }
        },
        {
            field: 'sent',
            name: 'Sent',
            truncateText: true,
            sortable: true,
            mobileOptions: {
                show: false
            }
        },
        {
            field: 'timedOut',
            name: 'Timed out',
            truncateText: true,
            sortable: true,
            mobileOptions: {
                show: false
            }
        },
        {
            field: 'completed',
            name: 'Completed',
            truncateText: true,
            sortable: true,
            mobileOptions: {
                show: false
            }
        },
        {
            field: 'took',
            name: 'Took (ms)',
            truncateText: true,
            sortable: true,
            mobileOptions: {
                show: false
            }
        },
        {
            field: 'min',
            name: 'Min (ms)',
            truncateText: true,
            sortable: true,
            mobileOptions: {
                show: false
            }
        },
        {
            field: 'max',
            name: 'Max (ms)',
            truncateText: true,
            sortable: true,
            mobileOptions: {
                show: false
            }
        },
        {
            field: 'avg',
            name: 'Avg (ms)',
            truncateText: true,
            sortable: true,
            mobileOptions: {
                show: false
            }
        },
        {
            name: 'Actions',
            actions: [
                {
                    name: 'Remove',
                    description: 'Remove result',
                    type: 'icon',
                    icon: 'trash',
                    onClick: (simulationExecution: SimulationExecution) =>
                        onRemoveSimulationExecution(simulationExecution)
                }
            ]
        },
        {
            align: RIGHT_ALIGNMENT,
            width: '40px',
            isExpander: true,
            render: (item: SimulationExecutionTableRow) => (
                <EuiButtonIcon
                    onClick={() => toggleSimulationDetails(item)}
                    aria-label={
                        itemIdToExpandedRowMap[item.id] ? 'Collapse' : 'Expand'
                    }
                    iconType={
                        itemIdToExpandedRowMap[item.id]
                            ? 'arrowUp'
                            : 'arrowDown'
                    }
                />
            )
        }
    ];

    const pagination = {
        pageIndex: pageIndex,
        pageSize: pageSize,
        totalItemCount: totalItemCount,
        pageSizeOptions: pageSizeOptions
    };

    const sorting: EuiTableSortingType<SimulationExecutionTableRow> = {
        sort: {
            field: sortField,
            direction: sortDirection
        }
    };

    const selection: EuiTableSelectionType<SimulationExecutionTableRow> = {
        onSelectionChange: (selection: SimulationExecutionTableRow[]) => {
            const newSelectedItems: SimulationExecutionTableRow[] = Array.from(
                new Set(selection)
            );
            onSelectedSimulationExecutionsChange(newSelectedItems);
        }
    };

    const tableChanged = (page: any, sort: any) => {
        setPageIndex(page.index);
        setPageSize(page.size);

        setSortField(sort.field);
        setSortDirection(sort.direction);
    };

    const toggleSimulationDetails = (item: SimulationExecutionTableRow) => {
        const _itemIdToExpandedRowMap: ItemIdToExpandedRowMap = {
            ...itemIdToExpandedRowMap
        };

        if (_itemIdToExpandedRowMap[item.id]) {
            delete _itemIdToExpandedRowMap[item.id];
        } else {
            const simulation: Simulation = simulationContext.simulations.filter(
                (_simulation: Simulation) =>
                    _simulation.id === item.simulationId
            )[0];

            _itemIdToExpandedRowMap[item.id] = (
                <SimulationExecutionTableRowDetails
                    simulationId={simulation!.id!}
                />
            );
        }
        setItemIdToExpandedRowMap(_itemIdToExpandedRowMap);
    };

    return (
        simulationContext.simulations && (
            <EuiBasicTable
                items={pageItems}
                itemId="id"
                columns={columns}
                pagination={pagination}
                sorting={sorting}
                isSelectable={true}
                selection={selection}
                itemIdToExpandedRowMap={itemIdToExpandedRowMap}
                isExpandable={true}
                onChange={({ page, sort }) => tableChanged(page, sort)}
            />
        )
    );
};

export default SimulationExecutionTable;
