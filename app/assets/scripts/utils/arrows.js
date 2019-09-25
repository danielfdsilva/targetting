export const arrows = [
  {
    id: '6mm',
    name: '6mm arrow',
    thickness: 6
  }
];

export const getArrow = id => arrows.find(a => a.id === id);
