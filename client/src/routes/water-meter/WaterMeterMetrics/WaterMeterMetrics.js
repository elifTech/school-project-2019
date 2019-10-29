import React from 'react';
import Odometer from 'react-odometerjs';
import withStyles from 'isomorphic-style-loader/withStyles';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import flow from 'lodash/flow';
import fpMap from 'lodash/fp/map';
import fpGroupBy from 'lodash/fp/groupBy';
import sumBy from 'lodash/sumBy';
import o from 'odometer/themes/odometer-theme-default.css';

const WaterMeterMetrics = ({ events }) => {
  let summEvents = events;
  summEvents = flow(
    fpMap(item => {
      return {
        Consumption: parseInt(item.Consumption),
      };
    }),
    fpGroupBy('Created'),
    fpMap(item => {
      return {
        Consumption: sumBy(item, 'Consumption'),
      };
    }),
  )(summEvents);
  const sumValue = summEvents.map(({ Consumption }) => Consumption)[0];

  return (
    <div>
      <Odometer value={sumValue} format="(,ddd).dd" />
    </div>
  );
};

WaterMeterMetrics.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      Consumption: PropTypes.number.isRequired,
      Created: PropTypes.string,
    }),
  ).isRequired,
};

export default withStyles(o)(
  connect(({ waterMeter: { events } }) => ({
    events,
  }))(WaterMeterMetrics),
);
