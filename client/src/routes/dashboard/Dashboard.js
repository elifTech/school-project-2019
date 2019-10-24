import React from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import s from './Dashboard.css';
import WaterQualityWidget from '../../components/Widgets/WaterQualityWidget';

function Dashboard() {
  return (
    <div className={s.root}>
      <div className={s.container}>Dashboard</div>
      <WaterQualityWidget value="10" />
    </div>
  );
}
Dashboard.whyDidYouRender = true;
export default withStyles(s)(React.memo(Dashboard));
