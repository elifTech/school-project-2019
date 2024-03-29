import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import { connect } from 'react-redux';
import classNames from 'classnames';
import s from './WaterConsumptionIndicator.css';

let waterConsumptionMetrics;
if (process.env.BROWSER) {
  // eslint-disable-next-line global-require
  const WaterConsumptionMetrics = require('../WaterConsumptionMetrics').default;
  waterConsumptionMetrics = <WaterConsumptionMetrics />;
}
function WaterConsumptionIndicator({ status }) {
  let animate;
  let waterStatus;
  let waterConsumptionIndicatorStyle;

  switch (status) {
    case 0:
      waterConsumptionIndicatorStyle = '#848a8c';
      waterStatus = 'Offline';
      animate = 0;
      break;
    case 1:
      waterConsumptionIndicatorStyle = 'url(#grad1)';
      animate = 'indefinite';
      waterStatus = 'Online';
      break;
    default:
      waterConsumptionIndicatorStyle = '#848a8c';
      waterStatus = 'Alert!';
      animate = 0;
  }

  return (
    <div className={s.container}>
      <div className={s.metricsWraper}>
        <h3>Metrics for selected period</h3>
        {waterConsumptionMetrics} <h2>liters</h2>
      </div>
      <div className={s.indicatorWraper}>
        <div className={s.waves}>
          <svg
            width="100%"
            height="100%"
            fill="none"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00B4DB" />
              <stop offset="50%" stopColor="#224488" />
              <stop offset="100%" stopColor="#0083B0" />
            </linearGradient>
            <path
              fill={waterConsumptionIndicatorStyle}
              d="
          M0 67
          C 273,183
            822,-40
            1920.00,106 
          
          V 359 
          H 0 
          V 67
          Z"
            >
              <animate
                repeatCount={animate}
                fill="url(#grad1)"
                attributeName="d"
                dur="10s"
                attributeType="XML"
                values="
            M0 77 
            C 473,283
              822,-40
              1920,116 
            
            V 359 
            H 0 
            V 67 
            Z; 

            M0 77 
            C 473,-40
              1222,283
              1920,136 
            
            V 359 
            H 0 
            V 67 
            Z; 

            M0 77 
            C 973,260
              1722,-53
              1920,120 
            
            V 359 
            H 0 
            V 67 
            Z; 

            M0 77 
            C 473,283
              822,-40
              1920,116 
            
            V 359 
            H 0 
            V 67 
            Z
            "
              />
            </path>
          </svg>
        </div>
      </div>
      <div className={s.info}>
        <h3>
          Status:{' '}
          <span
            className={classNames({
              [s.statusColorOnline]: status === 1,
            })}
          >
            {waterStatus}
          </span>
        </h3>
      </div>
    </div>
  );
}

WaterConsumptionIndicator.propTypes = {
  status: PropTypes.number.isRequired,
};

export default withStyles(s)(
  connect(({ waterConsumption: { info: { Status } } }) => ({
    status: Status,
  }))(WaterConsumptionIndicator),
);
