import React from 'react';
import PropTypes from 'prop-types';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { connect } from 'react-redux';
import Alert from 'react-bootstrap/Alert';
import withStyles from 'isomorphic-style-loader/withStyles';
import { Spinner } from 'react-bootstrap';
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

function WaterQualityWidget({ value, error }) {
  return (
    <div className={style.container}>
      {error && (
        <Alert variant="danger">
          {error}
          <Spinner animation="border" role="status" />
        </Alert>
      )}
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
          <div>
            <img src={water} alt="menu-item" />
          </div>
          <p>
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
)(withStyles(style)(React.memo(WaterQualityWidget)));
