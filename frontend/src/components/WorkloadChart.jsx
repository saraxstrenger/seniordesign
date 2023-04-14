import React, { useEffect, useState } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
require("highcharts/modules/draggable-points")(Highcharts);

const WorkloadChart = (props) => {
  // console.log(props)
  const { data, onDrop, editMode, height, width } = props;
  // const [editMode, setEditMode] = useState(false);
  const [chartOptions, setChartOptions] = useState({});
  const [chartData, setChartData] = useState(data);

  useEffect(() => {
    const canEdit = {
      title: {
        text: "Workload",
      },
      tooltip: {
        valueDecimals: 1,
      },
      chart: {
        animation: false,
        width: width,
        height: height,
      },
      legend: {
        enabled: false,
      },
      series: [
        {
          data: chartData.map((v) => {
            return { y: v };
          }),
        },
      ],
      caption: {
        text: "Adjust this chart to match the intensity of this course's workload from the beginning to the end of semester",
      },
      yAxis: {
        title: { text: "Work required" },
        min: 0,
        max: 5,
      },
      xAxis: {
        title: { text: "Quarters of course" },
        accessibility: {
          description: "Quarter of course from beginning to end.",
        },
        categories: [1, 2, 3, 4],
      },
      plotOptions: {
        line: {
          cursor: "ns-resize",
        },
        series: {
          dragDrop: {
            draggableY: true,
            dragMaxY: 5,
            dragMinY: 0,
          },
          point: {
            events: {
              drop: (e) => {
                const newData = onDrop(e);
                console.log(newData);
                setChartData(newData);
              },
            },
          },
        },
      },
    };
    const cannotEdit = {
      chart: {
        animation: false,
        width: width,
        height: height,
      },
      tooltip: {
        valueDecimals: 1,
      },
      xAxis: {
        title: { text: "Quarters of course" },
        accessibility: {
          description: "Quarter of course from beginning to end.",
        },
        categories: [1, 2, 3, 4],
      },
      yAxis: {
        title: { text: "Work required" },
        min: 0,
        max: 5,
      },
      caption: {
        text: "",
      },

      title: {
        text: "Workload",
      },
      legend: {
        enabled: false,
      },
      series: [
        {
          data: chartData.map((v) => {
            return { y: v };
          }),
        },
      ],
      plotOptions: {
        line: {
          cursor: "default",
        },
        series: {
          dragDrop: {
            draggableY: false,
          },
        },
      },
    };
    if (editMode) {
      setChartOptions(canEdit);
    } else {
      setChartOptions(cannotEdit);
    }
  }, [editMode, width, height, onDrop, chartData]);

  return (
    <div style={{ width: 700, height: "fit-content" }}>
      {editMode ? "Edit mode" : "View mode"}
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default WorkloadChart;
