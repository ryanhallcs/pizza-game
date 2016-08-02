

var _upgrades = [
    {
        name: 'boltcutters',
        affectedResources: [
            'ingredients'
        ],
        enabled: false,
        multiple: false
    },
    {
        name: 'microwave',
        affectedResources: [
            'pizza'
        ],
        enabled: false,
        multiple: true
    }
];

var _helpers = [
    {
        name: 'roommate',
        initialCost: 1,
        enabled: false,
        costIncrease: 0.8,
        productionRate: 0.2,
        amount: 0
    },
    {
        name: 'neighbor',
        initialCost: 100,
        enabled: false,
        costIncrease: 0.8,
        productionRate: 1,
        amount: 0
    },
];