import React, { PureComponent } from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Switch from 'react-switch';
import Button from 'react-bootstrap/Button';
import classNames from 'classnames';
import Alert from 'react-bootstrap/Alert';
import style from './WaterQualitySensor.css';
import LineChart from '../LineChart/LineChart';
import GrowSpinner from '../GrowSpinner/GrowSpinner';

class WaterQualitySensor extends PureComponent {
  static propTypes = {
    dispatchChangeFilter: PropTypes.func.isRequired,
    dispatchChangeStatus: PropTypes.func.isRequired,
    error: PropTypes.string,
    eventsQuality: PropTypes.arrayOf(PropTypes.string),
    // isFetching: PropTypes.bool,
    filter: PropTypes.string.isRequired,
    resetInterval: PropTypes.func.isRequired,
    status: PropTypes.number,
    time: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    error: null,
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
      filter,
      error,
      // isFetching,
      dispatchChangeStatus,
      dispatchChangeFilter,
      status,
    } = this.props;
    return eventsQuality.length === 0 ? (
      <GrowSpinner error={error} />
    ) : (
      <Container>
        <Col md={10} className={style.header}>
          Water Quality sensor
        </Col>
        <Col md={10} className="px-0">
          <Alert variant="danger" show={!!error}>
            {error}
          </Alert>
        </Col>
        <span> Status </span>
        <Switch
          onChange={dispatchChangeStatus}
          checked={this.checkStatus(status)}
          handleDiameter={20}
          uncheckedIcon={false}
          checkedIcon={false}
          boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
          height={15}
          width={40}
          id="statusSwitch"
        />
        <Col md={10} className={style.lineChart}>
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
      </Container>
    );
  }

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
