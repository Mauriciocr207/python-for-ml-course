import ReactECharts from "echarts-for-react";

export default function BarChart({ values, selectedClass }: { values: number[], selectedClass: number }) {
    const barOptions = {
      xAxis: {
        type: "category",
        data: Array.from({ length: 10 }, (_, i) => `${i}`),
        axisLabel: {
          fontSize: 16, // tamaño de texto del eje X
          color: "#333",
        },
      },
      yAxis: {
        type: "value",
        min: 0,
        max: 1,
        axisLabel: {
          fontSize: 16, // tamaño de texto del eje Y
          color: "#333",
        },
      },
      series: [
        {
          data: values.map((value, idx) => {
            return idx === selectedClass
              ? {
                  value,
                  itemStyle: {
                    borderRadius: [6, 6, 0, 0],
                    color: "#5470c6",
                  },
                }
              : value;
          }),
          type: "bar",
          barWidth: "50%",
          itemStyle: {
            borderRadius: [6, 6, 0, 0],
            color: "#91cc75",
          },
        },
      ],
      tooltip: {
        trigger: "axis",
      },
      grid: {
        top: 30,
        bottom: 30,
        left: 40,
        right: 20,
      },
    };
  return (
    <div className="w-[472px] h-[472px]">
      <ReactECharts
        option={barOptions}
        style={{ height: "100%", width: "100%" }}
      />
    </div>
  );
}
