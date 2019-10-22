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
import Icon from './carbonIcon/carbon-icon';
import Loader from '../../components/Loader/Loader';
import { setFilter, changeCarbonStatus } from '../../actions/carbonmonoxide';

defaults.global.defaultFontFamily = 'Montserrat';

const options = {
  defaultSortName: 'EventID',
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
        Created: PropTypes.string.isRequired,
        CreatedAt: PropTypes.string.isRequired,
        EventID: PropTypes.number.isRequired,
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
        this.getFilterData('days', 1);
        break;
      case 2:
        this.getFilterData('weeks', 1);
        break;
      // eslint-disable-next-line no-magic-numbers
      case 3:
        this.getFilterData('months', 1);
        break;
      // eslint-disable-next-line no-magic-numbers
      case 4:
        this.getFilterData('years', 2);
        break;
      default:
        this.getFilterData('hours', 1);
    }
  };

  render() {
    const { events, info, isLoading, error } = this.props;

    if (error) {
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
    return (
      <div className="container-fluid ">
        <div className="row">
          <div className="col-sm-12">
            {' '}
            <h3>{info.Name}</h3>
            <h5>{info.Type}</h5>
            <span>Port: {this.parseStatus(info.Status)}</span>
            <hr />
          </div>
        </div>

        <div className="row mb-9">
          <div className="col-sm-7">
            <Line data={getChartData(events)} options={options} />
            <div className="col-sm-12">
              <div style={sliderStyle}>
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
            <button
              type="button"
              className="btn btn-dark"
              checked={this.parseStatus(info.Status)}
              onClick={this.statusOnClick(info.Status)}
            >
              {this.text}
            </button>
            <Icon text={this.text} />
            <h1>{events.signal}</h1>
          </div>
        </div>

        <div className="col-sm-11">
          <BootstrapTable
            data={events}
            pagination
            options={options}
            hover
            version="4"
          >
            <TableHeaderColumn dataField="EventID" dataSort isKey>
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
      value: moment().subtract('hours', 2),
    });
  };

  statusOnClick(status) {
    return () => this.handleOnClick(status);
  }

  parseStatus = status => {
    switch (status) {
      case 0:
        this.text = 'OFF';
        return 'Open';
      default:
        this.text = 'ON';
        return 'Close';
    }
  };
}

export default connect(
  ({
    carbonSensor: {
      info,
      events,
      error,
      isLoading,
      filterOption: { from, value },
    },
  }) => ({
    error,
    events,
    filterOption: { from, value },
    info,
    isLoading,
  }),
  { dispatchChangeStatus: changeCarbonStatus, dispatchSetFilter: setFilter },
)(withStyles(sliderStyle)(CarbonMonoxideSensor));
