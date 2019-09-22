import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';

// external-global styles must be imported in your JS.
import normalizeCss from 'normalize.css';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import s from './Layout.css';
import Menu from '../Menu';

function Layout(props) {
  const { children } = props;
  return (
    <Container fluid className={s.container}>
      <Row noGutters className={s.containerRow}>
        <Col lg={1}>
          <Menu />
        </Col>
        <Col lg={11}>{children}</Col>
      </Row>
    </Container>
  );
}
Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
Layout.whyDidYouRender = true;
export default withStyles(bootstrap, normalizeCss, s)(React.memo(Layout));
