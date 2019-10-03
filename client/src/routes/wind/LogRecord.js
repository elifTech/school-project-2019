import React from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import Fade from 'react-reveal/Fade';
import s from './css/Record.css';

const Record = ({ record: { id, day, time, description, speed }, pos }) => {
  return (
    <Fade bottom delay={550 + id * pos}>
      <div className={s.container}>
        <div className={s.indicator}>Indicator</div>
        <div className={s.speed}>{speed}</div>
        <div className={s.description}>{description}</div>
        <div className={s.date}>
          {day},<br />
          {time}
        </div>
      </div>
    </Fade>
  );
};

export default withStyles(s)(Record);
