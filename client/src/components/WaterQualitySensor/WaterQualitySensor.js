import React, { PureComponent } from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import PropTypes from 'prop-types';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import Switch from 'react-switch';
import Button from 'react-bootstrap/Button';
import classNames from 'classnames';
import style from './WaterQualitySensor.css';
import LineChart from '../LineChart/LineChart';

class WaterQualitySensor extends PureComponent {
  static propTypes = {
    dispatchChangeFilter: PropTypes.func.isRequired,
    dispatchChangeStatus: PropTypes.func.isRequired,
    eventsQuality: PropTypes.arrayOf(PropTypes.string),
    filter: PropTypes.string.isRequired,
    // isFetching: PropTypes.bool,
    name: PropTypes.string.isRequired,
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
      filter,
      // isFetching,
      dispatchChangeStatus,
      dispatchChangeFilter,
      status,
    } = this.props;
    return eventsQuality.length === 0 ? (
      this.loading()
    ) : (
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
                  <Button
                    className={classNames(style.filterBtn, {
                      [style.filterBtnActive]: filter === button.value,
                    })}
                    variant="outline-info"
                    key={button.id}
                    onClick={dispatchChangeFilter(button.value)}
                  >
                    {button.label}
                  </Button>
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
      id: 0,
      label: 'Per hour',
      query: '',
      value: 'hour',
    },
    {
      id: 1,
      label: 'Per day',
      query: '',
      value: 'day',
    },
    {
      id: 2,
      label: 'Per week',
      query: '',
      value: 'week',
    },
    {
      id: 3,
      label: 'Per moth',
      query: '',
      value: 'month',
    },
  ];
}

export default withStyles(style)(WaterQualitySensor);
