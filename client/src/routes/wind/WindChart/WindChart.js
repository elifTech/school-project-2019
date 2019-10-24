import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import moment from 'moment';
import { connect } from 'react-redux';
import { Line } from 'react-chartjs-2';
import classNames from 'classnames';
import Fade from 'react-reveal/Fade';
import { applyFilter } from '../../../actions/wind-sensor';
import prepareDataset from '../../../utils/prepare-dataset';
import s from './WindChart.css';

class WindChart extends React.PureComponent {
  static propTypes = {
    dispatchApplyFilter: PropTypes.func.isRequired,
    events: PropTypes.arrayOf(
      PropTypes.shape({
        created: PropTypes.string.isRequired,
        direction: PropTypes.number.isRequired,
        eventId: PropTypes.number.isRequired,
        power: PropTypes.number.isRequired,
      }),
    ).isRequired,
    filter: PropTypes.string.isRequired,
  };

  handleFilterClick = ({ target: { name: period } }) => {
    this.getFilterData(period);
  };

  render() {
    const { events, filter } = this.props;

    const dataset = prepareDataset(events, filter);
    let lastSync = 'Disabled';
    if (events.length > 0) {
      lastSync = this.parseLastSync(events.slice(-1)[0].created);
    }
    return (
      <Fade bottom delay={100}>
        <div className={s.container}>
          <div className={s.chartContainer}>
            <div className={s.header}>
              <h3 className={s.heading}>Wind speed</h3>
              <span className={s.lastsync}>{lastSync}</span>
            </div>
            {dataset && <Line data={dataset.data} options={dataset.options} />}
          </div>
          <div>
            <Fade right delay={400}>
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
            </Fade>
            <Fade right delay={450}>
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
            </Fade>
            <Fade right delay={500}>
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
            </Fade>
            <Fade>
              <div className={s.currentFilter}>
                Period:
                <br />
                <span>{filter}</span>
              </div>
            </Fade>
          </div>
        </div>
      </Fade>
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
    windSensor: {
      events,
      filterOption: { value },
    },
  }) => ({ events, filter: value }),
  { dispatchApplyFilter: applyFilter },
)(withStyles(s)(WindChart));
