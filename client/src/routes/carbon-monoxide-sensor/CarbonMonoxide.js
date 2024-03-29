import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { Spinner, Alert } from 'react-bootstrap';
import { Line, defaults } from 'react-chartjs-2';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import sliderStyle from 'rc-slider/assets/index.css';
import Slider from 'rc-slider';
import getChartData from './chart-dataset';
import CarbonMonoxideIcon from './CarbonMonoxideIcon/carbon-monoxide-icon';
import Loader from '../../components/Loader/Loader';
import {
  setBoundaries,
  changeCarbonStatus,
} from '../../actions/carbonmonoxide';
import style from './CarbonMonoxide.css';

defaults.global.defaultFontFamily = 'Montserrat';

const options = {
  defaultSortName: 'eventId',
  defaultSortOrder: 'desc',
  display: { maintainAspectRatio: true },
  legend: { display: false },
};

const sliderOption = {
  borderColor: 'grey',
};

const marks = {
  0: {
    label: <strong>Last Hour</strong>,
    style: {
      color: 'red',
    },
  },
  1: <strong>Day</strong>,
  2: <strong>Week</strong>,
  3: <strong>Month</strong>,
  4: {
    label: <strong>Year</strong>,
  },
};

class CarbonMonoxideSensor extends Component {
  static propTypes = {
    dispatchChangeStatus: PropTypes.func.isRequired,
    dispatchSetFilter: PropTypes.func.isRequired,
    error: PropTypes.string.isRequired,
    events: PropTypes.arrayOf(
      PropTypes.shape({
        CreatedAt: PropTypes.string.isRequired,
        ID: PropTypes.number.isRequired,
        UpdatedAt: PropTypes.string.isRequired,
        device_type: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        signal: PropTypes.number.isRequired,
      }),
    ).isRequired,
    info: PropTypes.shape({
      Name: PropTypes.string.isRequired,
      Status: PropTypes.number.isRequired,
      Type: PropTypes.string.isRequired,
    }).isRequired,
    isLoading: PropTypes.bool.isRequired,
    removeInterval: PropTypes.func.isRequired,
  };

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

  handleOnSliderChange = value => {
    switch (value) {
      case 1:
        this.getFilterData(1, 'days');
        break;
      case 2:
        this.getFilterData(1, 'weeks');
        break;
      // eslint-disable-next-line no-magic-numbers
      case 3:
        this.getFilterData(1, 'months');
        break;
      // eslint-disable-next-line no-magic-numbers
      case 4:
        this.getFilterData(2, 'years');
        break;
      default:
        this.getFilterData(1, 'hours');
    }
  };

  render() {
    const { events, info, isLoading, error } = this.props;
    let isVisible;

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
          <Alert variant="danger">
            <Alert.Heading>
              Server is not listening{' '}
              <Spinner animation="border" role="status" />
            </Alert.Heading>

            <hr />
            <p className="mb-0">{error}</p>
          </Alert>
        )}
        <div className="row">
          <div className="col-sm-12">
            <h3>{info.Name}</h3>
            <h5>{info.Type} (ppm)</h5>
            <span>Port: {info.Status ? 'Close' : 'Open'}</span>
            <hr />
          </div>
        </div>

        <div className="row mb-9">
          <div className="col-sm-7">
            <div className={style.lineChart}>
              <br />
              <Line data={getChartData(events)} options={options} />
            </div>
            <div className="col-sm-12">
              <div style={sliderStyle}>
                <br />
                <b>
                  <Slider
                    dots
                    step={1}
                    onChange={this.handleOnSliderChange}
                    marks={marks}
                    max={4}
                    defaultValue={0}
                    dotStyle={sliderOption}
                  />
                </b>
              </div>
              <br />
              <hr />
            </div>
          </div>

          <div className="col-sm-5">
            <div className={style.poster}>
              <button type="button" className="btn btn-outline-info">
                Tutorial
              </button>
              <div className={style.descr}>
                <b>Carbon Monoxide level (Parts Per Million)</b>
                <li>0 - Normal</li>
                <li>9 - Max allowable (short term)</li>
                <li>10-24 - Investigate source</li>
                <li>25 - Maximum exposure</li>
                <li>50 - Maximum exposure in workplace</li>
                <li>200 - dizzy, nausea, fatigue, headache (evacuate)</li>
                <li>400 - life threatening 3 hrs</li>
                <li>800 - convulsion, unconcious, death within 2-3 hrs</li>
                <li>1600 - death within 1-2 hrs</li>
                <li>6400 - death within 30 min</li>
                <li>12800 - death within 1-3 min</li>
              </div>
            </div>
            <CarbonMonoxideIcon text={info.Status} />
            <button
              type="button"
              className="btn btn-outline-primary"
              checked={!info.Status}
              onClick={this.statusOnClick(info.Status)}
            >
              ON / OFF
            </button>
          </div>
        </div>

        <div className="col-sm-11">
          <BootstrapTable
            data={events}
            height="540px"
            containerClass="my-custom-class"
            pagination
            options={options}
            striped
            hover
            condense
            version="4"
          >
            <TableHeaderColumn dataField="eventId" dataSort isKey>
              ID
            </TableHeaderColumn>
            <TableHeaderColumn dataField="name">Device Name</TableHeaderColumn>
            <TableHeaderColumn dataField="device_type">
              Device Type
            </TableHeaderColumn>
            <TableHeaderColumn
              dataField="CreatedAt"
              dataFormat={this.setDateFormat}
            >
              Event created
            </TableHeaderColumn>
            <TableHeaderColumn dataField="signal">Signal</TableHeaderColumn>
          </BootstrapTable>
        </div>
      </div>
    );
  }

  setDateFormat = date => {
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
  };

  getFilterData = (filter, period) => {
    const { dispatchSetFilter } = this.props;
    dispatchSetFilter({
      from: moment().subtract(filter, period),
      value: moment().subtract(2, 'hours'),
    });
  };

  statusOnClick(status) {
    return () => this.handleOnClick(status);
  }
}

export default connect(
  ({
    carbonMonoxideSensor: {
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
    dispatchChangeStatus: changeCarbonStatus,
    dispatchSetFilter: setBoundaries,
  },
)(withStyles(sliderStyle, style)(CarbonMonoxideSensor));
