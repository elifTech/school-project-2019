import { connect } from 'react-redux';
import { getEvents, changeStatus, getInfo } from '../actions/water-quality';
import WaterQualitySensor from '../components/WaterQualitySensor/WaterQualitySensor';
import {
  getFixedQuality,
  getEventsTime,
} from '../selectors/water-quality-selectors';

const mapStateToProps = state => ({
  eventsQuality: getFixedQuality(state),
  isFetching: state.waterQuality.isFetching,
  status: state.waterQuality.info.Status,
  time: getEventsTime(state),
});

const mapDispatchToProps = {
  dispatchChangeStatus: changeStatus,
  dispatchGetEvents: getEvents,
  dispatchGetInfo: getInfo,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WaterQualitySensor);
