import React, { PureComponent } from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import { Row, Col } from 'react-bootstrap';
import Link from '../../components/Link';
import s from './Dashboard.css';
import Widget from '../../components/Widgets/Widget';

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
              <Link to="/temperature">
                <Widget />
              </Link>
            </Col>
            <Col>
              <Link to="/wind">
                <Widget />
              </Link>
            </Col>
            <Col>
              <Link to="/water-quality">
                <Widget />
              </Link>
            </Col>
            <Col>
              <Link to="/carbonmonoxide">
                <Widget />
              </Link>
            </Col>
            <Col>
              <Link to="/water-meter">
                <Widget />
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
