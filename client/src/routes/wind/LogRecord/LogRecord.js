import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import s from './Record.css';

const LogRecord = ({ record: { day, time, description, speed } }) => {
  const maxSpeed = 120;
  const maxRects = 6;
  const rectWidth = 8;
  const rectGap = 3;
  const rectHeight = 17;
  const rects = Math.round((speed / maxSpeed) * maxRects) || 1;
  return (
    <div className={s.container}>
      <div className={s.indicator}>
        <svg
          width={(rectWidth + rectGap) * maxRects - rectGap}
          height={rectHeight}
          viewBox={`0 0 ${(rectWidth + rectGap) * maxRects -
            rectGap} ${rectHeight}`}
        >
          <rect
            width={(rectWidth + rectGap) * maxRects - rectGap}
            height={rectHeight}
            fill="url(#paint0_linear)"
          />
          <defs>
            <linearGradient
              id="paint0_linear"
              x1="0"
              y1={rectHeight}
              x2={(rectWidth + rectGap) * maxRects - rectGap}
              y2={rectHeight}
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#909CBC" />
              <stop offset="1" stopColor="#FF5F56" />
            </linearGradient>
          </defs>
        </svg>
        <svg
          width={(rectWidth + rectGap) * maxRects - rectGap}
          height={rectHeight}
          viewBox={`0 0 ${(rectWidth + rectGap) * maxRects -
            rectGap} ${rectHeight}`}
        >
          <clipPath id="clip-rects">
            {Array.from(new Array(rects), (_, i) => (
              <rect
                key={i}
                x={i * (rectWidth + rectGap)}
                width={rectWidth}
                height={rectHeight}
                fill="#909CBC"
              />
            ))}
          </clipPath>
        </svg>
      </div>
      <span className={s.indicatorTooltip}>Indicator</span>
      <div className={s.speed}>{`${speed} km/h`}</div>
      <div className={s.description}>{description}</div>
      <div className={s.date}>
        {day},<br />
        {time}
      </div>
    </div>
  );
};

LogRecord.propTypes = {
  record: PropTypes.shape({
    day: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    speed: PropTypes.number.isRequired,
    time: PropTypes.string.isRequired,
  }).isRequired,
};

export default withStyles(s)(LogRecord);
