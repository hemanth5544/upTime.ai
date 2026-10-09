import { useEffect, useRef } from 'react';
import * as echarts from 'echarts/core';
import { HeatmapChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, VisualMapComponent } from 'echarts/components';
import { SVGRenderer } from 'echarts/renderers';

echarts.use([HeatmapChart, GridComponent, TooltipComponent, VisualMapComponent, SVGRenderer]);

export const LEVEL_COLORS = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'];

const CELL = 13; // 10px square + 3px gap
const GRID_LEFT = 34;
const GRID_TOP = 22;
const LABEL_OVERHANG = 18; // room for a month label on the last column
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Dates come as YYYY-MM-DD; parse as UTC so the weekday doesn't shift with the viewer's timezone.
const parseDate = (date) => new Date(`${date}T00:00:00Z`);

function buildOption(contributions) {
  const offset = parseDate(contributions[0].date).getUTCDay();
  const weekCount = Math.ceil((contributions.length + offset) / 7);

  // [week, weekday, level, count, date]
  const cells = contributions.map((day, i) => [
    Math.floor((i + offset) / 7),
    (i + offset) % 7,
    day.level,
    day.count,
    day.date,
  ]);

  // A month is labelled on the first column that starts in it.
  const monthLabels = Array(weekCount).fill('');
  let previousMonth = -1;
  for (let week = 0; week < weekCount; week++) {
    const firstDay = contributions[Math.max(0, week * 7 - offset)];
    const month = parseDate(firstDay.date).getUTCMonth();
    if (month !== previousMonth) monthLabels[week] = MONTHS[month];
    previousMonth = month;
  }
  // Drop a leading label that would collide with the next one.
  const secondLabel = monthLabels.findIndex((label, week) => week > 0 && label);
  if (secondLabel > 0 && secondLabel < 3) monthLabels[0] = '';

  const axisLabel = { color: '#1f2328', fontSize: 12, interval: 0 };
  const hiddenAxisParts = { axisLine: { show: false }, axisTick: { show: false }, splitLine: { show: false } };

  return {
    width: GRID_LEFT + weekCount * CELL + LABEL_OVERHANG,
    option: {
      animation: false,
      textStyle: {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif',
      },
      grid: { left: GRID_LEFT, top: GRID_TOP, width: weekCount * CELL, height: 7 * CELL },
      tooltip: {
        backgroundColor: '#25292e',
        borderWidth: 0,
        padding: [4, 8],
        textStyle: { color: '#fff', fontSize: 12 },
        formatter: ({ data }) => {
          const [, , , count, date] = data;
          const d = parseDate(date);
          const label = count === 0 ? 'No contributions' : `${count} contribution${count === 1 ? '' : 's'}`;
          return `${label} on ${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
        },
      },
      xAxis: {
        type: 'category',
        position: 'top',
        data: monthLabels.map((_, week) => week),
        ...hiddenAxisParts,
        axisLabel: { ...axisLabel, margin: 6, align: 'left', padding: [0, 0, 0, -5], formatter: (week) => monthLabels[week] },
      },
      yAxis: {
        type: 'category',
        inverse: true,
        data: DAYS,
        ...hiddenAxisParts,
        axisLabel: { ...axisLabel, margin: 8, formatter: (day) => (['Mon', 'Wed', 'Fri'].includes(day) ? day : '') },
      },
      visualMap: {
        show: false,
        type: 'piecewise',
        dimension: 2,
        pieces: LEVEL_COLORS.map((color, level) => ({ value: level, color })),
      },
      series: [
        {
          type: 'heatmap',
          data: cells,
          // The white border doubles as the gap between squares.
          itemStyle: { borderColor: '#fff', borderWidth: 3, borderRadius: 3 },
          emphasis: { itemStyle: { borderColor: '#fff', borderWidth: 2 } },
        },
      ],
    },
  };
}

export default function ContributionGraph({ contributions }) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    chartRef.current = echarts.init(containerRef.current, null, { renderer: 'svg' });
    return () => chartRef.current.dispose();
  }, []);

  useEffect(() => {
    if (!contributions?.length) return;
    const { width, option } = buildOption(contributions);
    containerRef.current.style.width = `${width}px`;
    chartRef.current.resize({ width });
    chartRef.current.setOption(option, true);
  }, [contributions]);

  return (
    <div
      ref={containerRef}
      className="heatmap"
      style={{ height: GRID_TOP + 7 * CELL + 4 }}
      role="img"
      aria-label="Contribution heat map"
    />
  );
}
