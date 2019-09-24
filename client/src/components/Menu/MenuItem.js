import React from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import PropTypes from 'prop-types';
import Link from '../Link/Link';

import s from './MenuItem.css';

const MenuItem = ({ item: { path, text, icon }, isActive }) => {
  return (
    <Link to={path} className={`${s.menuItem} ${isActive && s.menuItemActive}`}>
      <div>{icon}</div>
      {isActive && <div className={s.menuItemText}>{text}</div>}
    </Link>
  );
};

MenuItem.propTypes = {
  isActive: PropTypes.bool.isRequired,
  item: PropTypes.shape({
    icon: PropTypes.node.isRequired,
    path: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  }).isRequired,
};

export default withStyles(s)(MenuItem);
