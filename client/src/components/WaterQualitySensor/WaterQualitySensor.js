import React, { PureComponent } from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import classNames from 'classnames';
import style from './WaterQualitySensor.css';
import LineChart from '../LineChart';
import FilterButtons from './FilterButtons';
import DoughnutChart from '../DoughnutChart';
import TableStructure from './TableStructure';
import Loader from '../Loader';
import WaterQualitySwitch from '../WaterQualitySwitch/WaterQualitySwitch';

class WaterQualitySensor extends PureComponent {
  static propTypes = {
    critics: PropTypes.shape({ max: PropTypes.number, min: PropTypes.number })
      .isRequired,
    currentQuality: PropTypes.string,
    dispatchChangeFilter: PropTypes.func.isRequired,
    error: PropTypes.string,
    // isFetching: PropTypes.bool,
    eventsQuality: PropTypes.arrayOf(PropTypes.string),
    filter: PropTypes.string.isRequired,
    resetInterval: PropTypes.func.isRequired,
    time: PropTypes.arrayOf(PropTypes.string),
    waterStructure: PropTypes.arrayOf(PropTypes.string),
    waterStructureLabels: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    currentQuality: 0,
    error: null,
    eventsQuality: [],
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
      dispatchChangeFilter,
      waterStructureLabels,
    } = this.props;

    const alert = (
      <Container className="ml-0 pl-0">
        <Col className="pl-0">
          <Alert variant="danger">
            <Alert.Heading>You got an error!</Alert.Heading>
            <p>Server is unavailable. Please check your Internet connection.</p>
          </Alert>
        </Col>
      </Container>
    );

    const content = (
      <Container className={style.container}>
        <Col className={style.header}>Water Quality sensor</Col>
        <Row className="py-2">
          <Col md={1} className="px-0">
            Status
          </Col>
          <Col md={2}>
            <WaterQualitySwitch />
          </Col>
        </Row>
        <Row>
          <Col md={9} className={style.lineChart}>
            <p className={style.lineChartHeader}>Changes in water quality</p>
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
          <Col
            md={2}
            className={classNames(style.rightContainerQuality, 'ml-4')}
          >
            <div className={style.rightContainerQualityItem}>
              <span className={style.criticTitle}>Current</span>
              <p className={style.criticValue}>{currentQuality} pH</p>
            </div>
            <div className={style.rightContainerQualityItem}>
              <span className={style.criticTitle}>Max</span>
              <p className={style.criticValue}>{critics.max} pH</p>
            </div>
            <div className={style.rightContainerQualityItem}>
              <span className={style.criticTitle}>Min</span>
              <p className={style.criticValue}>{critics.min} pH</p>
            </div>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col md={7} className={style.doughnutChart}>
            <p className={style.doughnutChartHeader}>
              Structure of water (mg/L)
            </p>
            <DoughnutChart
              waterStructure={waterStructure}
              labels={waterStructureLabels}
            />
          </Col>
          <Col
            md={4}
            className={classNames(style.rightContainerStructure, 'ml-4')}
          >
            <TableStructure />
          </Col>
        </Row>
        <div>test</div>
      </Container>
    );

    if (eventsQuality.length === 0 && !error) return <Loader />;
    if (eventsQuality.length > 0 && error)
      return (
        <div>
          {alert}
          {content}
        </div>
      );
    if (error) return alert;
    return content;
  }
}

export default withStyles(style)(WaterQualitySensor);
