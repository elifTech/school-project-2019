import React from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Fade from 'react-reveal/Fade';
import LogRecord from '../LogRecord';
import groupifyEvents, { selectOnlyTodayEvents } from '../../../utils/logger';
import s from './Logger.css';

const defaultChartHeight = 450;

const getContainerStyle = (chartHeight = defaultChartHeight) => ({
  maxHeight: `${window.innerHeight - chartHeight}px`,
});

const Logger = ({ events }) => {
  const records = groupifyEvents(
    selectOnlyTodayEvents(events.slice().reverse()),
  );
  return (
    <div className={s.container}>
      <Fade bottom delay={500}>
        <h3 className={s.heading}>Log info</h3>
      </Fade>
      {records.length > 0 ? (
        <Fade bottom delay={600}>
          <div className={s.recordsContainer} style={getContainerStyle()}>
            {records.map(record => (
              <LogRecord record={record} key={record.id} />
            ))}
          </div>
        </Fade>
      ) : (
        <Fade bottom delay={500}>
          <p className={s.noLogs}>
            Please, turn on your sensor to see relevant logs
          </p>
        </Fade>
      )}
    </div>
  );
};

Logger.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      created: PropTypes.string.isRequired,
      direction: PropTypes.number.isRequired,
      eventId: PropTypes.number.isRequired,
      power: PropTypes.number.isRequired,
    }),
  ).isRequired,
};

export default connect(({ windSensor: { events } }) => ({ events }))(
  withStyles(s)(Logger),
);
