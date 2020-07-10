import React, { useContext, useState, useEffect } from 'react';

import { EuiFlexGroup, EuiFlexItem, EuiRadioGroup } from '@elastic/eui';

import SimulationContext from '../../../../shared/context/SimulationContext';
import ISimulationContext from '../../../../shared/interfaces/SimulationContext';

import Simulation from '../../../../shared/interfaces/Simulation';

import SimulationStatsMetric from './SimulationStatsMetric';
import SimulationStatsGraph, {
    SimulationStatsGraphSeries
} from './SimulationStatsGraph';
import SimulationType from '../../../../shared/types/SimulationType';

export interface SimulationStatsProps {}

const SIMULATION_STATS_METRICS: SimulationStatsMetric[] = [
    {
        type: 'simulations',
        name: 'Simulations',
        order: 10
    },
    {
        type: 'requests',
        name: 'Requests',
        order: 20
    },
    {
        type: 'requests-sent',
        name: 'Requests sent',
        order: 30
    },
    {
        type: 'requests-completed',
        name: 'Requests completed',
        order: 40
    },
    {
        type: 'requests-timedout',
        name: 'Requests timed out',
        order: 50
    },
    {
        type: 'requests-avg-time',
        name: 'Requests avg time',
        order: 60,
        unit: 'ms'
    },
    {
        type: 'requests-min-time',
        name: 'Requests min time',
        order: 70,
        unit: 'ms'
    },
    {
        type: 'requests-max-time',
        name: 'Requests max time',
        order: 80,
        unit: 'ms'
    }
];

interface SimulationStatsRequestsMetrics {
    total: number;
    sent: number;
    completed: number;
    timedOut: number;
    time: {
        avg: number;
        min: number;
        max: number;
    };
}

interface SimulationDataTimeSeriesMeasure {
    date: Date;
    simulationType: SimulationType;
    total: number;
    requests: Partial<SimulationStatsRequestsMetrics>;
}

export interface SimulationStatsAggregatedTotals {
    total: number;
    requests: Partial<SimulationStatsRequestsMetrics>;
}

interface SimulationStatsAggregatedData {
    id: string;
    requests: {
        total: number;
        sent: number;
        completed: number;
        timedOut: number;
    };
}

interface SimulationStatsAggregatedAttributes {
    name: string;
    color: string;
    order?: number;
}

type SimulationTypeStatsAggregated = SimulationStatsAggregatedAttributes & {
    data: SimulationStatsAggregatedData[];
    timeSeries: SimulationDataTimeSeriesMeasure[];
    totals: Partial<SimulationStatsAggregatedTotals>;
};

interface SimulationTypesStatsAggregated {
    [simulationType: string]: SimulationTypeStatsAggregated;
}

const SIMULATION_STATS_AGGREGATED_TOTALS_DEFAULTS: SimulationStatsAggregatedTotals = {
    total: 0,
    requests: {
        total: 0,
        sent: 0,
        completed: 0,
        timedOut: 0,
        time: {
            avg: 0,
            min: 0,
            max: 0
        }
    }
};
const SIMULATION_TYPES_STATS_AGGREGATED: SimulationTypesStatsAggregated = {
    success: {
        name: 'Success',
        color: '#017D73', //'secondary',
        order: 10,
        data: [],
        timeSeries: [],
        totals: SIMULATION_STATS_AGGREGATED_TOTALS_DEFAULTS
    },
    'thrown-error': {
        name: 'Thrown Error',
        color: '#BD271E', //'danger'
        order: 20,
        data: [],
        timeSeries: [],
        totals: SIMULATION_STATS_AGGREGATED_TOTALS_DEFAULTS
    },
    'captured-error': {
        name: 'Captured Error',
        color: '#F5A700', //'warning'
        order: 30,
        data: [],
        timeSeries: [],
        totals: SIMULATION_STATS_AGGREGATED_TOTALS_DEFAULTS
    },
    'complex-transaction': {
        name: 'Complex Transaction',
        color: '#000000', //'text'
        order: 40,
        data: [],
        timeSeries: [],
        totals: SIMULATION_STATS_AGGREGATED_TOTALS_DEFAULTS
    },
    'distributed-transaction': {
        name: 'Distributed Transaction',
        color: '#006BB4', //'primary'
        order: 50,
        data: [],
        timeSeries: [],
        totals: SIMULATION_STATS_AGGREGATED_TOTALS_DEFAULTS
    }
};

const SimulationStats: React.FC<SimulationStatsProps> = (
    props: SimulationStatsProps
) => {
    const simulationContext: ISimulationContext = useContext(SimulationContext);

    const [
        simulationTypesStatsAggregated,
        setSimulationTypesStatsAggregated
    ] = useState<SimulationTypesStatsAggregated>(
        SIMULATION_TYPES_STATS_AGGREGATED
    );
    const [
        selectedSimulationStatsMetric,
        setSelectedSimulationStatsMetric
    ] = useState<SimulationStatsMetric>(SIMULATION_STATS_METRICS[0]);

    const simulations: Simulation[] = simulationContext.simulations;

    useEffect(() => {
        const _simulationTypesStatsAggregated: SimulationTypesStatsAggregated = simulations.reduce<
            SimulationTypesStatsAggregated
        >(simulationStatsReducer, simulationTypesStatsAggregated);
        setSimulationTypesStatsAggregated(_simulationTypesStatsAggregated);
    }, [simulations]);

    const simulationStatsReducer = (
        simulationTypesStatsAggregated: SimulationTypesStatsAggregated,
        simulation: Simulation
    ): SimulationTypesStatsAggregated => {
        const simulationType: SimulationType = simulation.type;
        const _simulationTypesStatsAggregated: SimulationTypesStatsAggregated = simulationTypesStatsAggregated;
        let simulationTypeStatsAggregated: SimulationTypeStatsAggregated =
            _simulationTypesStatsAggregated[simulationType];

        const requests = {
            total: simulation.requests?.length || 0,
            sent: simulation.stats?.sent || 0,
            completed: simulation.stats?.completed || 0,
            timedOut: simulation.stats?.timedOut || 0,
            time: {
                avg: simulation.stats?.time?.avg || 0,
                min: simulation.stats?.time?.min || 0,
                max: simulation.stats?.time?.max || 0
            }
        };

        if (
            !simulationTypeStatsAggregated.data
                ?.map((s: SimulationStatsAggregatedData) => s.id)
                .includes(simulation.id!)
        ) {
            simulationTypeStatsAggregated = {
                ...simulationTypeStatsAggregated,
                totals: {
                    total: (simulationTypeStatsAggregated.totals.total || 0) + 1
                }
            };

            simulationTypeStatsAggregated.data.push({
                id: simulation.id!,
                requests: requests
            });
        }

        let total: number | undefined =
            simulationTypeStatsAggregated.totals.requests?.total;
        let sent: number | undefined =
            simulationTypeStatsAggregated.totals.requests?.sent;
        let completed: number | undefined =
            simulationTypeStatsAggregated.totals.requests?.completed || 0;
        let timedOut: number | undefined =
            simulationTypeStatsAggregated.totals.requests?.timedOut || 0;
        let min: number | undefined =
            simulationTypeStatsAggregated.totals.requests?.time?.min || 0;
        let max: number | undefined =
            simulationTypeStatsAggregated.totals.requests?.time?.max || 0;
        let avg: number | undefined =
            simulationTypeStatsAggregated.totals.requests?.time?.avg || 0;

        if (simulation.stats) {
            const simulationData: SimulationStatsAggregatedData = {
                id: simulation.id!,
                requests: {
                    total: simulation.stats.total!,
                    sent: simulation.stats.sent!,
                    completed: simulation.stats.completed!,
                    timedOut: simulation.stats.timedOut!
                }
            };

            simulationTypeStatsAggregated.data = simulationTypeStatsAggregated.data!.filter(
                (s: SimulationStatsAggregatedData) => s.id !== simulation.id
            );

            simulationTypeStatsAggregated.data.push(simulationData);

            total = simulationTypeStatsAggregated.data.reduce<number>(
                (
                    total: number,
                    simulationData: SimulationStatsAggregatedData
                ) => total + simulationData.requests.total,
                0
            );
            sent = simulationTypeStatsAggregated.data.reduce<number>(
                (
                    total: number,
                    simulationData: SimulationStatsAggregatedData
                ) => total + simulationData.requests.sent,
                0
            );
            completed = simulationTypeStatsAggregated.data.reduce<number>(
                (
                    total: number,
                    simulationData: SimulationStatsAggregatedData
                ) => total + simulationData.requests.completed,
                0
            );
            timedOut = simulationTypeStatsAggregated.data.reduce<number>(
                (
                    total: number,
                    simulationData: SimulationStatsAggregatedData
                ) => total + simulationData.requests.timedOut,
                0
            );

            if (simulation.stats.time?.min) {
                if (!simulationTypeStatsAggregated.totals.requests?.time?.min) {
                    min = simulation.stats.time.min;
                } else {
                    min =
                        simulationTypeStatsAggregated.totals.requests!.time!
                            .min > simulation.stats!.time!.min
                            ? simulation.stats!.time!.min
                            : simulationTypeStatsAggregated.totals.requests!
                                  .time!.min;
                }
            }

            if (simulation.stats.time?.max) {
                if (!simulationTypeStatsAggregated.totals.requests?.time?.max) {
                    max = simulation.stats.time.max;
                } else {
                    max =
                        simulationTypeStatsAggregated.totals.requests!.time!
                            .max < simulation.stats!.time!.max
                            ? simulation.stats!.time!.max
                            : simulationTypeStatsAggregated.totals.requests!
                                  .time!.max;
                }
            }

            if (simulation.stats.time?.avg) {
                if (!simulationTypeStatsAggregated.totals.requests?.time?.avg) {
                    avg = simulation.stats.time.avg;
                } else {
                    avg =
                        (simulationTypeStatsAggregated.totals.requests!.time!
                            .avg +
                            simulation.stats!.time!.avg) /
                        2;
                }
            }
        }

        if (
            total !== simulationTypeStatsAggregated.totals.total ||
            sent !== simulationTypeStatsAggregated.totals.requests?.sent ||
            completed !==
                simulationTypeStatsAggregated.totals.requests?.completed ||
            timedOut !==
                simulationTypeStatsAggregated.totals.requests.timedOut ||
            avg !== simulationTypeStatsAggregated.totals.requests.time?.avg ||
            min !== simulationTypeStatsAggregated.totals.requests.time?.min ||
            max !== simulationTypeStatsAggregated.totals.requests.time?.max
        ) {
            const timeSeries: SimulationDataTimeSeriesMeasure = {
                date: new Date(),
                simulationType: simulationType,
                total: simulationTypeStatsAggregated.totals!.total!,
                requests: {
                    total,
                    sent,
                    completed,
                    timedOut,
                    time: {
                        avg,
                        min,
                        max
                    }
                }
            };

            simulationTypeStatsAggregated.timeSeries.push(timeSeries);
        }

        _simulationTypesStatsAggregated[simulationType] = {
            ...simulationTypeStatsAggregated,
            totals: {
                ...simulationTypeStatsAggregated.totals,
                requests: {
                    ...simulationTypeStatsAggregated.totals.requests,
                    total: total,
                    sent: sent,
                    completed: completed,
                    timedOut: timedOut,
                    time: {
                        avg: parseInt(avg.toFixed(2)),
                        min: min,
                        max: max
                    }
                }
            }
        };

        return _simulationTypesStatsAggregated;
    };

    const getMetricTimeSeriesValue = (
        timeSeries: SimulationDataTimeSeriesMeasure,
        metricType: string
    ): number | undefined => {
        let metricTimeSeriesValue: number | undefined;

        switch (metricType) {
            case 'simulations':
                metricTimeSeriesValue = timeSeries.total;
                break;
            case 'requests':
                metricTimeSeriesValue = timeSeries.requests.total;
                break;
            case 'requests-sent':
                metricTimeSeriesValue = timeSeries.requests.sent;
                break;
            case 'requests-completed':
                metricTimeSeriesValue = timeSeries.requests.completed;
                break;
            case 'requests-timedout':
                metricTimeSeriesValue = timeSeries.requests.timedOut;
                break;
            case 'requests-avg-time':
                metricTimeSeriesValue = timeSeries.requests.time?.avg;
                break;
            case 'requests-min-time':
                metricTimeSeriesValue = timeSeries.requests.time?.min;
                break;
            case 'requests-max-time':
                metricTimeSeriesValue = timeSeries.requests.time?.max;
                break;
            default:
                return;
        }

        return metricTimeSeriesValue;
    };

    const getMetricTimeSeries = (
        simulationTypesStatsAggregated: SimulationTypesStatsAggregated,
        metricType: string
    ): {
        [series: string]: SimulationStatsGraphSeries;
    } => {
        let metricTimeSeries: {
            [series: string]: SimulationStatsGraphSeries;
        } = {};

        Object.keys(simulationTypesStatsAggregated).forEach((k: string) => {
            simulationTypesStatsAggregated[k].timeSeries.forEach(
                (t: SimulationDataTimeSeriesMeasure) => {
                    const value: number | undefined = getMetricTimeSeriesValue(
                        t,
                        metricType
                    );

                    if (value) {
                        if (!metricTimeSeries[t.simulationType]) {
                            metricTimeSeries[t.simulationType] = {
                                id: k,
                                name: simulationTypesStatsAggregated[k].name,
                                color: simulationTypesStatsAggregated[k].color,
                                data: [[t.date.getTime(), value]]
                            };
                        } else {
                            const time = t.date.getTime();
                            metricTimeSeries[t.simulationType].data = [
                                ...metricTimeSeries[t.simulationType].data,
                                [time, value]
                            ];
                        }
                    }
                }
            );
        });

        return metricTimeSeries;
    };

    return (
        <div>
            <EuiFlexGroup>
                <EuiFlexItem grow={2}>
                    <EuiRadioGroup
                        name="Metrics"
                        options={SIMULATION_STATS_METRICS.map(
                            (m: SimulationStatsMetric) => ({
                                id: m.type,
                                label: m.name
                            })
                        )}
                        idSelected={selectedSimulationStatsMetric.type}
                        onChange={(id: string, value?: string) =>
                            setSelectedSimulationStatsMetric(
                                SIMULATION_STATS_METRICS.find(
                                    (m: SimulationStatsMetric) => m.type === id
                                ) || SIMULATION_STATS_METRICS[0]
                            )
                        }
                        legend={{
                            children: <span>Choose a metric:</span>
                        }}
                    />
                </EuiFlexItem>

                <EuiFlexItem grow={8}>
                    <EuiFlexGroup direction="column">
                        <EuiFlexItem>
                            <EuiFlexGroup>
                                {Object.keys(
                                    simulationTypesStatsAggregated
                                ).map((k: string) => (
                                    <EuiFlexItem key={k}>
                                        <SimulationStatsMetric
                                            title={
                                                simulationTypesStatsAggregated[
                                                    k
                                                ].name
                                            }
                                            simulationStatsMetric={
                                                selectedSimulationStatsMetric
                                            }
                                            simulationStatsAggregatedTotals={
                                                simulationTypesStatsAggregated[
                                                    k
                                                ].totals
                                            }
                                        />
                                    </EuiFlexItem>
                                ))}
                            </EuiFlexGroup>
                        </EuiFlexItem>
                        <EuiFlexItem>
                            <SimulationStatsGraph
                                simulationStatsGraphSeries={getMetricTimeSeries(
                                    simulationTypesStatsAggregated,
                                    selectedSimulationStatsMetric.type
                                )}
                            />
                        </EuiFlexItem>
                    </EuiFlexGroup>
                </EuiFlexItem>
            </EuiFlexGroup>
        </div>
    );
};

export default SimulationStats;
