/* eslint-disable react/destructuring-assignment */
// import React, { Component } from 'react';
// import withStyles from 'isomorphic-style-loader/withStyles';
// import { Doughnut } from 'react-chartjs-2';
// import s from './Home.css';

// const time = 1000;
// const color = 'rgba(75,192,192,1)';

// function getRandomInt(min, max) {
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// class Widget extends Component {
//   static propTypes = {};

//   constructor(props) {
//     super(props);

//     // eslint-disable-next-line react/state-in-constructor
//     this.state = {
//       datasets: [
//         {
//           backgroundColor: ['#FBBC15', '#179C52', '#EA4325'],
//           data: [
//             getRandomInt(50, 100),
//             getRandomInt(150, 500),
//             getRandomInt(500, 800),
//           ],
//           hoverBackgroundColor: ['#F7D529', '#34A853', '#FF3E30'],
//         },
//       ],
//       labels: ['Attention', 'Good', 'Danger'],
//     };
//   }

//   render() {
//     return (
//       <div className={s.root}>
//         <div className={s.container}>
//           <h1>Hello, Eliftech School</h1>
//           <div>
//             {' '}
//             <Doughnut data={this.state} options={this.state.options} />
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

// Widget.whyDidYouRender = true;
// export default withStyles(s)(React.memo(Widget));

import React from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import s from './Home.css';

function Dashboard() {
  return (
    <div className={s.root}>
      <div className={s.container}>Dashboard</div>
    </div>
  );
}
Dashboard.whyDidYouRender = true;
export default withStyles(s)(React.memo(Dashboard));
