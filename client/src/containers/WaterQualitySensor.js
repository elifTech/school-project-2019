import { connect } from 'react-redux';
import { getEvents } from '../actions/water-quality';
import WaterQualitySensor from '../components/WaterQualitySensor/WaterQualitySensor';
import {
  getFixedQuality,
  getEventsTime,
} from '../selectors/water-quality-selectors';

const mapStateToProps = state => ({
  eventsQuality: getFixedQuality(state),
  isFetching: state.waterQuality.isFetching,
  time: getEventsTime(state),
});

const mapDispatchToProps = {
  dispatchGetEvents: getEvents,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WaterQualitySensor);
