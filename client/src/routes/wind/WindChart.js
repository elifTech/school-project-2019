import React from 'react';
import PropTypes from 'prop-types';
import Chart from 'chart.js';
import prepareDataset from '../../utils/prepare-dataset';

const chartContainerStyle = {
  maxWidth: 500,
};

class WindChart extends React.Component {
  static propTypes = {
    events: PropTypes.arrayOf(
      PropTypes.shape({
        CreatedAt: PropTypes.string.isRequired,
        ID: PropTypes.number.isRequired,
        direction: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        power: PropTypes.number.isRequired,
      }),
    ).isRequired,
  };

  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    const { events } = this.props;
    this.myChart = new Chart(this.canvasRef.current, prepareDataset(events));
  }

  componentDidUpdate() {
    const { events } = this.props;
    this.myChart.data.labels = prepareDataset(events).data.labels;
    this.myChart.data.datasets[0].data = prepareDataset(
      events,
    ).data.datasets[0].data;
    this.myChart.update();
  }

  render() {
    return (
      <div style={chartContainerStyle}>
        <canvas ref={this.canvasRef} />
      </div>
    );
  }
}

export default WindChart;
