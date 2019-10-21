import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import moment from 'moment';
import { connect } from 'react-redux';
import { HorizontalBar } from 'react-chartjs-2';
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
    const chartHeight =
      dataset.options.scales.yAxes[0].maxBarThickness * events.length;
    const minusOne = -1;
    let lastSync = 'Disabled';
    if (events.length > 0) {
      lastSync = this.parseLastSync(events.slice(minusOne)[0].Created);
    }
    return (
      <div className={s.container}>
        <div className={s.chartContainer}>
          <div className={s.header}>
            <h3 className={s.heading}>Water consumption</h3>
            <span className={s.lastsync}>{lastSync}</span>
          </div>
          <div style={{ height: chartHeight }}>
            {dataset && (
              <HorizontalBar data={dataset.data} options={dataset.options} />
            )}
          </div>
        </div>
        <div>
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
            name="week"
            className={classNames(s.filterButton, {
              [s.filterButtonActive]: filter === 'week',
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

          <div className={s.currentFilter}>
            Period:
            <br />
            <span>{filter}</span>
          </div>
        </div>
      </div>
    );
  }

  getFilterData = period => {
    const { dispatchApplyFilter, filter } = this.props;
    dispatchApplyFilter({
      from:
        filter === period
          ? moment()
              .startOf('day')
              .toJSON()
          : moment()
              .startOf(period)
              .toJSON(),
      value: filter === period ? 'hour' : period,
    });
  };

  parseLastSync = lastSync => {
    const inactiveTime = 60;
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
