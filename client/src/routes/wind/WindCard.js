import React from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import Fade from 'react-reveal/Fade';
import s from './css/WindCard.css';

class WindCard extends React.Component {
  state = { some: 1 };

  render() {
    const { header, children } = this.props;
    return (
      <Fade bottom delay={300}>
        <div className={s.container}>
          <div className={s.header}>
            <h3 className={s.heading}>{header}</h3>
            <div className={s.options}>
              <svg width="24" height="6" viewBox="0 0 24 6">
                <circle cx="3" cy="3" r="3" fill="#C4C4C4" />
                <circle cx="12" cy="3" r="3" fill="#C4C4C4" />
                <circle cx="21" cy="3" r="3" fill="#C4C4C4" />
              </svg>
            </div>
          </div>
          <div className={s.indicator}>{children}</div>
        </div>
      </Fade>
    );
  }
}

export default withStyles(s)(WindCard);
