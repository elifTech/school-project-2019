import React from 'react';
import PropTypes from 'prop-types';
import ReactSpeedometer from 'react-d3-speedometer';
import { segmentColors } from '../WaterQualitySensor/HelperChartData';
// import style from './WaterQualityWidget.css';

const container = {
  background: 'rgba(239,240,243,.38)',
  borderRadius: '0.5em',
  boxShadow: '0 0 8px 1px rgb(198, 199, 203)',
  height: '17em',
  padding: '1em',
  textAlign: 'center',
  width: '24em',
};

const sensor = {
  height: '16em',
  width: '22em',
};

const header = {
  color: 'rgb(96,97,98)',
  font: 'bold 20px serif',
};

function WaterQualityWidget({ value }) {
  return (
    <div style={container}>
      <div style={sensor}>
        <p style={header}>Water quality</p>
        <ReactSpeedometer
          value={Number(value)}
          segmentColors={segmentColors}
          minValue={1}
          maxValue={14}
          segments={500}
          fluidWidth
          maxSegmentLabels={5}
          needleHeightRatio={0.7}
        />
      </div>
    </div>
  );
}

WaterQualityWidget.propTypes = {
  value: PropTypes.string,
};
WaterQualityWidget.defaultProps = {
  value: null,
};

WaterQualityWidget.whyDidYouRender = true;
export default React.memo(WaterQualityWidget);
