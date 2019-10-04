import React, { PureComponent } from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import PropTypes from 'prop-types';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Switch from 'react-switch';
import style from './WaterQualitySensor.css';
import LineChart from '../LineChart/LineChart';

class WaterQualitySensor extends PureComponent {
  static propTypes = {
    dispatchChangeStatus: PropTypes.func.isRequired,
    dispatchGetEvents: PropTypes.func.isRequired,
    dispatchGetInfo: PropTypes.func.isRequired,
    eventsQuality: PropTypes.arrayOf(PropTypes.string),
    isFetching: PropTypes.bool,
    status: PropTypes.number,
    time: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    eventsQuality: [],
    isFetching: false,
    status: 0,
    time: [],
  };

  componentDidMount() {
    const { dispatchGetEvents, dispatchGetInfo } = this.props;
    if (dispatchGetEvents) dispatchGetEvents();
    if (dispatchGetInfo) dispatchGetInfo();
  }

  render() {
    const {
      eventsQuality,
      time,
      isFetching,
      dispatchChangeStatus,
      status,
    } = this.props;
    return isFetching ? (
      this.loading()
    ) : (
      <Container className={style.container}>
        Water quality sensor
        <Switch
          onChange={dispatchChangeStatus}
          checked={this.checkStatus(status)}
        />
        <Row>
          <Col md={9}>
            <LineChart quality={eventsQuality} time={time} />
          </Col>
        </Row>
      </Container>
    );
  }

  loading = () => {
    return (
      <Container>
        <Row className="justify-content-md-center">
          <Spinner animation="grow" role="status" />
          <Spinner animation="grow" role="status" />
          <Spinner animation="grow" role="status" />
        </Row>
      </Container>
    );
  };

  checkStatus = status => {
    return !!status;
  };
}

export default withStyles(style)(WaterQualitySensor);
