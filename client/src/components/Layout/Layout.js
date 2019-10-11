import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';

// external-global styles must be imported in your JS.
import normalizeCss from 'normalize.css';
import s from './Layout.css';
import Header from '../Header';
import Footer from '../Footer';
import Menu from '../Menu/Menu';

function Layout(props) {
  const { children } = props;
  return (
    <Container fluid className={s.container}>
      <Row noGutters className={s.containerRow}>
        <Col lg={1}>
          <Menu />
        </Col>
        <Col lg={11}>
          <div className={s.paddingLeft}>{children}</div>
        </Col>
      </Row>
    </Container
  );
}
Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
Layout.whyDidYouRender = true;
export default withStyles(normalizeCss, s)(React.memo(Layout));
