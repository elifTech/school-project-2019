import React from 'react';
import PropTypes from 'prop-types';
import ReactSpeedometer from 'react-d3-speedometer';
import { segmentColors } from '../WaterQualitySensor/HelperChartData';
import style from './WaterQualityWidget.css';

const inlineStyle = {
  // background: 'rgba(215,233,226,0.41)',
  // boxShadow: '0 0 8px 1px rgb(198, 199, 203)',
  // color: '#626364',
  // font: 'bold 16px serif',
  height: '16em',
  width: '22em',
};

function WaterQualityWidget({ value }) {
  return (
    <div className={style.container}>
      <p>Water quality</p>
      <div style={inlineStyle}>
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
