import React from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import s from './Dashboard.css';
import WaterQualityWidget from '../../components/Widgets/WaterQualityWidget';

function Home() {
  return (
    <div className={s.root}>
      <div className={s.container}>
        <h1>Hello, Eliftech School</h1>
        <Row>
          <Col>
            <WaterQualityWidget value={'10'} />
          </Col>
        </Row>
      </div>
    </div>
  );
}
Home.whyDidYouRender = true;
export default withStyles(s)(React.memo(Home));
