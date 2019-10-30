import React from 'react';
import PropTypes from 'prop-types';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { connect } from 'react-redux';
import Alert from 'react-bootstrap/Alert';
import withStyles from 'isomorphic-style-loader/withStyles';
import WaterQualitySwitch from '../../WaterQualitySwitch';
import { FIXED } from '../../../selectors/water-quality-selectors';
import style from './WaterQualityWidget.css';

function WaterQualityWidget({ value, error }) {
  const alert = (
    <div>
      <Alert variant="danger" className="m-0 text-center">
        <span>There is some problem with sensor</span>
      </Alert>
    </div>
  );

  const content = (
    <div className={style.container}>
      <Row>
        <Col md={9} className={style.header}>
          Water quality
        </Col>
        <Col md={2} className="ml-4">
          <WaterQualitySwitch />
        </Col>
      </Row>
      <div>{value}</div>
    </div>
  );
  if (value && error)
    return (
      <div>
        {alert}
        {content}
      </div>
    );
  return content;
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
