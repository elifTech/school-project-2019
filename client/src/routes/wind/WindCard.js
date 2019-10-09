import React from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import PropTypes from 'prop-types';
import Fade from 'react-reveal/Fade';
import s from './css/WindCard.css';

const WindCard = ({ header, children }) => (
  <Fade bottom delay={300}>
    <div className={s.container}>
      <div className={s.header}>
        <h3 className={s.heading}>{header}</h3>
      </div>
      <div className={s.indicator}>{children}</div>
    </div>
  </Fade>
);

WindCard.propTypes = {
  children: PropTypes.node.isRequired,
  header: PropTypes.string.isRequired,
};

export default withStyles(s)(WindCard);
