import React, { ReactNode, useState, useContext, useEffect } from 'react';

import { EuiBasicTable, EuiBasicTableColumn, EuiBadge } from '@elastic/eui';

import { AVAILABLE_SIMULATIONS } from '../../Simulator';

import SimulationContext from '../../../../shared/context/SimulationContext';
import ISimulationContext from '../../../../shared/interfaces/SimulationContext';

import Request from '../../../../shared/interfaces/Request';
import SimulationRequest from '../../../../shared/interfaces/SimulationRequest';
import SimulationRequestResult from '../../../../shared/interfaces/SimulationRequestResult';

import './SimulationExecutionTable.scss';
import BackendResponse from '../../../../shared/interfaces/BackendResponse';
import Simulation from '../../../../shared/interfaces/Simulation';
import BackendSuccess from '../../../../shared/interfaces/BackendSuccess';
import BackendError from '../../../../shared/interfaces/BackendError';
import SimulationRequestError from '../../../../shared/interfaces/SimulationRequestError';
import BackendResponseMetadata from '../../../../shared/interfaces/BackendResponseMetadata';
import HostMetadata from '../../../../shared/interfaces/HostMetadata';
import KubernetesMetadata from '../../../../shared/interfaces/KubernetesMetadata';
import { EuiListGroup } from '@elastic/eui';
import { EuiListGroupItem } from '@elastic/eui';

export interface SimulationExecutionRequestsTableProps {
    simulationId: string;
    onCancelRequest?: (request: SimulationExecutionRequestsTableRow) => void;
    onRetryRequest?: (request: SimulationExecutionRequestsTableRow) => void;
    onSelectedRequestsChange?: (
        requests: SimulationExecutionRequestsTableRow[]
    ) => void;
}

interface SimulationExecutionRequestsTableRow {
    requestId: string;
    id: number;
    endpoint: string;
    statusCode?: number;
    statusMessage?: string;
    errors?: SimulationRequestError[];
    metadata?: BackendResponseMetadata;
}

const SimulationExecutionRequestsTable: React.FC<SimulationExecutionRequestsTableProps> = (
    props: SimulationExecutionRequestsTableProps
) => {
    const simulationContext: ISimulationContext = useContext(SimulationContext);

    const {
        simulationId,
        onCancelRequest,
        onRetryRequest,
        onSelectedRequestsChange
    } = props;

    const [pageItems, setPageItems] = useState<
        SimulationExecutionRequestsTableRow[]
    >([]);

    const simulation:
        | Simulation
        | undefined = simulationContext.simulations.find(
        s => s.id === simulationId
    );
    const requests: Request<
        SimulationRequest,
        | BackendSuccess<SimulationRequestResult>
        | BackendError<SimulationRequestError>
    >[] = simulation!.requests!;

    useEffect(() => {
        if (requests) {
            const pageItems: SimulationExecutionRequestsTableRow[] = requests.map(
                (
                    request: Request<
                        SimulationRequest,
                        | BackendSuccess<SimulationRequestResult>
                        | BackendError<SimulationRequestError>
                    >,
                    index: number
                ): SimulationExecutionRequestsTableRow => {
                    const pageItem: SimulationExecutionRequestsTableRow = {
                        requestId: request.id!,
                        id: index + 1,
                        endpoint: request.request.endpoint
                    };

                    if (request.response) {
                        pageItem.metadata = request.response.metadata;
                        pageItem.statusCode = request.response.statusCode;
                        pageItem.statusMessage = request.response.statusMessage;

                        if (!request.response.success) {
                            pageItem.errors = (request.response
                                .body as BackendError<
                                SimulationRequestError
                            >).errors!;
                        }
                    }

                    return pageItem;
                }
            );

            setPageItems(pageItems);
        }
    }, [simulation]);

    const columns: EuiBasicTableColumn<
        SimulationExecutionRequestsTableRow
    >[] = [
        {
            field: 'id',
            name: '#',
            width: '80px',
            sortable: true,
            truncateText: true,
            mobileOptions: {
                show: false
            }
        },
        {
            field: 'host',
            name: 'Host',
            width: '300px',
            truncateText: true,
            sortable: true,
            mobileOptions: {
                show: false
            },
            render: (name, item) =>
                item.metadata && item.metadata.host
                    ? renderHostMetadata(item.metadata.host)
                    : ''
        },
        {
            field: 'k8s',
            name: 'Kubernetes',
            width: '300px',
            truncateText: true,
            sortable: true,
            mobileOptions: {
                show: false
            },
            render: (name, item) =>
                item.metadata && item.metadata.kubernetes
                    ? renderKubernetesMetadata(item.metadata.kubernetes)
                    : ''
        },
        {
            field: 'endpoint',
            name: 'Endpoint',
            truncateText: true,
            sortable: true,
            mobileOptions: {
                show: false
            }
        },
        {
            field: 'result',
            name: 'Result',
            truncateText: false,
            sortable: true,
            mobileOptions: {
                show: false
            },
            render: (name, item) =>
                renderRequestResult(
                    item.statusCode,
                    item.statusMessage,
                    item.errors
                )
        },
        {
            name: 'Actions',
            actions: [
                {
                    name: 'Cancel',
                    description: 'Cancel request',
                    type: 'icon',
                    icon: 'stop',
                    onClick: (request: SimulationExecutionRequestsTableRow) =>
                        onCancelRequest ? onCancelRequest(request) : null
                },
                {
                    name: 'Retry',
                    description: 'Retry request',
                    type: 'icon',
                    icon: 'play',
                    onClick: (request: SimulationExecutionRequestsTableRow) =>
                        onRetryRequest ? onRetryRequest(request) : null
                }
            ]
        }
    ];

    const renderHostMetadata = ({
        hostname,
        type,
        arch,
        platform,
        release,
        uptime,
        loadavg,
        totalmem,
        freemem
    }: Partial<HostMetadata>) => {
        const usedMemory: string =
            freemem && totalmem
                ? ((totalmem - freemem) / totalmem).toFixed(2) + '%'
                : '?';
        const _loadavg: string = loadavg
            ? loadavg[0].toFixed(2) +
              '/' +
              loadavg[1].toFixed(2) +
              '/' +
              loadavg[2].toFixed(2)
            : '?';

        return (
            <span>
                <strong>Hostname: </strong>
                {hostname}
                <br />
                <strong>OS: </strong>
                {type}, {arch}, {platform}, {release}
                <br />
                <strong>uptime: </strong>
                {uptime}
                <br />
                <strong>loadavg: </strong>
                {_loadavg}
                <br />
                <strong>mem: </strong>
                {usedMemory}
            </span>
        );
    };

    const renderKubernetesMetadata = ({
        kubernetesNodeName,
        kubernetesNamespace,
        kubernetesPodName,
        kubernetesPodUid
    }: Partial<KubernetesMetadata>) => {
        return (
            <span>
                <strong>Node: </strong>
                {kubernetesNodeName}
                <br />
                <strong>Namespace: </strong>
                {kubernetesNamespace}
                <br />
                <strong>Pod: </strong>
                {kubernetesPodName}
            </span>
        );
    };

    const renderRequestResult = (
        statusCode?: number,
        statusMessage?: string,
        errors?: SimulationRequestError[]
    ) => {
        if (!statusCode || !statusMessage) return '';

        let color: string;

        if (statusCode >= 200 && statusCode < 300) {
            color = 'green';
        } else if (statusCode >= 300 && statusCode < 400) {
            color = 'orange';
        } else if (statusCode >= 400 && statusCode < 500) {
            color = 'red';
        } else if (statusCode >= 500) {
            color = 'purple';
        } else {
            color = 'black';
        }

        let errorList = null;
        if (errors) {
            errorList = (
                <EuiListGroup wrapText={true}>
                    {errors.map((e: SimulationRequestError, index: number) =>
                        e.category !== 'http' ? (
                            <EuiListGroupItem
                                key={index}
                                size="s"
                                iconType="alert"
                                label={e.message}
                            />
                        ) : null
                    )}
                </EuiListGroup>
            );
        }

        return (
            <div>
                <span style={{ color: color, fontWeight: 'bold' }}>
                    {statusCode} {statusMessage}
                </span>
                <br />
                {errorList}
            </div>
        );
    };

    return (
        simulationContext.simulations && (
            <EuiBasicTable
                items={pageItems}
                itemId="id"
                columns={columns}
                compressed={true}
            />
        )
    );
};

export default SimulationExecutionRequestsTable;
