import React from 'react';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import ReactSpeedometer from 'react-d3-speedometer';
import Col from 'react-bootstrap/Col';
import { segmentColors } from '../WaterQualitySensor/HelperChartData';
import style from './WaterQualityWidget.css';

const inlineStyle = {
  background: 'rgba(215,233,226,0.41)',
  boxShadow: '0 0 8px 1px rgb(198, 199, 203)',
};

function WaterQualityWidget({ value }) {
  return (
    <Container>
      <Row>
        <Col md={4} style={inlineStyle}>
          <p>Water quality</p>
          <ReactSpeedometer
            value={Number(value)}
            segmentColors={segmentColors}
            minValue={1}
            maxValue={14}
            segments={500}
            height={200}
            width={300}
            maxSegmentLabels={5}
            needleHeightRatio={0.7}
          />
        </Col>
      </Row>
    </Container>
  );
}


WaterQualityWidget.propTypes = {
  value: PropTypes.string,
};
WaterQualityWidget.defaultProps = {
  value: null,
};

WaterQualityWidget.whyDidYouRender = true;
export default React.memo(WaterQualityWidget);
