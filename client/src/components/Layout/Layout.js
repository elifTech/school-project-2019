import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';

// external-global styles must be imported in your JS.
import normalizeCss from 'normalize.css';
import s from './Layout.css';
import Header from '../Header';
import Footer from '../Footer';
import Spoiler from '../Spoiler';

function Layout(props) {
  const { children } = props;
  return (
    <div>
      <Header />
      {children}
      <Spoiler />
      <Footer />
    </div>
  );
}
Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
Layout.whyDidYouRender = true;
export default withStyles(normalizeCss, s)(React.memo(Layout));
