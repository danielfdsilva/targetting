export const arrows = [
  {
    id: '6mm',
    name: '6mm arrow',
    thickness: 6
  },
  {
    id: 'fatboy',
    name: 'FatBoy (9.3mm)',
    thickness: 9.3
  }
];

export const getArrow = id => arrows.find(a => a.id === id);
