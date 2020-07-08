import React from 'react';

import { EuiStat } from '@elastic/eui';
import { SimulationStatsAggregatedTotals } from './SimulationStats';

export interface SimulationStatsMetricProps {
    title?: string;
    simulationStatsMetric: SimulationStatsMetric;
    simulationStatsAggregatedTotals: Partial<SimulationStatsAggregatedTotals>;
}

type SimulationStatsMetricType =
    | 'simulations'
    | 'requests'
    | 'requests-sent'
    | 'requests-completed'
    | 'requests-timedout'
    | 'requests-avg-time'
    | 'requests-min-time'
    | 'requests-max-time';

interface SimulationStatsMetric {
    type: SimulationStatsMetricType;
    name: string;
    description?: string;
    order?: number;
    unit?: string;
    isLoading?: boolean;
}

const SimulationStatsMetric: React.FC<SimulationStatsMetricProps> = (
    props: SimulationStatsMetricProps
) => {
    const {
        title,
        simulationStatsMetric,
        simulationStatsAggregatedTotals
    } = props;

    const getMetricValue = (
        simulationAggregatedTotals: Partial<SimulationStatsAggregatedTotals>,
        metricType: string,
        includeUnits: boolean = true
    ): number | string | undefined => {
        let metricValue: number | undefined;
        switch (metricType) {
            case 'simulations':
                metricValue = simulationAggregatedTotals.total;
                break;
            case 'requests':
                metricValue = simulationAggregatedTotals.requests?.total;
                break;
            case 'requests-sent':
                metricValue = simulationAggregatedTotals.requests?.sent;
                break;
            case 'requests-completed':
                metricValue = simulationAggregatedTotals.requests?.completed;
                break;
            case 'requests-timedout':
                metricValue = simulationAggregatedTotals.requests?.timedOut;
                break;
            case 'requests-avg-time':
                metricValue = simulationAggregatedTotals.requests?.time?.avg;
                break;
            case 'requests-min-time':
                metricValue = simulationAggregatedTotals.requests?.time?.min;
                break;
            case 'requests-max-time':
                metricValue = simulationAggregatedTotals.requests?.time?.max;
                break;
            default:
                return;
        }

        return includeUnits
            ? metricValue + (simulationStatsMetric.unit || '')
            : metricValue;
    };

    return (
        <EuiStat
            title={getMetricValue(
                simulationStatsAggregatedTotals,
                simulationStatsMetric.type,
                true
            )}
            description={title || simulationStatsMetric.name}
            titleColor="default"
            isLoading={simulationStatsMetric.isLoading || false}
            reverse
        />
    );
};

export default SimulationStatsMetric;
