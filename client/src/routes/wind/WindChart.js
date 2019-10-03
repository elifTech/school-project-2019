/* eslint-disable react/jsx-handler-names */
import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import moment from 'moment';
import { connect } from 'react-redux';
import Chart from 'chart.js';
import classNames from 'classnames';
import Fade from 'react-reveal/Fade';
import { applyFilter } from '../../actions/wind-sensor';
import prepareDataset from '../../utils/prepare-dataset';
import s from './css/WindChart.css';

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

  state = {
    currentFilter: '',
  };

  componentDidMount() {
    const { events } = this.props;
    this.myChart = new Chart(this.canvasRef.current, prepareDataset(events));
  }

  componentDidUpdate() {
    const { events } = this.props;
    const {
      data: {
        labels,
        datasets: [dataset],
      },
    } = prepareDataset(events);
    // dynamically update chart without rerendering
    this.myChart.data.labels = labels;
    this.myChart.data.datasets[0].data = dataset.data;
    this.myChart.update();
  }

  render() {
    const { events } = this.props;
    const { currentFilter } = this.state;

    if (events.length === 0)
      return (
        <div className={s.container}>
          <div className={s.chartContainer}>
            <div className={s.header}>
              <h3 className={s.heading}>Please, turn on your sensor</h3>
            </div>
            <canvas ref={this.canvasRef} />
          </div>
        </div>
      );
    const lastSync = this.parseLastSync(events.slice(-1)[0].CreatedAt);
    return (
      <Fade bottom delay={100}>
        <div className={s.container}>
          <div className={s.chartContainer}>
            <div className={s.header}>
              <h3 className={s.heading}>Wind speed</h3>
              <span className={s.lastsync}>Last sync: {lastSync}</span>
            </div>
            <canvas ref={this.canvasRef} />
          </div>
          <div>
            <Fade right delay={400}>
              <button
                type="button"
                className={classNames(s.filterButton, {
                  [s.filterButtonActive]: currentFilter === 'hour',
                })}
                onClick={this.setHourFilter}
              >
                Hour
              </button>
            </Fade>
            <Fade right delay={450}>
              <button
                type="button"
                className={classNames(s.filterButton, {
                  [s.filterButtonActive]: currentFilter === 'day',
                })}
                onClick={this.setDayFilter}
              >
                Day
              </button>
            </Fade>
            <Fade right delay={500}>
              <button
                type="button"
                className={classNames(s.filterButton, {
                  [s.filterButtonActive]: currentFilter === 'week',
                })}
                onClick={this.setWeekFilter}
              >
                Week
              </button>
            </Fade>
          </div>
        </div>
      </Fade>
    );
  }

  canvasRef = React.createRef();

  setHourFilter = () => {
    if (this.state.currentFilter === 'hour') {
      this.setState({
        currentFilter: '',
      });
      this.getFilterData('week');
    } else {
      this.setState({
        currentFilter: 'hour',
      });
      this.getFilterData('hour');
    }
  };

  setDayFilter = () => {
    if (this.state.currentFilter === 'day') {
      this.setState({
        currentFilter: '',
      });
      this.getFilterData('week');
    } else {
      this.setState({
        currentFilter: 'day',
      });
      this.getFilterData('day');
    }
  };

  setWeekFilter = () => {
    if (this.state.currentFilter === 'week') {
      this.setState({
        currentFilter: '',
      });
    } else {
      this.setState({
        currentFilter: 'week',
      });
    }
    this.getFilterData('week');
  };

  getFilterData = period => {
    const { applyFilter } = this.props;
    applyFilter({
      from: moment()
        .local()
        .startOf(period)
        .toJSON(),
      to: moment()
        .local()
        .toJSON(),
    });
  };

  parseLastSync = lastSync => {
    const inactiveTime = 10;
    const lsMoment = moment(lastSync);
    const today = moment()
      .clone()
      .startOf('day');
    const yesterday = moment()
      .clone()
      .subtract(1, 'days')
      .startOf('day');
    let day;

    switch (true) {
      case lsMoment.isSame(today, 'd'):
        if (Math.abs(lsMoment.diff(moment(), 'seconds')) < inactiveTime)
          return 'Active';
        day = 'Today';
        break;
      case lsMoment.isSame(yesterday, 'd'):
        day = 'Yesterday';
        break;
      default:
        day = lsMoment.format('MMMM D');
    }
    return `${day}, ${lsMoment.format('HH:mm')}`;
  };
}

export default connect(
  ({ windSensor: { events } }) => ({ events }),
  { applyFilter },
)(withStyles(s)(WindChart));
