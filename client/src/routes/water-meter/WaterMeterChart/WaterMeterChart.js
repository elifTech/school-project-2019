import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import moment from 'moment';
import { connect } from 'react-redux';
import { Bar } from 'react-chartjs-2';
import classNames from 'classnames';
import { applyFilter } from '../../../actions/water-meter';
import s from './WaterMeterChart.css';
import getWaterMeterDataSet from '../WaterMeterDataSet';

class WaterMeterChart extends React.Component {
  static propTypes = {
    dispatchApplyFilter: PropTypes.func.isRequired,
    events: PropTypes.arrayOf(
      PropTypes.shape({
        Consumption: PropTypes.number.isRequired,
        Created: PropTypes.string.isRequired,
      }),
    ).isRequired,
    filter: PropTypes.string.isRequired,
  };

  handleFilterClick = ({ target: { name: period } }) => {
    this.getFilterData(period);
  };

  render() {
    const { events, filter } = this.props;
    const dataset = getWaterMeterDataSet(events, filter);

    let lastSync = 'Disabled';
    if (events.length > 0) {
      lastSync = this.parseLastSync(events[0].Created);
    }

    return (
      <div className={s.container}>
        <div className={s.buttonWraper}>
          <button
            type="button"
            name="day"
            className={classNames(s.filterButton, {
              [s.filterButtonActive]: filter === 'day',
            })}
            onClick={this.handleFilterClick}
          >
            Day
          </button>

          <button
            type="button"
            name="isoWeek"
            className={classNames(s.filterButton, {
              [s.filterButtonActive]: filter === 'isoWeek',
            })}
            onClick={this.handleFilterClick}
          >
            Week
          </button>

          <button
            type="button"
            name="month"
            className={classNames(s.filterButton, {
              [s.filterButtonActive]: filter === 'month',
            })}
            onClick={this.handleFilterClick}
          >
            Month
          </button>

          <button
            type="button"
            name="year"
            className={classNames(s.filterButton, {
              [s.filterButtonActive]: filter === 'year',
            })}
            onClick={this.handleFilterClick}
          >
            Year
          </button>
        </div>
        <div className={s.chartContainer}>
          <div className={s.header}>
            <h3 className={s.heading}>
              Water consumption, <span>liters</span>
            </h3>
            <span className={s.lastsync}>{lastSync}</span>
          </div>
          <div className={s.info}>
            <p>
              1000 liters = 1 m<sup>3</sup>
            </p>
          </div>

          <div className={s.chartWraper}>
            {dataset && <Bar data={dataset.data} options={dataset.options} />}
          </div>
        </div>
      </div>
    );
  }

  getFilterData = period => {
    const { dispatchApplyFilter } = this.props;
    dispatchApplyFilter({
      from: moment()
        .startOf(period)
        .toJSON(),
      value: period,
    });
  };

  parseLastSync = lastSync => {
    const inactiveTime = 3600;
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
  ({
    waterMeter: {
      events,
      filterOption: { value },
    },
  }) => ({ events, filter: value }),
  { dispatchApplyFilter: applyFilter },
)(withStyles(s)(WaterMeterChart));
