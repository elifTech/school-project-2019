import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/withStyles';
import { defaults } from 'react-chartjs-2';
import Loader from '../../components/Loader';
import WaterConsumptionChart from './WaterConsumptionChart';
import RightPanel from './RightPanel';
import s from './WaterConsumption.css';

defaults.global.defaultFontFamily = 'Montserrat';

class WaterConsumption extends React.Component {
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
    const { isStatusLoading, isLoading } = this.props;

    if (isLoading) {
      return <Loader />;
    }
    return (
      <Container fluid className={s.chart}>
        {isStatusLoading && <Loader />}
        <Row className={s.container}>
          <div style={this.getError()} className={s.serverError}>
            Server unavailable
          </div>
          <Col md={8}>
            <WaterConsumptionChart />
          </Col>
          <Col md={4}>
            <RightPanel />
          </Col>
        </Row>
      </Container>
    );
  }

  getError() {
    let getDisplay = { display: 'none' };
    const { error } = this.props;
    if (error) {
      getDisplay = { display: 'flex' };
    }
    return getDisplay;
  }
}

export default connect(
  ({ waterConsumption: { statusLoading, loading, error } }) => ({
    error,
    isLoading: loading,
    isStatusLoading: statusLoading,
  }),
)(withStyles(s)(React.memo(WaterConsumption)));
