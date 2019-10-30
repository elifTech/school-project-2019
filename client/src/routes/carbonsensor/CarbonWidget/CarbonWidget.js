/* eslint-disable react/no-unused-state */
/* eslint-disable no-magic-numbers */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import format from 'moment';
import withStyles from 'isomorphic-style-loader/withStyles';
import Switch from 'react-switch';
import { Spinner, Alert, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import style from './CarbonWidget.css';
import {
  getCarbonSensorsData,
  changeCarbonStatus,
} from '../../../actions/carbonmonoxide';

class Widget extends Component {
  static propTypes = {
    dispatchChangeStatus: PropTypes.func.isRequired,
    dispatchWidgetData: PropTypes.func.isRequired,
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
  };

  handleOnClick = status => {
    const { dispatchChangeStatus } = this.props;
    if (status === 1) {
      dispatchChangeStatus(false);
    } else {
      dispatchChangeStatus(true);
    }
  };

  render() {
    const { info, dispatchWidgetData, events, error } = this.props;
    let sign = 0;
    let value = 'Low';
    let dangStyle = style.Low;
    if (events.length !== 0) {
      sign = events.slice(-1)[0].signal;
      if (sign > 150) {
        value = 'High';
        dangStyle = style.High;
      } else if (sign > 50) {
        value = 'Considerable';
        dangStyle = style.Considerable;
      } else {
        value = 'Low';
        dangStyle = style.Low;
      }
    }
    dispatchWidgetData({
      from: format().subtract(1, 'hours'),
    });
    return (
      <div className={style.container}>
        {error && (
          <Alert variant="danger">
            {error}
            <Spinner animation="border" role="status" />
          </Alert>
        )}
        <div className={style.innerContainer}>
          <Row>
            <Col md={8} className={style.header}>
              {info.Type}
            </Col>
            <Col md={2} className="ml-4">
              <Switch
                onChange={this.statusOnClick(info.Status)}
                checked={this.checkStatus(info.Status)}
                handleDiameter={20}
                uncheckedIcon={false}
                checkedIcon={false}
                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                height={15}
                width={40}
              />
            </Col>
          </Row>
          <div className={style.sensor}>
            {info.Status === 1 && events.length !== 0 && (
              <span>
                Last sync:
                {format(events.slice(-1)[0].CreatedAt).format('DD-MM HH:mm:ss')}
              </span>
            )}
            <div className={style.signal}>{sign}</div>
            <div className={dangStyle}>Dangerous level: {value} </div>
          </div>
        </div>
      </div>
    );
  }

  statusOnClick(status) {
    return () => this.handleOnClick(status);
  }

  checkStatus = status => {
    return status === 1 ? false : status === 0;
  };
}

Widget.whyDidYouRender = true;
export default connect(
  ({ carbonSensor: { info, events, error } }) => ({
    error,
    events,
    info,
  }),
  {
    dispatchChangeStatus: changeCarbonStatus,
    dispatchWidgetData: getCarbonSensorsData,
  },
)(withStyles(style)(Widget));
