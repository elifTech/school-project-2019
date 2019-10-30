import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { Spinner, Alert } from 'react-bootstrap';
import { Line, defaults } from 'react-chartjs-2';
import classNames from 'classnames';
import getChartData from './chart-dataset';
import Icon from './temperatureIcon/temperature-icon';
import Loader from '../../components/Loader/Loader';
import { setFilter, changeTemperatureStatus } from '../../actions/temperature';
import style from './Temperature.css';
import TemperatureContainer from './TemperatureContainer/TemperatureContainer';

defaults.global.defaultFontFamily = 'Montserrat';

const buttonsStyle = {
  marginLeft: '1.5em',
  marginTop: '1em',
};

const startButtonStyle = {
  marginLeft: '1.5em',
};

const textStyle = {
  marginTop: '1em',
};

const xAxeStyle = {
  font: '20px monserrat',
  paddingLeft: '14.5em',
};

const options = {
  defaultSortName: 'eventId',
  defaultSortOrder: 'desc',
  display: { maintainAspectRatio: true },
  legend: { display: false },
  scales: {
    xAxes: [
      {
        display: false,
      },
    ],
    yAxes: [
      {
        scaleLabel: {
          display: true,
          fontColor: 'black',
          fontFamily: 'monserrat',
          fontSize: 19,
          labelString: 'Degree °C',
        },
      },
    ],
  },
};

class TemperatureSensor extends Component {
  static propTypes = {
    dispatchChangeStatus: PropTypes.func.isRequired,
    dispatchSetFilter: PropTypes.func.isRequired,
    error: PropTypes.string.isRequired,
    events: PropTypes.arrayOf(
      PropTypes.shape({
        Created: PropTypes.string.isRequired,
        CreatedAt: PropTypes.string.isRequired,
        EventID: PropTypes.number.isRequired,
        ID: PropTypes.number.isRequired,
        UpdatedAt: PropTypes.string.isRequired,
        degree: PropTypes.number.isRequired,
        device_type: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      }),
    ).isRequired,
    info: PropTypes.shape({
      Name: PropTypes.string.isRequired,
      Status: PropTypes.number.isRequired,
      Type: PropTypes.string.isRequired,
    }).isRequired,
    isLoading: PropTypes.bool.isRequired,
    isVisible: PropTypes.bool.isRequired,
    removeInterval: PropTypes.func.isRequired,
  };

  state = {
    selectedPeriod: 'days',
  };

  componentWillUnmount() {
    const { removeInterval } = this.props;
    removeInterval();
  }

  handleOnClick = () => {
    const { dispatchChangeStatus, info: { Status: status } = {} } = this.props;
    if (status === 1) {
      dispatchChangeStatus(false);
    } else {
      dispatchChangeStatus(true);
    }
  };

  render() {
    const { events, info, isLoading, error } = this.props;
    let { isVisible } = this.props;
    const { selectedPeriod } = this.state;

    const text = info.Status ? 'ON' : 'OFF';

    let degree;
    let created;
    let min;
    let max;
    let average;
    if (events.length !== 0) {
      degree = events.slice(-1)[0].degree;
      created = moment(events.slice(-1)[0].created).format('DD-MM HH:mm:ss');

      const degreeArray = events.map(event => event.degree);

      min = Math.min(...degreeArray);
      max = Math.max(...degreeArray);
      average = (
        degreeArray.reduce((a, b) => a + b, 0) / degreeArray.length
      ).toFixed(1);
    }

    if (error && events.length === 0) {
      return (
        <div className="container-fluid">
          <Alert variant="danger">
            <Alert.Heading>Failed to load resource!</Alert.Heading>
            <p>Server is not listening</p>
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
            <hr />
            <p className="mb-0">{error}</p>
          </Alert>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div>
          <Loader />
        </div>
      );
    }
    if (error && events.length !== 0) {
      isVisible = true;
    }
    return (
      <div className="container-fluid ">
        {isVisible && (
          <Alert variant="danger" isOpen={false}>
            <Alert.Heading>
              Server is not listening{' '}
              <Spinner animation="border" role="status" />
            </Alert.Heading>

            <hr />
            <p className="mb-0">{error}</p>
          </Alert>
        )}
        <div className="row">
          <div className="col-sm-7">
            <h3>Port: {info.Status ? 'Close' : 'Open'}</h3>
            <hr />
          </div>
          <div className="col-sm-5">
            <h2>
              <b>Temperature Sensor</b>
              <button
                style={startButtonStyle}
                type="button"
                className={classNames('btn', 'btn-lg', {
                  'btn-danger': !info.Status,
                  'btn-success': info.Status,
                })}
                checked={!info.Status}
                onClick={this.handleOnClick}
              >
                {text}
              </button>
            </h2>
          </div>
        </div>

        <div className="row mb-9 justify-content-center">
          <div className="col-sm-7">
            <div className={style.lineChart}>
              <Line data={getChartData(events)} options={options} />
              <p style={xAxeStyle}>Time</p>
            </div>

            <div className="col-sm-11" style={buttonsStyle}>
              <button
                type="button"
                className={classNames('btn', 'btn-lg', {
                  'btn-primary': selectedPeriod === 'hours',
                  'btn-secondary': selectedPeriod !== 'hours',
                })}
                name="hours"
                onClick={this.setFilter('hours', 2)}
              >
                Last Hours
              </button>
              <button
                type="button"
                className={classNames('btn', 'btn-lg', {
                  'btn-primary': selectedPeriod === 'days',
                  'btn-secondary': selectedPeriod !== 'days',
                })}
                name="days"
                onClick={this.setFilter('days', 1)}
              >
                Last Days
              </button>
              <button
                type="button"
                className={classNames('btn', 'btn-lg', {
                  'btn-primary': selectedPeriod === 'weeks',
                  'btn-secondary': selectedPeriod !== 'weeks',
                })}
                name="weeks"
                onClick={this.setFilter('weeks', 1)}
              >
                Last Week
              </button>
              <button
                type="button"
                className={classNames('btn', 'btn-lg', {
                  'btn-primary': selectedPeriod === 'months',
                  'btn-secondary': selectedPeriod !== 'months',
                })}
                name="months"
                onClick={this.setFilter('months', 1)}
              >
                Last Month
              </button>
            </div>
          </div>
          <div className="col-sm-5">
            <Icon degree={degree} />
            {degree !== undefined ? (
              info.Status ? (
                <h3 style={textStyle}>
                  Last temperature was {degree}°C <br /> At {created}
                </h3>
              ) : (
                <h3 style={textStyle}>Current temperature {degree}°C</h3>
              )
            ) : (
              <h3 style={textStyle}>
                Please, turn on your sensor to see relevant temperature
              </h3>
            )}
          </div>
        </div>

        <div className="row mb-9">
          <div className="col-sm-3">
            <TemperatureContainer type="MIN" degree={min} />
          </div>

          <div className="col-sm-3">
            <TemperatureContainer type="AVERAGE" degree={average} />
          </div>

          <div className="col-sm-3">
            <TemperatureContainer type="MAX" degree={max} />
          </div>
        </div>
      </div>
    );
  }

  setFilter = (filter, period) => {
    return () => this.getFilterData(filter, period);
  };

  setDateFormat = date => {
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
  };

  getFilterData = async (filter, period) => {
    const { dispatchSetFilter } = this.props;
    await dispatchSetFilter({
      from: moment().subtract(filter, period),
      value: moment().subtract('hours', 2),
    });
    this.setState({
      selectedPeriod: filter,
    });
  };
}

export default connect(
  ({
    temperatureSensor: {
      info,
      events,
      error,
      isLoading,
      filterOption: { from, value },
      visibleAlert,
    },
  }) => ({
    error,
    events,
    filterOption: { from, value },
    info,
    isLoading,
    visibleAlert,
  }),
  {
    dispatchChangeStatus: changeTemperatureStatus,
    dispatchSetFilter: setFilter,
  },
)(withStyles(style)(TemperatureSensor));
