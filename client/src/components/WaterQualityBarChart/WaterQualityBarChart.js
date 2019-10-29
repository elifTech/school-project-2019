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

  color = '#e2d479';

  buildChart = () => {
    const { waterStructure, labels } = this.props;
    const myChartReference = this.chartRef.current;
    this.myDoughnutChart = new Chart(myChartReference, {
      data: setData(waterStructure, labels, true, this.color),
      options: {
        legend: {
          display: true,
          labels: {
            fontSize: 14,
          },
        },
        plugins: {
          labels: {
            fontSize: 12,
            render: 'value',
          },
        },
        scales: {
          xAxes: [
            {
              display: true,
            },
          ],
          yAxes: [
            {
              ticks: {
                callback(value) {
                  return `${value} mg/L`;
                },
                max: 120,
              },
            },
          ],
        },
      },
      type: 'bar',
    });
  };
}

export default React.memo(DoughnutChart);
