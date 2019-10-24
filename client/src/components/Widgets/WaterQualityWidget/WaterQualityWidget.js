import React from 'react';
import PropTypes from 'prop-types';
import ReactSpeedometer from 'react-d3-speedometer';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { connect } from 'react-redux';
import Alert from 'react-bootstrap/Alert';
import { segmentColors } from '../../WaterQualitySensor/HelperChartData';
import WaterQualitySwitch from '../../WaterQualitySwitch/WaterQualitySwitch';
import { FIXED } from '../../../selectors/water-quality-selectors';
// import style from './WaterQualityWidget.css';

const container = {
  width: '24em',
};

const innerContainer = {
  background: 'rgba(239,240,243,.38)',
  borderRadius: '0.5em',
  boxShadow: '0 0 8px 1px rgb(198, 199, 203)',
  height: '16em',
  padding: '1em',
};

const sensor = {
  height: '16em',
  width: '22em',
};

const header = {
  color: 'rgb(96,97,98)',
  font: 'bold 20px serif',
};

function WaterQualityWidget({ value, error }) {
  const alert = (
    <div>
      <Alert variant="danger" className="m-0 text-center">
        <span>There is some problem with sensor</span>
      </Alert>
    </div>
  );

  const content = (
    <div style={innerContainer}>
      <Row>
        <Col md={9} style={header}>
          Water quality
        </Col>
        <Col md={2} className="ml-4">
          <WaterQualitySwitch />
        </Col>
      </Row>
      <div style={sensor}>
        <ReactSpeedometer
          value={Number(value)}
          segmentColors={segmentColors}
          minValue={1}
          maxValue={14}
          segments={500}
          fluidWidth
          maxSegmentLabels={5}
          needleHeightRatio={0.7}
          needleTransitionDuration={2000}
          needleTransition="easeLinear"
        />
      </div>
    </div>
  );
  if (value && error)
    return (
      <div style={container}>
        {alert}
        {content}
      </div>
    );
  return <div style={container}>{content}</div>;
}

WaterQualityWidget.propTypes = {
  error: PropTypes.string,
  value: PropTypes.string,
};
WaterQualityWidget.defaultProps = {
  error: '',
  value: null,
};
const mapStateToProps = state => ({
  error: state.waterQuality.error,
  value: state.waterQuality.currentQuality.toFixed(FIXED),
});

WaterQualityWidget.whyDidYouRender = true;
export default connect(
  mapStateToProps,
  {},
)(React.memo(WaterQualityWidget));
