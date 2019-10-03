import React, { PureComponent } from 'react';
import Chart from 'chart.js';
import withStyles from 'isomorphic-style-loader/withStyles';
import PropTypes from 'prop-types';
import style from '../../routes/water-quality-sensor/WaterQualitySensor.css';
import setData from '../../routes/water-quality-sensor/HelperChartData';

class LineChart extends PureComponent {
  static propTypes = {
    events: PropTypes.arrayOf(
      PropTypes.shape({
        CreatedAt: PropTypes.string.isRequired,
        ID: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        quality: PropTypes.number.isRequired,
      }),
    ).isRequired,
  };

  constructor(props) {
    super(props);
    this.chartRef = React.createRef();
  }

  componentDidMount() {
    this.buildChart();
  }

  componentDidUpdate() {
    const { events } = this.props;
    this.myLineChart.data = setData(events);
    this.myLineChart.update();
    // this.buildChart();
  }

  render() {
    return (
      <div>
        <canvas id="myChart" ref={this.chartRef} />
      </div>
    );
  }

  buildChart = () => {
    const { events } = this.props;
    const myChartReference = this.chartRef.current;
    this.myLineChart = new Chart(myChartReference, {
      data: setData(events),
      // options: { legend: { display: false } },
      type: 'line',
    });
  };
}

export default withStyles(style)(React.memo(LineChart));
