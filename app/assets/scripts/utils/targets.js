export const targets = [
  {
    id: 'standard-0.5',
    name: 'Standard half size (100mm)',
    rings: [
      {
        radius: 5,
        points: 10,
        color: '#fffaad'
      },
      {
        radius: 10,
        points: 9,
        color: '#fffaad'
      },
      {
        radius: 20,
        points: 9,
        color: '#fffaad',
        separator: true
      },
      {
        radius: 30,
        points: 8,
        color: '#f5aea6'
      },
      {
        radius: 40,
        points: 7,
        color: '#f5aea6',
        separator: true
      },
      {
        radius: 50,
        points: 6,
        color: '#a0d9eb',
        separator: true
      }
    ]
  },
  {
    id: 'standard',
    name: 'Standard Compound',
    rings: [
      {
        radius: 10,
        points: 10,
        color: '#fffaad'
      },
      {
        radius: 20,
        points: 9,
        color: '#fffaad'
      },
      {
        radius: 40,
        points: 9,
        color: '#fffaad',
        separator: true
      },
      {
        radius: 60,
        points: 8,
        color: '#f5aea6'
      },
      {
        radius: 80,
        points: 7,
        color: '#f5aea6',
        separator: true
      },
      {
        radius: 100,
        points: 6,
        color: '#a0d9eb',
        separator: true
      }
    ]
  }
];

export const getTarget = id => targets.find(t => t.id === id);

export const getTargetMaxRange = id => getTarget(id).rings[0].points;
