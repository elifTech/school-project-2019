import React, { PureComponent } from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import s from './Dashboard.css';
import WaterQualityWidget from '../../components/Widgets/WaterQualityWidget';
import CarbonWidget from '../carbonsensor/CarbonWidget/carbon-widget';

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
        <div className={s.container}>Dashboard</div>
        <Container>
          <Row>
            <Col>
              <WaterQualityWidget />
            </Col>
            <Col>
              <CarbonWidget />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
Dashboard.whyDidYouRender = true;
export default withStyles(s)(React.memo(Dashboard));
