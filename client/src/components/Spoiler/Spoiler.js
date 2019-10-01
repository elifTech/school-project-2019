import React, { memo } from 'react';
import PropTypes from 'prop-types';
import s from './Spoiler.css';

class Spoiler extends React.PureComponent {
  static propTypes = {
    text: PropTypes.string,
    title: PropTypes.string,
  };

  static defaultProps = {
    text: '',
    title: '',
  };

  state = {
    isOpened: true,
  };

  handleToggle = () => {
    this.setState(state => ({ isOpened: !state.isOpened }));
  };

  render() {
    const { text, title } = this.props;
    const { isOpened } = this.state;
    return (
      <div
        role="button"
        tabIndex={0}
        className={s.spoiler}
        onClick={this.handleToggle}
        onKeyDown={this.handleToggle}
      >
        <div className={s.spoilerTitle}>{title}</div>
        {isOpened ? <div className={s.spoilerText}>{text}</div> : <div />}
      </div>
    );
  }
}

export default memo(Spoiler);
