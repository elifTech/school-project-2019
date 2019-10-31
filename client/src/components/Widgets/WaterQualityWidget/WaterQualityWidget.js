import React from 'react';
import PropTypes from 'prop-types';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/withStyles';
import classNames from 'classnames';
import WaterQualitySwitch from '../../WaterQualitySwitch';
import { FIXED } from '../../../selectors/water-quality-selectors';
import style from './WaterQualityWidget.css';
import water from '../../../assets/h2o.png';

const MAXQUALITY = 11;
const MINQUALITY = 4.5;
const AVGMIN = 6.5;
const AVGMAX = 8.5;

function checkColor(value) {
  if (value < MINQUALITY || value > MAXQUALITY) return style.danger;
  if (value < AVGMIN || value > AVGMAX) return style.warn;
  return style.ok;
}

const inlineImg = {
  backgroundImage: `url(${water})`,
  height: '128px',
  width: '128px',
};

function WaterQualityWidget({ value }) {
  return (
    <div className={style.container}>
      <div className={style.innerContainer}>
        <Row>
          <Col md={8} className={style.header}>
            Water Quality Sensor
          </Col>
          <Col md={2} className="ml-4">
            <WaterQualitySwitch />
          </Col>
        </Row>
        <div className={style.sensor}>
          <div style={inlineImg} />
          <p className={style.current}>
            Current quality:
            <span className={classNames(style.value, checkColor(value))}>
              {' '}
              {value} pH
            </span>
          </p>
        </div>
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
const mapStateToProps = state => ({
  value: state.waterQuality.currentQuality.toFixed(FIXED),
});

WaterQualityWidget.whyDidYouRender = true;
export default connect(
  mapStateToProps,
  {},
)(withStyles(style)(React.memo(WaterQualityWidget)));
