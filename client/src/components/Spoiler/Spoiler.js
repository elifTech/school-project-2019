import classNames from 'classnames';
import React from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import s from './Spoiler.css';

class Spoiler extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'title',
      text: 'lorem ipsum dolor',
      isOpen: false,
    };
  }

  setTitle(event) {
    this.setState({ value: event.target.value });
  }

  setText(event) {
    this.setState({ text: event.target.value });
  }

  handleToggle = () => {this.setState( state => ({ isOpen: !state.isOpen }))}

  render() {
    const {isOpen} = this.state;

    return (
      <div className={s.container}>
        <div className={s.spoilerInp}>
          Set spoiler title: <br />
          <input value={this.state.value} onChange={e => this.setTitle(e)} />
        </div>
        <div className={s.spoilerInp}>
          Set spoiler body: <br />
          <textarea value={this.state.text} onChange={e => this.setText(e)} />
        </div>

        <div className={s.spoiler} onClick={this.handleToggle}>
          <div className={s.spoilerTitle} id="spoilerTitle">
            {this.state.value}
          </div>
          
          <div>
            <div
              className={
                classNames(
                  s.spoilerText,
                  {
                    [s.spoilerHidden]: isOpen,
                  },
                )
              }
              id="spoilerText"
            >
              {this.state.text}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Spoiler.whyDidYouRender = true;
export default withStyles(s)(React.memo(Spoiler));
