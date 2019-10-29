import React, { PureComponent } from 'react';
import Chart from 'chart.js';
import PropTypes from 'prop-types';
import { setData } from '../WaterQualitySensor/HelperChartData';
import 'chartjs-plugin-labels';

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

  render() {
    return (
      <div>
        <canvas
          className="py-2"
          id="myChart"
          height="110"
          ref={this.chartRef}
        />
      </div>
    );
  }

  colors = ['#eac879', '#f58671', '#70cad1', '#a2d76e'];

  buildChart = () => {
    const { waterStructure, labels } = this.props;
    const myChartReference = this.chartRef.current;
    this.myDoughnutChart = new Chart(myChartReference, {
      data: setData(waterStructure, labels, false, this.colors),
      options: {
        legend: {
          labels: {
            fontSize: 14,
            padding: 20,
          },
          position: 'right',
        },
        plugins: {
          labels: {
            fontSize: 14,
            render: 'value',
          },
        },
      },
      type: 'pie',
    });
  };
}

export default React.memo(DoughnutChart);
