import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/withStyles';
import PropTypes from 'prop-types';
import style from './WaterQualitySensor.css';
import { getEvents } from '../../actions/water-quality';

class WaterQualitySensor extends PureComponent {
  static propTypes = {
    dispatchGetEvents: PropTypes.func,
  };

  static defaultProps = {
    dispatchGetEvents: undefined,
  };

  handleFetchEvents = event => {
    event.preventDefault();
    const { dispatchGetEvents } = this.props;
    if (dispatchGetEvents) dispatchGetEvents();
    return false;
  };

  render() {
    return (
      <div className={style.container}>
        Water quality sensor
        <button type="button" onClick={this.handleFetchEvents}>
          Fetch data
        </button>
      </div>
    );
  }
}

export default connect(
  () => {
    return {};
  },
  { dispatchGetEvents: getEvents },
)(withStyles(style)(WaterQualitySensor));
