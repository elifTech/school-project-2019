import React from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import PropTypes from 'prop-types';

import s from './MenuItem.css';

const MenuItem = ({ item: { text, icon }, isActive, onItemClick }) => {
  function onClick() {
    onItemClick(text);
  }

  return (
    <button
      className={`${s.menuItem} ${isActive && s.menuItemActive}`}
      onClick={onClick}
      type="button"
    >
      <div>{icon}</div>
      {isActive && <div className={s.menuItemText}>{text}</div>}
    </button>
  );
};

MenuItem.propTypes = {
  isActive: PropTypes.bool.isRequired,
  item: PropTypes.shape({
    icon: PropTypes.node.isRequired,
    text: PropTypes.string.isRequired,
  }).isRequired,
  onItemClick: PropTypes.func.isRequired,
};

export default withStyles(s)(MenuItem);
