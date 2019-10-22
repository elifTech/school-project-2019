import React, { PureComponent } from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Switch from 'react-switch';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import classNames from 'classnames';
import style from './WaterQualitySensor.css';
import LineChart from '../LineChart/LineChart';
import GrowSpinner from '../GrowSpinner/GrowSpinner';
import FilterButtons from './FilterButtons';
import DoughnutChart from '../DoughnutChart/DoughnutChart';

class WaterQualitySensor extends PureComponent {
  static propTypes = {
    critics: PropTypes.shape({ max: PropTypes.string, min: PropTypes.string })
      .isRequired,
    currentQuality: PropTypes.string,
    dispatchChangeFilter: PropTypes.func.isRequired,
    dispatchChangeStatus: PropTypes.func.isRequired,
    error: PropTypes.string,
    // isFetching: PropTypes.bool,
    eventsQuality: PropTypes.arrayOf(PropTypes.string),
    filter: PropTypes.string.isRequired,
    resetInterval: PropTypes.func.isRequired,
    status: PropTypes.number,
    time: PropTypes.arrayOf(PropTypes.string),
    waterStructure: PropTypes.arrayOf(PropTypes.string),
    waterStructureLabels: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    currentQuality: 0,
    error: null,
    eventsQuality: [],
    status: 0,
    time: [],
    waterStructure: [],
    waterStructureLabels: [],
  };

  componentWillUnmount() {
    const { resetInterval } = this.props;
    resetInterval();
  }

  render() {
    const {
      eventsQuality,
      time,
      filter,
      error,
      critics,
      // isFetching,
      waterStructure,
      currentQuality,
      dispatchChangeStatus,
      dispatchChangeFilter,
      waterStructureLabels,
      status,
    } = this.props;
    return eventsQuality.length === 0 ? (
      <GrowSpinner error={error} />
    ) : (
      <Container className={style.container}>
        <Col md={10} className={style.header}>
          Water Quality sensor
        </Col>
        <Row>
          <Col className="pl-0">
            <Alert variant="danger" show={!!error}>
              {error}
            </Alert>
          </Col>
        </Row>
        <Row className="py-2">
          <Col md={1} className="px-0">
            Status
          </Col>
          <Col>
            <Switch
              onChange={dispatchChangeStatus}
              checked={this.checkStatus(status)}
              handleDiameter={20}
              uncheckedIcon={false}
              checkedIcon={false}
              boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
              height={15}
              width={40}
              id="statusSwitch"
            />
          </Col>
        </Row>
        <Row>
          <Col md={9} className={style.lineChart}>
            <LineChart quality={eventsQuality} time={time} />
            <div className={style.filters}>
              {FilterButtons.map(button => {
                return (
                  <Button
                    className={classNames(style.filterBtn, {
                      [style.filterBtnActive]: filter === button.value,
                    })}
                    variant="outline-info"
                    key={button.id}
                    onClick={dispatchChangeFilter(button.value)}
                  >
                    {button.label}
                  </Button>
                );
              })}
            </div>
          </Col>
          <Col className={style.rightContainer}>
            <div className={style.rightContainerItem}>
              Current: {currentQuality}
            </div>
            <div className={style.rightContainerItem}>Max: {critics.max}</div>
            <div className={style.rightContainerItem}>Min: {critics.min}</div>
          </Col>
        </Row>
        <Row>
          <Col className="my-3">
            <DoughnutChart
              waterStructure={waterStructure}
              labels={waterStructureLabels}
            />
          </Col>
        </Row>
      </Container>
    );
  }

  checkStatus = status => {
    return status === 0 ? false : status === 1;
  };
}

export default withStyles(style)(WaterQualitySensor);
