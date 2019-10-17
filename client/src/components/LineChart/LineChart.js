import React, { PureComponent } from 'react';
import Chart from 'chart.js';
import withStyles from 'isomorphic-style-loader/withStyles';
import PropTypes from 'prop-types';
import style from '../WaterQualitySensor/WaterQualitySensor.css';
import setData from '../WaterQualitySensor/HelperChartData';

class LineChart extends PureComponent {
  static propTypes = {
    quality: PropTypes.PropTypes.arrayOf(PropTypes.string),
    time: PropTypes.PropTypes.arrayOf(PropTypes.string),
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
      <div className={style.container}>
        <canvas id="myChart" ref={this.chartRef} />
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
                max: 18,
              },
            },
          ],
        },
      },
      type: 'line',
    });
  };
}

export default withStyles(style)(React.memo(LineChart));
