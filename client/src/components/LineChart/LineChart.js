import React, { PureComponent } from 'react';
import Chart from 'chart.js';
import PropTypes from 'prop-types';
import setData from '../WaterQualitySensor/HelperChartData';

class LineChart extends PureComponent {
  static propTypes = {
    quality: PropTypes.arrayOf(PropTypes.string),
    time: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    quality: [],
    time: [],
  };

  constructor(props) {
    super(props);
    this.chartRef = React.createRef();
  }

  componentDidMount() {
    this.buildChart();
  }

  componentDidUpdate() {
    const { quality, time } = this.props;
    this.myLineChart.data.labels = time;
    this.myLineChart.data.datasets[0].data = quality;
    this.myLineChart.update();
  }

  render() {
    return (
      <div>
        <canvas height="120vh" id="myChart" ref={this.chartRef} />
      </div>
    );
  }

  buildChart = () => {
    const { quality, time } = this.props;
    const myChartReference = this.chartRef.current;
    this.myLineChart = new Chart(myChartReference, {
      data: setData(quality, time),
      // options: { legend: { display: false } },
      options: {
        scales: {
          xAxes: [
            {
              display: false,
            },
          ],
          yAxes: [
            {
              ticks: {
                max: 12,
              },
            },
          ],
        },
      },
      type: 'line',
    });
  };
}

export default React.memo(LineChart);
