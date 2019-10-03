/* eslint-disable no-magic-numbers */
export const defineRotationSpeed = bv => 12 / bv;

export const parseDirection = dr => {
  switch (dr) {
    case 'ne':
      return 'From North East';
    case 'se':
      return 'From South East';
    case 'nw':
      return 'From North West';
    case 'sw':
      return 'From South West';
    default:
      return 'Error';
  }
};

export const defineRotationDegree = dr => {
  switch (dr) {
    case 'n':
      return '0deg';
    case 'e':
      return '90deg';
    case 's':
      return '180deg';
    case 'w':
      return '-90deg';
    case 'ne':
      return '45deg';
    case 'nw':
      return '-45deg';
    case 'se':
      return '135deg';
    case 'sw':
      return '-135deg';
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
