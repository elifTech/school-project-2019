import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import format from 'date-fns';
import Spinner from 'react-bootstrap/Spinner';
import { Chart, Line, defaults } from 'react-chartjs-2';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
// import TableHeaderColumn from 'react-bootstrap-table-2';
import zoom from 'chartjs-plugin-zoom';
import chartData from '../../store/chart-dataset';
import { changeCarbonStatus } from '../../actions/carbonmonoxide';

defaults.global.defaultFontFamily = 'Montserrat';

const options = {
  display: { maintainAspectRatio: true },
  legend: { display: false },
  pan: {
    enabled: true,
    // Panning directions. Remove the appropriate direction to disable
    // Eg. 'y' would only allow panning in the y direction
    // A function that is called as the user is panning and returns the
    // available directions can also be used:
    //   mode: function({ chart }) {
    //     return 'xy';
    //   },
    mode: 'xy',

    // onPan({ chartData }) {
    //   console.log(`I'm panning!!!`);
    // },
    // onPanComplete({ chartData }) {
    //   console.log(`I was panned!!!`);
    // },

    // Function called while the user is panning
    rangeMax: {
      // Format of max pan range depends on scale type
      x: null,
      y: 999,
    },
    // Function called once panning is completed
    rangeMin: {
      // Format of min pan range depends on scale type
      x: null,
      y: 0,
    },
  },
  zoom: {
    // drag: true,
    enabled: true,
    mode: 'xy',
    // onZoom({ Chart }) {
    //   console.log(`I'm zooming!!!`);
    // },
    // onZoomComplete({ Chart }) {
    //   console.log(`I was zoomed!!!`);
    // },
    // Function called while the user is zooming
    rangeMax: {
      // Format of max zoom range depends on scale type
      x: null,
      y: 999,
    },
    rangeMin: {
      // Format of max zoom range depends on scale type
      x: null,
      y: 0,
    },
    // Function called once zooming is completed
    sensitivity: 3,
    speed: 0.5,
  },
};

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

class CarbonMonoxideSensor extends Component {
  static propTypes = {
    dispatchChangeStatus: PropTypes.func.isRequired,
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
    removeInterval: PropTypes.func.isRequired,
  };

  componentWillUnmount() {
    const { removeInterval } = this.props;
    removeInterval();
    Chart.plugins.register(zoom);
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
    const { events, info } = this.props;
    return (
      <div className="container-fluid ">
        <div className="row">
          <div className="col-sm-12">
            {' '}
            <h3>{info.Name}</h3>
            <h5>{info.Type}</h5>
            <span>Status: {this.parseStatus(info.Status)}</span>
            {/* <hr /> */}
          </div>
        </div>

        <div className="row mb-5">
          <div className="col-sm-6">
            <Line data={chartData(events, 'label')} options={options} />
            {/* <button
              type="button"
              className="btn btn-light"
              checked={this.parseStatus(info.Status)}
              onClick={}
            > */}
            Slider
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
            {/* </button> */}
          </div>

          <div className="col-sm-6">
            <button
              type="button"
              className="btn btn-light"
              checked={this.parseStatus(info.Status)}
              onClick={this.statusOnClick(info.Status)}
            >
              <svg
                width="350"
                height="100%"
                maxheight="134"
                viewBox="0 0 512.001 512.001"
              >
                <circle fill="#3C3B41;" cx="256.001" cy="255.996" r="255.996" />
                <path
                  fill="#171719"
                  d="M510.407,284.585L383.87,158.049c-12.208-13.862-30.074-22.621-50-22.621
	c-4.833,0-9.54,0.528-14.079,1.509l-20.36-20.25c-19.435-20.989-47.215-34.136-78.076-34.136
	c-58.762,0-106.398,47.636-106.398,106.398c0,1.179,0.026,2.351,0.065,3.521c-39.04,11.069-67.639,46.977-67.639,89.563
	c0,27.244,11.706,51.754,30.361,68.777l160.571,160.571c5.846,0.399,11.741,0.619,17.689,0.619
	C387.724,512,496.191,412.514,510.407,284.585z"
                />
                <path
                  fill="#FFFFFF"
                  d="M400.494,201.253c-0.441-36.428-30.093-65.826-66.625-65.826c-6.597,0-12.965,0.974-18.982,2.76
	c-18.025-33.143-53.151-55.638-93.532-55.638c-58.762,0-106.398,47.636-106.398,106.398c0,1.179,0.026,2.352,0.064,3.521
	c-39.04,11.069-67.639,46.977-67.639,89.563c0,51.409,41.675,93.084,93.084,93.084c21.66,0,41.592-7.399,57.407-19.806
	c17.428,12.466,38.774,19.806,61.834,19.806c22.73,0,43.792-7.132,61.08-19.275c15.143,12.062,34.321,19.275,55.187,19.275
	c48.96,0,88.65-39.69,88.65-88.65C464.626,246.012,437.528,211.89,400.494,201.253z"
                />
                <path
                  fill="#D8D8DA"
                  d="M400.494,201.253c-0.441-36.428-30.093-65.826-66.625-65.826c-6.597,0-12.965,0.974-18.982,2.76
	c-12.609-23.184-33.593-41.145-58.883-49.853v286.71c1.231,0.042,2.464,0.073,3.704,0.073c22.73,0,43.792-7.132,61.081-19.275
	c15.143,12.062,34.321,19.275,55.187,19.275c48.96,0,88.65-39.69,88.65-88.65C464.626,246.012,437.528,211.89,400.494,201.253z"
                />
                <path
                  fill="#3C3B41"
                  d="M149.206,250.002c0-7.083,1.245-14.14,3.736-21.171c2.491-7.028,6.144-13.339,10.959-18.929
	c4.816-5.589,10.71-10.101,17.684-13.533c6.975-3.429,14.887-5.147,23.745-5.147c10.516,0,19.536,2.381,27.066,7.14
	c7.526,4.762,13.117,10.959,16.77,18.598l-11.789,7.638c-1.772-3.762-3.902-6.917-6.393-9.466c-2.491-2.544-5.205-4.592-8.135-6.143
	c-2.935-1.55-5.952-2.657-9.05-3.322c-3.1-0.663-6.144-0.996-9.132-0.996c-6.533,0-12.316,1.356-17.352,4.068
	c-5.038,2.715-9.272,6.255-12.703,10.628c-3.432,4.374-6.006,9.298-7.722,14.778c-1.718,5.479-2.574,10.988-2.574,16.522
	c0,6.201,1.022,12.096,3.072,17.685c2.047,5.591,4.898,10.544,8.551,14.86c3.654,4.317,7.97,7.75,12.951,10.295
	c4.982,2.547,10.404,3.82,16.273,3.82c3.098,0,6.281-0.387,9.548-1.163c3.264-0.773,6.393-2.019,9.382-3.735
	c2.989-1.716,5.783-3.874,8.385-6.476c2.6-2.599,4.732-5.728,6.393-9.382l12.454,6.808c-1.884,4.428-4.512,8.331-7.888,11.706
	c-3.378,3.378-7.197,6.226-11.457,8.551c-4.263,2.325-8.775,4.097-13.533,5.313c-4.76,1.217-9.41,1.826-13.948,1.826
	c-8.081,0-15.5-1.769-22.251-5.313c-6.753-3.541-12.594-8.163-17.517-13.865c-4.928-5.7-8.746-12.176-11.457-19.426
	C150.56,264.921,149.206,257.531,149.206,250.002z"
                />
                <path
                  fill="#171719"
                  d="M316.581,310.609c-8.303,0-15.857-1.687-22.666-5.066c-6.807-3.375-12.648-7.859-17.517-13.45
	c-4.872-5.588-8.635-11.981-11.291-19.178c-2.657-7.194-3.985-14.554-3.985-22.084c0-7.86,1.412-15.386,4.234-22.583
	c2.823-7.194,6.725-13.558,11.707-19.095c4.981-5.534,10.876-9.934,17.684-13.201c6.808-3.264,14.197-4.898,22.167-4.898
	c8.303,0,15.829,1.744,22.582,5.231c6.751,3.487,12.563,8.053,17.435,13.699c4.87,5.646,8.635,12.038,11.291,19.179
	c2.657,7.14,3.985,14.42,3.985,21.835c0,7.862-1.412,15.388-4.234,22.583c-2.823,7.196-6.699,13.532-11.623,19.012
	c-4.928,5.48-10.794,9.854-17.601,13.118C331.939,308.977,324.551,310.609,316.581,310.609z M276.232,250.833
	c0,5.977,0.968,11.762,2.906,17.352c1.935,5.59,4.675,10.543,8.219,14.86c3.541,4.317,7.804,7.75,12.785,10.295
	c4.982,2.547,10.516,3.819,16.605,3.819c6.31,0,11.956-1.354,16.937-4.068c4.981-2.711,9.216-6.253,12.703-10.628
	c3.487-4.372,6.144-9.325,7.97-14.861c1.826-5.534,2.74-11.125,2.74-16.77c0-5.979-0.971-11.761-2.906-17.352
	c-1.938-5.589-4.706-10.516-8.303-14.779c-3.599-4.26-7.862-7.663-12.786-10.211c-4.927-2.545-10.378-3.82-16.356-3.82
	c-6.31,0-11.956,1.328-16.936,3.985c-4.982,2.657-9.216,6.144-12.703,10.46c-3.487,4.317-6.172,9.244-8.053,14.779
	C277.171,239.432,276.232,245.077,276.232,250.833z"
                />
              </svg>
              ;
            </button>
          </div>
        </div>

        {/* <hr /> */}
        <div className="col-sm-10">
          <BootstrapTable
            bootstrap4
            keyField="EventID"
            data={events}
            columns={columns}
            pagination={paginationFactory()}
          />
          {/* <BootstrapTable data={events} pagination={paginationFactory()}>
              <TableHeaderColumn dataField="EventID">
                EventID
              </TableHeaderColumn>
                           <TableHeaderColumn dataField="EventID">
                EventID
              </TableHeaderColumn>
                           <TableHeaderColumn dataField="EventID">
                EventID
              </TableHeaderColumn>
            </BootstrapTable> */}
        </div>
      </div>
    );
  }

  statusOnClick(status) {
    return () => this.handleOnClick(status);
  }

  parseStatus = status => {
    switch (status) {
      case 1:
        return 'Offline';
      default:
        return 'Online';
    }
  };
}

export default connect(
  ({ carbonSensor: { info, events, error } }) => ({
    error,
    events,
    info,
  }),
  { dispatchChangeStatus: changeCarbonStatus },
)(withStyles()(CarbonMonoxideSensor));
