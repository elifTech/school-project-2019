import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { Spinner, Alert } from 'react-bootstrap';
import { Line, defaults } from 'react-chartjs-2';
import getChartData from './chart-dataset';
import Icon from './temperatureIcon/temperature-icon';
import Loader from '../../components/Loader/Loader';
import { setFilter, changeTemperatureStatus } from '../../actions/temperature';
import style from './Temperature.css';
import TemperatureContainer from './TemperatureContainer/TemperatureContainer';

defaults.global.defaultFontFamily = 'Montserrat';

const buttonsStyle = {
  marginLeft: '5.5em',
  marginTop: '1em',
};

const xAxeStyle = {
  font: '20px serif',
  paddingLeft: '17em',
};

const defaultButton = 'btn btn-secondary btn-lg';
const activeButton = 'btn btn-primary btn-lg';

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
          fontFamily: 'serif',
          fontSize: 19,
          labelString: 'Degree',
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

  componentDidMount() {
    this.selectedButton = 'days';
  }

  componentWillUnmount() {
    const { removeInterval } = this.props;
    removeInterval();
  }

  handleOnClick = status => {
    const { dispatchChangeStatus } = this.props;
    if (status === 1) {
      dispatchChangeStatus(false);
    } else {
      dispatchChangeStatus(true);
    }
  };

  render() {
    const { events, info, isLoading, error } = this.props;
    let { isVisible } = this.props;

    if (events.length !== 0) {
      this.degree = events.slice(-1)[0].degree;
      this.created = moment(events.slice(-1)[0].created).format(
        'DD-MM HH:mm:ss',
      );

      const degreeArray = [];
      /* eslint-disable no-restricted-syntax */

      for (const element of events) {
        degreeArray.push(element.degree);
      }

      this.min = Math.min(...degreeArray);
      this.max = Math.max(...degreeArray);
      this.average = (
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
            <h3>{info.Name}</h3>
            <span>Port: {this.parseStatus(info.Status)}</span>
            <hr />
          </div>
          <div className="col-sm-5">
            {/* <h4>Click here to ON / OFF sensor</h4> */}

            <button
              type="button"
              className={this.startButton}
              checked={this.parseStatus(info.Status)}
              onClick={this.statusOnClick(info.Status)}
            >
              {this.text}
            </button>
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
                className={
                  this.selectedButton === 'hours' ? activeButton : defaultButton
                }
                name="hours"
                onClick={this.setFilter('hours', 2)}
              >
                Last Hours
              </button>
              <button
                type="button"
                className={
                  this.selectedButton === 'days' ? activeButton : defaultButton
                }
                name="days"
                onClick={this.setFilter('days', 1)}
              >
                Last Days
              </button>
              <button
                type="button"
                className={
                  this.selectedButton === 'weeks' ? activeButton : defaultButton
                }
                name="weeks"
                onClick={this.setFilter('weeks', 1)}
              >
                Last Week
              </button>
              <button
                type="button"
                className={
                  this.selectedButton === 'months'
                    ? activeButton
                    : defaultButton
                }
                name="months"
                onClick={this.setFilter('months', 1)}
              >
                Last Month
              </button>
            </div>
          </div>
          <div className="col-sm-5">
            <Icon degree={this.degree} />
            {info.Status ? (
              <h1>
                Last temperature was {this.degree}°C <br /> At {this.created}
              </h1>
            ) : (
              <h1>Current temperature {this.degree}°C</h1>
            )}
          </div>
        </div>

        <div className="row mb-9">
          <div className="col-sm-3">
            <TemperatureContainer type="MIN" degree={this.min} />
          </div>

          <div className="col-sm-3">
            <TemperatureContainer type="AVERAGE" degree={this.average} />
          </div>

          <div className="col-sm-3">
            <TemperatureContainer type="MAX" degree={this.max} />
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

  getFilterData = (filter, period) => {
    this.selectedButton = filter;
    const { dispatchSetFilter } = this.props;
    dispatchSetFilter({
      from: moment().subtract(filter, period),
      value: moment().subtract('hours', 2),
    });
  };

  statusOnClick(status) {
    return () => this.handleOnClick(status);
  }

  parseStatus = status => {
    switch (status) {
      case 0:
        this.text = 'ON';
        this.startButton = 'btn btn-success btn-lg';
        return 'Open';
      default:
        this.text = 'OFF';
        this.startButton = 'btn btn-danger btn-lg';
        return 'Close';
    }
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
