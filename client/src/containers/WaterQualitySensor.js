import { connect } from 'react-redux';
import { changeFilter, changeStatus } from '../actions/water-quality';
import WaterQualitySensor from '../components/WaterQualitySensor/WaterQualitySensor';
import {
  FIXED,
  getFixedQuality,
  getEventsTime,
} from '../selectors/water-quality-selectors';

const mapStateToProps = state => ({
  critics: {
    max: state.waterQuality.critics.max.toFixed(FIXED),
    min: state.waterQuality.critics.min.toFixed(FIXED),
  },
  currentQuality: state.waterQuality.currentQuality.toFixed(FIXED),
  error: state.waterQuality.error,
  eventsQuality: getFixedQuality(state),
  // isFetching: state.waterQuality.isFetching,
  filter: state.waterQuality.filter,
  status: state.waterQuality.info.Status,
  time: getEventsTime(state),
});

const mapDispatchToProps = {
  dispatchChangeFilter: changeFilter,
  dispatchChangeStatus: changeStatus,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WaterQualitySensor);
