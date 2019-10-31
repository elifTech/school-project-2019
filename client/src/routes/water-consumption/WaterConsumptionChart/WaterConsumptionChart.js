import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import moment from 'moment';
import { connect } from 'react-redux';
import { Bar } from 'react-chartjs-2';
import classNames from 'classnames';
import { setBoundaries } from '../../../actions/water-consumption';
import s from './WaterConsumptionChart.css';
import getWaterConsumptionDataSet from '../WaterConsumptionDataSet';

class WaterConsumptionChart extends React.Component {
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
    const dataset = getWaterConsumptionDataSet(events, filter);

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
}

export default connect(
  ({
    waterConsumption: {
      events,
      filterOption: { value },
    },
  }) => ({ events, filter: value }),
  { dispatchApplyFilter: setBoundaries },
)(withStyles(s)(WaterConsumptionChart));
