/* eslint-disable no-magic-numbers */
export const defineRotationSpeed = bv => 12 / bv;

export const parseDirection = dr => {
  switch (true) {
    case dr <= -113 && dr >= -158:
      return 'From South West';
    case dr <= -68 && dr > -113:
      return 'From West';
    case dr <= -23 && dr > -68:
      return 'From North West';
    case dr > -23 && dr <= 23:
      return 'From North';
    case dr > 23 && dr <= 68:
      return 'From North East';
    case dr > 68 && dr <= 113:
      return 'From East';
    case dr > 113 && dr <= 158:
      return 'From South East';
    case (dr > 158 && dr <= 180) || (dr < -158 && dr >= -180):
      return 'From South';
    default:
      return 'Error';
  }
};

export const defineRotationDegree = dr => {
  switch (true) {
    case dr <= -113 && dr >= -158:
      return '-135deg';
    case dr <= -68 && dr > -113:
      return '-90deg';
    case dr <= -23 && dr > -68:
      return '-45deg';
    case dr > -23 && dr <= 23:
      return '0deg';
    case dr > 23 && dr <= 68:
      return '45deg';
    case dr > 68 && dr <= 113:
      return '90deg';
    case dr > 113 && dr <= 158:
      return '135deg';
    case (dr > 158 && dr <= 180) || (dr < -158 && dr >= -180):
      return '180deg';
    default:
      return '0deg';
  }
};

export const parseBeaufortValue = bv => {
  switch (bv) {
    case 0:
      return 'Calm';
    case 1:
      return 'Light air';
    case 2:
      return 'Light breeze';
    case 3:
      return 'Gentle breeze';
    case 4:
      return 'Moderate breeze';
    case 5:
      return 'Fresh breeze';
    case 6:
      return 'Strong breeze';
    case 7:
      return 'Near gale';
    case 8:
      return 'Fresh gale';
    case 9:
      return 'Strong gale';
    case 10:
      return 'Storm';
    case 11:
      return 'Violent storm';
    case 12:
      return 'Hurricane force';
    default:
      return 'Error';
  }
};
