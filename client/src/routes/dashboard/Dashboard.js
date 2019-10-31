import React, { PureComponent } from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Link from '../../components/Link';
import s from './Dashboard.css';
import CarbonMonoxideWidget from '../carbon-monoxide-sensor/CarbonMonoxideWidget/CarbonMonoxideWidget';
import Widget from '../../components/Widgets/Widget';
import TemperatureWidget from '../temperaturesensor/TemperatureWidget/TemperatureWidget';
import WaterQualityWidget from '../../components/Widgets/WaterQualityWidget';
import WindWidget from '../../components/Widgets/Wind';
import WaterConsumptionWidget from '../water-consumption/WaterConsumptionWidget';

class Dashboard extends PureComponent {
  static propTypes = {
    resetInterval: PropTypes.func.isRequired,
  };

  componentWillUnmount() {
    const { resetInterval } = this.props;
    resetInterval();
  }

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>Smart House Dashboard</div>
        <Container>
          <Row>
            <Col>
              <Link to="/temperaturesensor">
                <TemperatureWidget />
              </Link>
            </Col>
            <Col>
              <Link to="/wind">
                <WindWidget />
              </Link>
            </Col>
            <Col>
              <Link to="/water-quality">
                <WaterQualityWidget />
              </Link>
            </Col>
          </Row>
          <Row>
            <Col>
              <Link to="/carbonmonoxide">
                <CarbonMonoxideWidget />
              </Link>
            </Col>
            <Col>
              <Link to="/water-consumption">
                <WaterConsumptionWidget />
              </Link>
            </Col>
            <Col>
              <Link to="/comingsoon">
                <Widget />
              </Link>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
Dashboard.whyDidYouRender = true;
export default withStyles(s)(React.memo(Dashboard));
