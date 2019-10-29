/* eslint-disable no-magic-numbers */

export default events => {
  let goodLv = 0;
  let dangLv = 0;
  let attentL = 0;

  events.map(event => {
    if (event.signal > 150) {
      dangLv += 1;
    } else if (event.signal > 50) {
      attentL += 1;
      return attentL;
    } else {
      goodLv += 1;
      return goodLv;
    }
    return [];
  });

  return {
    datasets: [
      {
        backgroundColor: ['#FBBC15', '#179C52', '#EA4325'],
        data: [attentL, goodLv, dangLv],
        hoverBackgroundColor: ['#F7D529', '#34A853', '#FF3E30'],
      },
    ],
    labels: ['Attention', 'Good', 'Danger'],
  };
};
