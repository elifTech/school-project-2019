import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/withStyles';
import { defaults } from 'react-chartjs-2';
import Loader from '../../components/Loader';
import WaterMeterChart from './WaterMeterChart';
import RightPanel from './RightPanel';
import s from './WaterMeter.css';

defaults.global.defaultFontFamily = 'Montserrat';

class WaterMeter extends React.Component {
  static propTypes = {
    error: PropTypes.string.isRequired,
    handleUnmount: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isStatusLoading: PropTypes.bool.isRequired,
  };

  componentWillUnmount() {
    const { handleUnmount } = this.props;
    handleUnmount();
  }

  render() {
    const { isStatusLoading, isLoading, error } = this.props;
    if (error) {
      return <div className={s.serverError}>Server unavailable</div>;
    }
    if (isLoading) {
      return <Loader />;
    }
    return (
      <Container fluid className={s.chart}>
        {isStatusLoading && <Loader />}
        <Row className={s.container}>
          <Col md={8}>
            <WaterMeterChart />
          </Col>
          <Col md={4}>
            <RightPanel />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default connect(({ waterMeter: { statusLoading, loading, error } }) => ({
  error,
  isLoading: loading,
  isStatusLoading: statusLoading,
}))(withStyles(s)(React.memo(WaterMeter)));
