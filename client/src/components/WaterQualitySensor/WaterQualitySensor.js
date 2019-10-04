import React, { PureComponent } from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import PropTypes from 'prop-types';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import style from './WaterQualitySensor.css';
import LineChart from '../LineChart/LineChart';

class WaterQualitySensor extends PureComponent {
  static propTypes = {
    dispatchGetEvents: PropTypes.func,
    eventsQuality: PropTypes.PropTypes.arrayOf(PropTypes.string),
    isFetching: PropTypes.bool,
    time: PropTypes.PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    dispatchGetEvents: undefined,
    eventsQuality: [],
    isFetching: false,
    time: [],
  };

  componentDidMount() {
    const { dispatchGetEvents } = this.props;
    if (dispatchGetEvents) dispatchGetEvents();
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

  render() {
    const { eventsQuality, time, isFetching } = this.props;
    return isFetching || eventsQuality.length === 0 ? (
      this.loading()
    ) : (
      <div className={style.container}>
        Water quality sensor
        <div>
          <LineChart quality={eventsQuality} time={time} />
        </div>
      </div>
    );
  }
}

export default withStyles(style)(WaterQualitySensor);
