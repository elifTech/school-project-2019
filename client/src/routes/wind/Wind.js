import React from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import PropTypes from 'prop-types';
import Chart from 'chart.js';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'react-bootstrap';
import WindChart from './WindChart';
import Logger from './Logger';

import RightPanel from './RightPanel';
import Loader from '../../components/Loader';
import s from './Wind.css';

Chart.defaults.global.defaultFontFamily = 'Montserrat';

class Wind extends React.Component {
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
      return <div>Sorry, something goes wrong on the server :(</div>;
    }

    if (isLoading) {
      return <Loader />;
    }
    return (
      <Container fluid className={s.container}>
        {isStatusLoading && <Loader />}
        <Row className={s.container}>
          <Col md={8}>
            <WindChart />
            <Logger />
          </Col>
          <Col md={4}>
            <RightPanel />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default connect(
  ({ windSensor: { statusLoading, loading, error } }) => ({
    error,
    isLoading: loading,
    isStatusLoading: statusLoading,
  }),
  null,
)(withStyles(s)(React.memo(Wind)));
