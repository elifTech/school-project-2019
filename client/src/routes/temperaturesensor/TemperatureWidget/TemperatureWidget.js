import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import withStyles from 'isomorphic-style-loader/withStyles';
import Switch from 'react-switch';
import { Spinner, Alert, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import style from './TemperatureWidget.css';
import {
  getTemperatureSensorsData,
  changeTemperatureStatus,
} from '../../../actions/temperature';

const styleSpiner = {
  marginLeft: '0.5em',
};

class TemperatureWidget extends Component {
  static propTypes = {
    dispatchChangeStatus: PropTypes.func.isRequired,
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
  };

  componentDidMount() {
    getTemperatureSensorsData({
      from: moment().subtract(1, 'hours'),
    });
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
    const { info, events, error } = this.props;

    let degree;
    let createdAt;
    if (events.length !== 0) {
      degree = events.slice(-1)[0].degree;
      createdAt = moment(events.slice(-1)[0].CreatedAt).format(
        'DD-MM HH:mm:ss',
      );
    }

    return (
      <div className={style.container}>
        {error && (
          <Alert variant="danger">
            {error}
            <span style={styleSpiner}>
              <Spinner animation="border" role="status" />
            </span>
          </Alert>
        )}
        <div className={style.innerContainer}>
          <Row>
            <Col md={8} className={style.header}>
              Temperature Sensor
            </Col>
            <Col md={2} className="ml-4">
              <Switch
                onChange={this.statusOnClick(info.Status)}
                checked={info.Status === 1 ? false : info.Status === 0}
                handleDiameter={20}
                uncheckedIcon={false}
                checkedIcon={false}
                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                height={15}
                width={40}
              />
            </Col>
          </Row>

          <div className={style.degree}>
            {info.Status === 1 && events.length !== 0 ? (
              <span>
                <h5>Last sync: {createdAt}</h5>
                <h5>Last temperature: {degree} °C</h5>
              </span>
            ) : (
              <h4>
                Current temperature: <b>{degree} °C</b>
              </h4>
            )}
          </div>
        </div>
      </div>
    );
  }

  statusOnClick(status) {
    return () => this.handleOnClick(status);
  }
}

TemperatureWidget.whyDidYouRender = true;
export default connect(
  ({ temperatureSensor: { info, events, error } }) => ({
    error,
    events,
    info,
  }),
  {
    dispatchChangeStatus: changeTemperatureStatus,
  },
)(withStyles(style)(TemperatureWidget));
