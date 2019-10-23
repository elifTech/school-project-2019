import React, { PureComponent } from 'react';
import Chart from 'chart.js';
import PropTypes from 'prop-types';
import { setData } from '../WaterQualitySensor/HelperChartData';

class DoughnutChart extends PureComponent {
  static propTypes = {
    labels: PropTypes.arrayOf(PropTypes.string),
    waterStructure: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    labels: [],
    waterStructure: [],
  };

  constructor(props) {
    super(props);
    this.chartRef = React.createRef();
  }

  componentDidMount() {
    this.buildChart();
  }

  // componentDidUpdate() {
  //   const { waterStructure, labels } = this.props;
  //   this.myDoughnutChart.data.labels = labels;
  //   this.myDoughnutChart.data.datasets[0].data = waterStructure;
  //   this.myDoughnutChart.update();
  // }

  render() {
    return (
      <div>
        <canvas
          className="py-2"
          height="80h"
          id="myChart"
          ref={this.chartRef}
        />
      </div>
    );
  }

  colors = ['#ded58f', '#c5f582', '#70cad1', '#c66d6a', '#8c86b0', '#cf8fc8'];

  buildChart = () => {
    const { waterStructure, labels } = this.props;
    const myChartReference = this.chartRef.current;
    this.myDoughnutChart = new Chart(myChartReference, {
      data: setData(waterStructure, labels, this.colors),
      options: {
        legend: {
          labels: {
            fontSize: 14,
            padding: 20,
          },
          position: 'right',
        },
      },
      type: 'doughnut',
    });
  };
}

export default React.memo(DoughnutChart);
