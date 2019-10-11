import React, { PureComponent } from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import PropTypes from 'prop-types';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import Switch from 'react-switch';
import style from './WaterQualitySensor.css';
import LineChart from '../LineChart/LineChart';

class WaterQualitySensor extends PureComponent {
  static propTypes = {
    dispatchChangeStatus: PropTypes.func.isRequired,
    eventsQuality: PropTypes.arrayOf(PropTypes.string),
    name: PropTypes.string.isRequired,
    // isFetching: PropTypes.bool,
    resetInterval: PropTypes.func.isRequired,
    status: PropTypes.number,
    time: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    eventsQuality: [],
    // isFetching: false,
    status: 0,
    time: [],
  };

  componentWillUnmount() {
    const { resetInterval } = this.props;
    resetInterval();
  }

  render() {
    const {
      eventsQuality,
      time,
      name,
      // isFetching,
      dispatchChangeStatus,
      status,
    } = this.props;
    return (
      <Container>
        <p className={style.header}>{name}</p>
        <Switch
          onChange={dispatchChangeStatus}
          checked={this.checkStatus(status)}
          handleDiameter={20}
          uncheckedIcon={false}
          checkedIcon={false}
          boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
          height={15}
          width={40}
        />
        <Row className={style.container}>
          <Col md={9} className={style.lineChart}>
            <LineChart quality={eventsQuality} time={time} />
            <div className={style.filters}>
              {this.filterButtons.map(button => {
                return (
                  <button
                    key={button.id}
                    className={button.btnClass}
                    type="button"
                    onClick={this.filterData(button.query)}
                  >
                    {button.label}
                  </button>
                );
              })}
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  filterData = query => {
    console.info(1, query);
  };

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
    return status === 0 ? false : status === 1;
  };

  filterButtons = [
    {
      btnClass: '',
      id: 0,
      label: 'Per day',
      query: '',
    },
    {
      btnClass: '',
      id: 1,
      label: 'Per week',
      query: '',
    },
    {
      btnClass: '',
      id: 2,
      label: 'Per moth',
      query: '',
    },
  ];
}

export default withStyles(style)(WaterQualitySensor);
