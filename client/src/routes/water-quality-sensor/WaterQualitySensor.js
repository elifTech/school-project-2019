import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/withStyles';
import PropTypes from 'prop-types';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import style from './WaterQualitySensor.css';
import { getEvents } from '../../actions/water-quality';
import LineChart from '../../components/LineChart/LineChart';

class WaterQualitySensor extends PureComponent {
  static propTypes = {
    dispatchGetEvents: PropTypes.func,
    events: PropTypes.arrayOf(
      PropTypes.shape({
        CreatedAt: PropTypes.string.isRequired,
        ID: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        quality: PropTypes.number.isRequired,
      }),
    ).isRequired,
    isFetching: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    dispatchGetEvents: undefined,
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
    const { events, isFetching } = this.props;
    return isFetching ? (
      this.loading()
    ) : (
      <div className={style.container}>
        Water quality sensor
        <div>
          <LineChart events={events} />
        </div>
      </div>
    );
  }
}

export default connect(
  ({ waterQuality: { events, isFetching, error } }) => ({
    error,
    events,
    isFetching,
  }),
  { dispatchGetEvents: getEvents },
)(withStyles(style)(WaterQualitySensor));
