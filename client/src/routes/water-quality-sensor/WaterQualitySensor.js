import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/withStyles';
import PropTypes from 'prop-types';
import style from './WaterQualitySensor.css';
import { getEvents } from '../../actions/water-quality';
import LineChart from '../../components/LineChart/LineChart';

class WaterQualitySensor extends PureComponent {
  static propTypes = {
    dispatchGetEvents: PropTypes.func,
    // events: PropTypes.arrayOf(
    //   PropTypes.shape({
    //     CreatedAt: PropTypes.string.isRequired,
    //     ID: PropTypes.number.isRequired,
    //     name: PropTypes.string.isRequired,
    //     quality: PropTypes.number.isRequired,
    //   }),
    // ).isRequired,
    // isFetching: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    dispatchGetEvents: undefined,
  };

  componentDidMount() {
    const { dispatchGetEvents } = this.props;
    if (dispatchGetEvents) dispatchGetEvents();
  }

  render() {
    // const { events, isFetching } = this.props;
    return (
      <div className={style.container}>
        Water quality sensor
        <div>
          <LineChart data={this.props} />
        </div>
      </div>
    );
  }
}

export default connect(
  () => {},
  { dispatchGetEvents: getEvents },
)(withStyles(style)(WaterQualitySensor));
