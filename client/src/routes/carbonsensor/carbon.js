import React from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Line, defaults } from 'react-chartjs-2';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import chartData from '../../store/chart-dataset';
import logo from './logo.svg';

defaults.global.defaultFontFamily = 'Montserrat';

const options = {
  display: { maintainAspectRatio: true },
  legend: { display: false },
};

const Carbon = ({ info, events }) => {
  const parseStatus = () => {
    switch (info.Status) {
      case 0:
        return 'Online';
      case 1:
        return 'Offline';
      case 2:
        return 'Need repair';
      default:
        return 'Error';
    }
  };

  // eslint-disable-next-line react-perf/jsx-no-new-array-as-prop
  const columns = [
    {
      dataField: 'EventID',
      text: 'Event ID',
    },
    {
      dataField: 'name',
      text: 'Sensor Name',
    },
    {
      dataField: 'device_type',
      text: 'Device Type',
    },
    {
      dataField: 'Created',
      text: 'Event created',
    },
    {
      dataField: 'signal',
      text: 'Signal',
    },
  ];

  // if (isLoading) return <div>Loading...</div>;
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-sm-12">
          {' '}
          <h3>{info.Name}</h3>
          <h5>{info.Type}</h5>
          <span>Status: {parseStatus()}</span>
          <hr />
        </div>
      </div>
      <div className="row">
        <div className="col-sm-6">
          <Line data={chartData(events, 'label')} options={options} />
        </div>
        <div className="col-sm-6">
          <img src={logo} alt="Logo" height="350" width="350" />
        </div>
      </div>

      <div className="row">
        <hr />
        <div className="col-sm-11">
          <BootstrapTable
            bootstrap4
            keyField="EventID"
            data={events}
            columns={columns}
            pagination={paginationFactory()}
          />
        </div>
      </div>
    </div>
  );
};

Carbon.propTypes = {
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
  // isLoading: PropTypes.bool.isRequired,
};

export default connect(
  ({ carbonSensor: { info, events, loading, error } }) => ({
    error,
    events,
    info,
    isLoading: loading,
  }),
  null,
)(withStyles()(React.memo(Carbon)));
