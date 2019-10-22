import React, { Component } from 'react';
// import withStyles from 'isomorphic-style-loader/withStyles';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { Spinner, Alert } from 'react-bootstrap';
import { Line, defaults } from 'react-chartjs-2';
// import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import getChartData from './chart-dataset';
// import Icon from './carbonIcon/carbon-icon';
// import Loader from '../../components/Loader/Loader';
import { setFilter, changeTemperatureStatus } from '../../actions/temperature';

defaults.global.defaultFontFamily = 'Montserrat';

let startButton = '';

const options = {
  defaultSortName: 'EventID',
  defaultSortOrder: 'desc',
  display: { maintainAspectRatio: true },
  legend: { display: false },
  scales: {
    xAxes: [
      {
        display: false,
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
      Type: PropTypes.string.isRequired,
      status: PropTypes.number.isRequired,
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

  render() {
    const { events, info, isLoading, error } = this.props;

    const lastEvent = events.pop().degree;

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
      //   return (
      //     <div>
      //       <Loader />
      //     </div>
      //   );
    }
    return (
      <div className="container-fluid ">
        <div className="row">
          <div className="col-sm-12">
            {' '}
            <h3>{info.Name}</h3>
            <h5>{info.Type}</h5>
            <span>Port: {this.parseStatus(info.status)}</span>
            <hr />
          </div>
        </div>

        <div className="row mb-9">
          <div className="col-sm-7">
            <Line data={getChartData(events)} options={options} />
            <div className="col-sm-11">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                name="hours"
                onClick={this.setFilter('hours', 2)}
              >
                Last Hours
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                name="days"
                onClick={this.setFilter('days', 1)}
              >
                Last Day
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                name="weeks"
                onClick={this.setFilter('weeks', 1)}
              >
                Last Week
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                name="months"
                onClick={this.setFilter('months', 1)}
              >
                Last Month
              </button>
            </div>
          </div>

          <div className="col-sm-5">
            <button
              type="button"
              className={startButton}
              checked={this.parseStatus(info.status)}
              onClick={this.statusOnClick(info.status)}
            >
              {this.text}
            </button>
            {/* <Icon text={this.text} /> */}
            <h1>{events.degree}</h1>
          </div>
        </div>
        {/* <Icon  /> */}
        {/* <div className="col-sm-11">
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
              dataFormat={this.dateFormatter}
            >
              Event created
            </TableHeaderColumn>
            <TableHeaderColumn dataField="degree">Degree</TableHeaderColumn>
          </BootstrapTable>
        </div> */}

        <div>{lastEvent}</div>
      </div>
    );
  }

  dateFormatter = date => {
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
  };

  getFilterData = (filter, period) => {
    const { dispatchSetFilter } = this.props;
    dispatchSetFilter({
      from: moment().subtract(filter, period),
      value: moment().subtract(2, 'hours'),
    });
  };

  setFilter = (filter, period) => {
    return () => this.getFilterData(filter, period);
  };

  statusOnClick = status => {
    return () => this.handleOnClick(status);
  };

  parseStatus = status => {
    switch (status) {
      case 0:
        this.text = 'ON';
        startButton = 'btn btn-success';
        return 'Open';
      default:
        this.text = 'OFF';
        startButton = 'btn btn-danger';
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
    },
  }) => ({
    error,
    events,
    filterOption: { from, value },
    info,
    isLoading,
  }),
  {
    dispatchChangeStatus: changeTemperatureStatus,
    dispatchSetFilter: setFilter,
  },
)(TemperatureSensor);
