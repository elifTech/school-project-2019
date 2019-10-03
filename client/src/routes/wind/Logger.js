import React from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import { connect } from 'react-redux';
import Fade from 'react-reveal/Fade';
import LogRecord from './LogRecord';
import groupifyEvents, { selectOnlyTodayEvents } from '../../utils/logger';
import s from './css/Logger.css';

// eslint-disable-next-line react/prefer-stateless-function
class Logger extends React.Component {
  render() {
    const { events } = this.props;
    const records = groupifyEvents(
      selectOnlyTodayEvents(events.slice().reverse()),
    );
    return (
      <Fade bottom delay={500}>
        <div className={s.container}>
          <h3 className={s.heading}>Log info</h3>
          {records.length > 0 ? (
            <div
              className={s.recordsContainer}
              style={{ maxHeight: `${window.innerHeight - 450}px` }}
            >
              {records.map((record, i) => (
                <LogRecord key={record.id} record={record} pos={i} />
              ))}
            </div>
          ) : (
            <p>It looks like you havent activated your sensor</p>
          )}
        </div>
      </Fade>
    );
  }
}

export default connect(({ windSensor: { events } }) => ({ events }))(
  withStyles(s)(Logger),
);
