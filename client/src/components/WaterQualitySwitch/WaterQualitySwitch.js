import React from 'react';
import Switch from 'react-switch';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { changeStatus } from '../../actions/water-quality';

const checkStatus = status => {
  return status === 0 ? false : status === 1;
};

const WaterQualitySwitch = ({ status, dispatchChangeStatus }) => (
  <Switch
    onChange={dispatchChangeStatus}
    checked={checkStatus(status)}
    handleDiameter={20}
    uncheckedIcon={false}
    checkedIcon={false}
    boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
    height={15}
    width={40}
    id="statusSwitch"
  />
);

WaterQualitySwitch.propTypes = {
  dispatchChangeStatus: PropTypes.func.isRequired,
  status: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
  status: state.waterQuality.info.Status,
});

const mapDispatchToProps = {
  dispatchChangeStatus: changeStatus,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(React.memo(WaterQualitySwitch));
