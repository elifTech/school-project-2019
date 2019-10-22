import { connect } from 'react-redux';
import { changeFilter, changeStatus } from '../actions/water-quality';
import WaterQualitySensor from '../components/WaterQualitySensor/WaterQualitySensor';
import {
  FIXED,
  getFixedQuality,
  getEventsTime,
  getFixedStructure,
  getStructureLabels,
} from '../selectors/water-quality-selectors';

const mapStateToProps = state => ({
  critics: {
    max: state.waterQuality.critics.max.toFixed(FIXED),
    min: state.waterQuality.critics.min.toFixed(FIXED),
  },
  currentQuality: state.waterQuality.currentQuality.toFixed(FIXED),
  error: state.waterQuality.error,
  eventsQuality: getFixedQuality(state),
  filter: state.waterQuality.filter,
  status: state.waterQuality.info.Status,
  // isFetching: state.waterQuality.isFetching,
  time: getEventsTime(state),
  waterStructure: getFixedStructure(state),
  waterStructureLabels: getStructureLabels(state),
});

const mapDispatchToProps = {
  dispatchChangeFilter: changeFilter,
  dispatchChangeStatus: changeStatus,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WaterQualitySensor);