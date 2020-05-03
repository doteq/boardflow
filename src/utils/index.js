import colors from 'vuetify/lib/util/colors';

export const baseColorsArray = Object.entries(colors).flatMap(([key, value]) => {
  if (key === 'shades') return [];
  return value.base;
});

export function getRandomMaterialColor () {
  return baseColorsArray[Math.floor(Math.random() * baseColorsArray.length)];
}
