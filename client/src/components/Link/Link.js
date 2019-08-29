import React from 'react';
import PropTypes from 'prop-types';
import history from '../../history';

function isLeftClickEvent(event) {
  return event.button === 0;
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

export default class Link extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    onClick: PropTypes.func,
    to: PropTypes.string.isRequired,
  };

  static defaultProps = {
    className: '',
    onClick: null,
  };

  handleClick = event => {
    const { onClick, to } = this.props;
    if (onClick) {
      onClick(event);
    }

    if (isModifiedEvent(event) || !isLeftClickEvent(event)) {
      return;
    }

    if (event.defaultPrevented === true) {
      return;
    }

    event.preventDefault();
    history.push(to);
  };

  render() {
    const { to, children, className } = this.props;
    return (
      <a className={className} href={to} onClick={this.handleClick}>
        {children}
      </a>
    );
  }
}
