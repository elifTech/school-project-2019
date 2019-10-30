import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import Switch from 'react-switch';
import { Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import {
  getWindSensorData,
  changeWindStatus,
} from '../../../actions/wind-sensor';
import style from './wind-widget.css';

class WindWidget extends React.Component {
  static propTypes = {
    dispatchChangeStatus: PropTypes.func.isRequired,
    dispatchGetInfo: PropTypes.func.isRequired,
    events: PropTypes.arrayOf(
      PropTypes.shape({
        direction: PropTypes.s,
        power: PropTypes.number,
      }),
    ).isRequired,
    info: PropTypes.shape({
      Status: PropTypes.number.isRequired,
    }).isRequired,
  };

  componentDidMount() {
    const { dispatchGetInfo } = this.props;
    dispatchGetInfo();
  }

  handleChangeStatus = () => {
    const { dispatchChangeStatus, info } = this.props;
    dispatchChangeStatus(!info.Status);
  };

  render() {
    const { events, info } = this.props;
    // console.log(events, info);
    return (
      <div className={style.container}>
        <div className={style.innerContainer}>
          <Row>
            <Col md={8} className={style.header}>
              Wind Sensor
            </Col>
            <Col md={2} className="ml-4">
              <Switch
                checked={info.Status === 1}
                onChange={this.handleChangeStatus}
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
            <b>
              {events.length === 0
                ? 'Currently sensor is disabled'
                : `Current power: ${events.slice(-1)[0].power}`}
            </b>
            <b>
              {events.length !== 0 &&
                `Current direction: ${events.slice(-1)[0].direction}`}
            </b>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  ({ windSensor: { events, info } }) => ({
    events,
    info,
  }),
  {
    dispatchChangeStatus: changeWindStatus,
    dispatchGetInfo: getWindSensorData,
  },
)(withStyles(style)(WindWidget));
