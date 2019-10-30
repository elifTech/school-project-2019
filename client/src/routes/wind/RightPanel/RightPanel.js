import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import WindStatus from '../WindStatus';
import WindCard from '../WindCard';
import {
  parseDirection,
  defineRotationDegree,
  parseBeaufortValue,
  defineRotationSpeed,
} from '../../../utils/wind-right-panel';
import s from './RightPanel.css';

class RightPanel extends React.PureComponent {
  static propTypes = {
    events: PropTypes.arrayOf(
      PropTypes.shape({
        created: PropTypes.string.isRequired,
        direction: PropTypes.number.isRequired,
        eventId: PropTypes.number.isRequired,
        power: PropTypes.number.isRequired,
      }),
    ).isRequired,
    name: PropTypes.string.isRequired,
  };

  render() {
    const { name, events } = this.props;
    if (events.length === 0) {
      return <WindStatus name={name} />;
    }
    const { direction, beaufort, power } = events.slice(-1)[0];

    return (
      <>
        <WindStatus name={name} />
        <WindCard header={parseDirection(direction)}>
          <svg width="163" height="100%" maxheight="163" viewBox="0 0 163 163">
            <circle cx="81.8569" cy="81.5" r="74.0486" fill="#ECECEC" />
            <g filter="url(#filter0_d)">
              <circle cx="81.5" cy="81.5" r="44.4102" fill="#F8F8F8" />
            </g>
            <path
              className={s.arrow}
              style={this.getRotationDegree(direction)}
              d="M85.1185 64.9927C83.7223 61.7917 79.1819 61.7917 77.7857 64.9928L66.0072 91.9971C64.4949 95.4642 68.1946 98.8991 71.5401 97.1341L79.5856 92.8895C80.7536 92.2733 82.1505 92.2733 83.3186 92.8895L91.3641 97.1341C94.7096 98.8991 98.4093 95.4642 96.897 91.9971L85.1185 64.9927Z"
              fill="#909CBC"
            />
            <rect
              y="77.3086"
              width="20.4914"
              height="7.45143"
              rx="3.72571"
              fill="#C4C4C4"
            />
            <rect
              x="142.509"
              y="77.3086"
              width="20.4914"
              height="7.45143"
              rx="3.72571"
              fill="#C4C4C4"
            />
            <rect
              x="84.7154"
              width="20.4914"
              height="7.45143"
              rx="3.72571"
              transform="rotate(90 84.7154 0)"
              fill="#C4C4C4"
            />
            <rect
              x="84.7154"
              y="142.509"
              width="20.4914"
              height="7.45143"
              rx="3.72571"
              transform="rotate(90 84.7154 142.509)"
              fill="#C4C4C4"
            />
            <defs>
              <filter
                id="filter0_d"
                x="7.08981"
                y="7.08981"
                width="148.82"
                height="148.82"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                />
                <feOffset />
                <feGaussianBlur stdDeviation="15" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0.564706 0 0 0 0 0.611765 0 0 0 0 0.737255 0 0 0 0.3 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow"
                  result="shape"
                />
              </filter>
            </defs>
          </svg>
        </WindCard>
        <WindCard header={`${parseBeaufortValue(beaufort)}, ${power} km/h`}>
          <svg width="180" height="100%" maxheight="134" viewBox="0 -20 90 170">
            <path
              d="M48.1273 84.4959C48.1273 84.4959 43.9762 92.2032 40.8729 95.8242C37.7697 99.9712 33.1349 103.592 33.1349 103.592L30.5555 129H51.1903L48.1273 84.4959Z"
              fill="#AFB8CE"
            />
            <path
              className={s.windmill}
              style={this.getAnimation(beaufort)}
              d="M14.9182 0.00224128C14.4346 0.0224691 13.8905 0.123619 13.4673 0.325907C6.2532 3.4412 10.9484 29.3952 22.8174 58.9095C24.3691 50.1098 31.5832 43.3735 40.8729 43.3735C44.4799 43.3735 48.1273 44.385 50.7066 46.4483C37.1651 19.2604 22.2532 -0.240508 14.9182 0.00224128ZM51.6739 46.9338C55.8049 50.0491 58.9283 55.2885 58.9283 61.4988C58.9283 68.7408 54.7973 74.9309 48.6109 77.5203C80.5908 79.5836 106.445 76.0638 106.969 68.2958C107.996 60.5278 83.6538 51.5865 51.6739 46.9338ZM40.8729 51.1415C35.1701 51.1415 30.5555 55.774 30.5555 61.4988C30.5555 67.2236 35.1701 71.8561 40.8729 71.8561C46.5756 71.8561 51.1903 67.2236 51.1903 61.4988C51.1903 55.774 46.5756 51.1415 40.8729 51.1415ZM22.8174 60.5278C4.76202 87.4528 -4.52766 111.222 2.18267 115.875C8.36907 120.527 28.0164 104.02 48.1273 78.6531C45.5479 79.1791 43.4522 79.6241 40.8729 79.6241C31.0794 79.6241 22.8174 71.3302 22.8174 61.4988V60.5278Z"
              fill="#AFB8CE"
            />
          </svg>
        </WindCard>
      </>
    );
  }

  getRotationDegree = dr => ({
    transform: `rotate(${defineRotationDegree(dr)})`,
  });

  getAnimation = bv => ({
    // eslint-disable-next-line css-modules/no-undef-class
    animation: `${s.spin} ${defineRotationSpeed(bv)}s linear infinite`,
  });
}

export default connect(
  ({
    windSensor: {
      info: { Name },
      events,
    },
  }) => ({
    events,
    name: Name,
  }),
  null,
)(withStyles(s)(RightPanel));
