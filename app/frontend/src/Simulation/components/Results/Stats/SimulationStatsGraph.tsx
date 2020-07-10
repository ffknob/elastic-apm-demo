import React from 'react';

import {
    Chart,
    Settings,
    Axis,
    LineSeries,
    niceTimeFormatByDay,
    timeFormatter
} from '@elastic/charts';

export interface SimulationStatsGraphSeries {
    id: string;
    name: string;
    color: string;
    data: Array<[number, number]>;
}

export interface SimulationStatsGraphProps {
    simulationStatsGraphSeries: {
        [series: string]: SimulationStatsGraphSeries;
    };
}

const SimulationStatsGraph: React.FC<SimulationStatsGraphProps> = (
    props: SimulationStatsGraphProps
) => {
    const { simulationStatsGraphSeries } = props;

    return (
        <Chart size={{ height: 200 }}>
            <Settings showLegend legendPosition="bottom" />
            <Axis
                title={new Date().toISOString()}
                id="bottom-axis"
                position="bottom"
                tickFormat={timeFormatter(niceTimeFormatByDay(1))}
                showGridLines
            />
            <Axis id="left-axis" position="left" showGridLines />

            {Object.keys(simulationStatsGraphSeries).map((k: string) => (
                <LineSeries
                    key={k}
                    id={simulationStatsGraphSeries[k].id}
                    name={simulationStatsGraphSeries[k].name}
                    data={simulationStatsGraphSeries[k].data}
                    xScaleType="time"
                    xAccessor={0}
                    yAccessors={[1]}
                    color={simulationStatsGraphSeries[k].color}
                />
            ))}
        </Chart>
    );
};

export default SimulationStatsGraph;
