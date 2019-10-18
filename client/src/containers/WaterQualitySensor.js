import { connect } from 'react-redux';
import { changeFilter, changeStatus } from '../actions/water-quality';
import WaterQualitySensor from '../components/WaterQualitySensor/WaterQualitySensor';
import {
  getFixedQuality,
  getEventsTime,
} from '../selectors/water-quality-selectors';

const mapStateToProps = state => ({
  error: state.waterQuality.error,
  eventsQuality: getFixedQuality(state),
  filter: state.waterQuality.filter,
  // isFetching: state.waterQuality.isFetching,
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
