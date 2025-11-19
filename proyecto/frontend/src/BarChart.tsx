import ReactECharts from "echarts-for-react";

export default function BarChart({ values, selectedClass }: { values: number[], selectedClass: number }) {
    const barOptions = {
      xAxis: {
        type: "category",
        data: Array.from({ length: 10 }, (_, i) => `${i}`),
        axisLabel: {
          fontSize: 16, // tamaño de texto del eje X
          color: "white",
        },
      },
      yAxis: {
        type: "value",
        min: 0,
        max: 1,
        axisLabel: {
          fontSize: 16, // tamaño de texto del eje Y
          color: "white",
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
                    color: "#bd34fe",
                  },
                }
              : value;
          }),
          type: "bar",
          barWidth: "50%",
          itemStyle: {
            borderRadius: [6, 6, 0, 0],
            color: "#41d1ff",
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
    <div className="w-[380px] h-[380px]">
      <ReactECharts
        option={barOptions}
        style={{ height: "100%", width: "100%" }}
      />
    </div>
  );
}
