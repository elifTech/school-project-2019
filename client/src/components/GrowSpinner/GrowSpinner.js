import React from 'react';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';

function GrowSpinner({ error }) {
  return (
    <Container>
      <Row className="justify-content-center">
        <Spinner animation="grow" role="status" />
        <Spinner animation="grow" role="status" />
        <Spinner animation="grow" role="status" />
      </Row>
      <Row>
        <Col>
          <Alert variant="danger" show={!!error}>
            {error}
          </Alert>
        </Col>
      </Row>
    </Container>
  );
}
GrowSpinner.propTypes = {
  error: PropTypes.string,
};
GrowSpinner.defaultProps = {
  error: null,
};

GrowSpinner.whyDidYouRender = true;
export default React.memo(GrowSpinner);
