import { connect } from 'react-redux';
import { changeFilter, changeStatus } from '../../actions/water-quality';
import WaterQualitySensor from './WaterQualitySensor';
import {
  FIXED,
  getFixedQuality,
  getEventsTime,
  getFixedStructure,
  getStructureLabels,
  getMax,
  getMin,
} from '../../selectors/water-quality-selectors';

const mapStateToProps = state => ({
  critics: {
    max: getMax(state),
    min: getMin(state),
  },
  currentQuality: state.waterQuality.currentQuality.toFixed(FIXED),
  error: state.waterQuality.error,
  eventsQuality: getFixedQuality(state),
  filter: state.waterQuality.filter,
  isDataLoaded: state.waterQuality.isDataLoaded,
  status: state.waterQuality.info.Status,
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
