import React from "react";
// Import Highcharts
import Highcharts from "highcharts";
import drilldown from "highcharts/modules/drilldown.js";
import HighchartsReact from "highcharts-react-official";
import HC_more from "highcharts/highcharts-more"; //module
//import HighchartsReact from "./HighchartsReact.min.js";
drilldown(Highcharts);
require("highcharts/modules/draggable-points")(Highcharts);
require("highcharts/modules/accessibility")(Highcharts);
HC_more(Highcharts); //init module

export default class WorkloadChart extends React.Component {
  constructor(props) {
    super(props);
    this.allowChartUpdate = true;
    this.state = {
      updateData: props.updateData,
      data: props.data,
      onDrop: props.onDrop,
    };
  }

  componentDidMount() {
    // const chart = this.refs.chartComponent.chart;
  }

  render() {
    const config = {
      chart: {
        animation: false,
      },
      caption: {
        text: "Adjust this chart to match the intensity of this course's workload from the beginning to the end of semester",
      },
      title: {
        text: "Workload",
      },
      legend: {
        enabled: false,
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
        series: {
          dragDrop: {
            draggableY: true,
            dragMaxY: 5,
            dragMinY: 0,
          },
          point: {
            events: {
              drop: (e) => {
                const newData = this.state.onDrop(e);
                this.setState({ data: newData });
              },
            },
          },
        },
        line: {
          cursor: "ns-resize",
        },
      },
      tooltip: {
        valueDecimals: 1,
      },
      series: [
        {
          data: this.state.data.map((v) => {
            return { y: v };
          }),
        },
      ],
    };
    return (
          <HighchartsReact
            allowChartUpdate={this.allowChartUpdate}
            // ref={"chartComponent"}
            highcharts={Highcharts}
            options={config}
          />
    );
  }
}
