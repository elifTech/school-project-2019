import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import Switch from 'react-switch';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import classNames from 'classnames';
import {
  changeWaterConsumptionStatus,
  getAllWaterConsumptionEvents,
} from '../../../actions/water-consumption';
import s from './WaterConsumptionWidget.css';

let waterConsumptionMetrics;
if (process.env.BROWSER) {
  // eslint-disable-next-line global-require
  const WaterConsumptionMetrics = require('../WaterConsumptionMetrics').default;
  waterConsumptionMetrics = <WaterConsumptionMetrics />;
}
class WaterConsumptionWidget extends React.Component {
  static propTypes = {
    error: PropTypes.string.isRequired,
    handleWaterConsumptionEvents: PropTypes.func.isRequired,
    handleWaterConsumptionStatus: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    status: PropTypes.number.isRequired,
  };

  componentDidMount() {
    const { handleWaterConsumptionEvents } = this.props;
    handleWaterConsumptionEvents();
  }

  render() {
    const { name, status, handleWaterConsumptionStatus } = this.props;
    return (
      <div className={s.container}>
        <div style={this.getError()} className={s.serverError}>
          Server unavailable
        </div>
        <div className={s.innerContainer}>
          <Row>
            <Col md={8} className={s.header}>
              {name}
            </Col>
            <Col md={2} className="ml-4">
              <Switch
                checked={status === 1}
                onChange={handleWaterConsumptionStatus}
                handleDiameter={20}
                uncheckedIcon={false}
                checkedIcon={false}
                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                height={15}
                width={40}
              />
            </Col>
          </Row>
          <div className={s.sensor}>
            Total metrics: <h4>{waterConsumptionMetrics}</h4> liters
            <div className={s.indicatorWraper}>
              <div
                className={classNames(s.indicator, {
                  [s.indicatorOff]: status === 0,
                  [s.indicatorOK]: status === 1,
                  [s.indicatorAlert]: status === 2,
                })}
              />
            </div>
            Flood sensor:{' '}
            <span
              className={classNames({
                [s.statusColorOk]: status === 1,
                [s.statusColorAlert]: status === 2,
              })}
            >
              {this.getStatus()}
            </span>
          </div>
        </div>
      </div>
    );
  }

  getStatus() {
    let floodStatus;
    const { status } = this.props;
    switch (status) {
      case 1:
        floodStatus = 'Ok';
        break;
      case 2:
        floodStatus = 'Alert';
        break;

      default:
        floodStatus = 'Offline';
    }
    return floodStatus;
  }

  getError() {
    let getDisplay = { display: 'none' };
    const { error } = this.props;
    if (error) {
      getDisplay = { display: 'flex' };
    }
    return getDisplay;
  }
}

export default withStyles(s)(
  connect(
    ({
      waterConsumption: {
        info: { Status, Name },
        error,
      },
    }) => ({
      error,
      name: Name,
      status: Status,
    }),
    {
      handleWaterConsumptionEvents: getAllWaterConsumptionEvents,
      handleWaterConsumptionStatus: changeWaterConsumptionStatus,
    },
  )(WaterConsumptionWidget),
);
