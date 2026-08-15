export const FORM_SCHEMA = [
  {
    id: 'centre_line',
    title: '1. Centre Line',
    type: 'single',
    fields: [{ name: 'value', label: 'Value', type: 'number' }],
    calcType: 'direct',
    unit: 'SqFt'
  },
  {
    id: 'excavation',
    title: '2. Excavation',
    subsections: [
      {
        id: 'ex_footings',
        title: 'Footings',
        type: 'multiple',
        fields: [
          { name: 'description', label: 'Description', type: 'text' },
          { name: 'length', label: 'Length', type: 'number' },
          { name: 'breadth', label: 'Breadth', type: 'number' },
          { name: 'depth', label: 'Depth', type: 'number' },
          { name: 'number', label: 'Number', type: 'number', default: 1 }
        ],
        calcType: 'cft',
        unit: 'CFt'
      },
      {
        id: 'ex_compound_wall',
        title: 'Compound Wall',
        type: 'single',
        fields: [
          { name: 'length', label: 'Centre Line (Length)', type: 'number' },
          { name: 'breadth', label: 'Width', type: 'number' }, // using breadth internally
          { name: 'depth', label: 'Depth', type: 'number' }
        ],
        calcType: 'cft',
        unit: 'CFt'
      },
      {
        id: 'ex_sump',
        title: 'Sump',
        type: 'single',
        fields: [
          { name: 'length', label: 'Length', type: 'number' },
          { name: 'breadth', label: 'Breadth', type: 'number' },
          { name: 'depth', label: 'Depth', type: 'number' }
        ],
        calcType: 'cft',
        unit: 'CFt'
      }
    ]
  },
  {
    id: 'pcc',
    title: '3. PCC 1:4:8',
    subsections: [
      {
        id: 'pcc_footings',
        title: 'Footings',
        type: 'multiple',
        fields: [
          { name: 'description', label: 'Description', type: 'text' },
          { name: 'length', label: 'Length', type: 'number' },
          { name: 'breadth', label: 'Breadth', type: 'number' },
          { name: 'depth', label: 'Depth', type: 'number' },
          { name: 'number', label: 'Number', type: 'number', default: 1 }
        ],
        calcType: 'cft',
        unit: 'CFt'
      }
    ]
  },
  {
    id: 'concrete',
    title: '4. Concrete',
    subsections: [
      {
        id: 'con_footings',
        title: 'Footings',
        type: 'multiple',
        fields: [
          { name: 'description', label: 'Description', type: 'text' },
          { name: 'length', label: 'Length', type: 'number' },
          { name: 'breadth', label: 'Breadth', type: 'number' },
          { name: 'depth', label: 'Depth', type: 'number' },
          { name: 'number', label: 'Number', type: 'number', default: 1 }
        ],
        calcType: 'cft',
        unit: 'CFt'
      },
      {
        id: 'con_columns',
        title: 'Columns',
        type: 'multiple',
        fields: [
          { name: 'description', label: 'Description', type: 'text' },
          { name: 'length', label: 'Length', type: 'number' },
          { name: 'breadth', label: 'Breadth', type: 'number' },
          { name: 'depth', label: 'Depth', type: 'number' },
          { name: 'number', label: 'Number', type: 'number', default: 1 }
        ],
        calcType: 'cft',
        unit: 'CFt'
      },
      {
        id: 'con_plinth',
        title: 'Plinth Beam',
        type: 'single',
        fields: [
          { name: 'length', label: 'Central Line', type: 'number' },
          { name: 'breadth', label: 'Width', type: 'number' },
          { name: 'depth', label: 'Depth', type: 'number' }
        ],
        calcType: 'cft',
        unit: 'CFt'
      },
      {
        id: 'con_lintel',
        title: 'Lintel Concrete',
        type: 'single',
        fields: [
          { name: 'length', label: 'Central Line', type: 'number' },
          { name: 'breadth', label: 'Width', type: 'number' },
          { name: 'depth', label: 'Height', type: 'number' } // using depth internally as height for formula compatibility
        ],
        calcType: 'cft',
        unit: 'CFt'
      },
      {
        id: 'con_beams',
        title: 'Beams Concrete',
        type: 'single',
        fields: [
          { name: 'length', label: 'Central Line', type: 'number' },
          { name: 'breadth', label: 'Width', type: 'number' },
          { name: 'depth', label: 'Height', type: 'number' }
        ],
        calcType: 'cft',
        unit: 'CFt'
      },
      {
        id: 'con_roof',
        title: 'Roof Slab',
        type: 'single',
        fields: [
          { name: 'length', label: 'Length', type: 'number' },
          { name: 'breadth', label: 'Breadth', type: 'number' },
          { name: 'depth', label: 'Thickness', type: 'number' }
        ],
        calcType: 'cft',
        unit: 'CFt'
      },
      {
        id: 'con_stairs_1',
        title: 'Stairs (Type 1)',
        type: 'single',
        fields: [
          { name: 'length', label: 'Length', type: 'number' },
          { name: 'breadth', label: 'Breadth', type: 'number' },
          { name: 'depth', label: 'Depth', type: 'number' },
          { name: 'number', label: 'Number', type: 'number', default: 1 }
        ],
        calcType: 'stairs1',
        unit: 'CFt'
      },
      {
        id: 'con_stairs_2',
        title: 'Stairs (Type 2)',
        type: 'single',
        fields: [
          { name: 'length', label: 'Length', type: 'number' },
          { name: 'breadth', label: 'Width', type: 'number' },
          { name: 'depth', label: 'Depth', type: 'number' }
        ],
        calcType: 'stairs2',
        unit: 'CFt'
      },
      {
        id: 'con_chajja',
        title: 'Chajja',
        type: 'single',
        fields: [
          { name: 'length', label: 'Length', type: 'number' },
          { name: 'breadth', label: 'Width', type: 'number' },
          { name: 'number', label: 'Number', type: 'number', default: 1 }
        ],
        calcType: 'sqft',
        unit: 'SqFt'
      }
    ]
  },
  {
    id: 'masonry',
    title: '5. Masonry',
    subsections: [
      {
        id: 'mas_solid',
        title: 'Solid Blocks',
        type: 'single',
        fields: [
          { name: 'length', label: 'Central Line', type: 'number' },
          { name: 'breadth', label: 'Height', type: 'number' }
        ],
        calcType: 'sqft',
        unit: 'SqFt'
      },
      {
        id: 'mas_bricks',
        title: 'Bricks',
        type: 'single',
        fields: [
          { name: 'length', label: 'Central Line', type: 'number' },
          { name: 'breadth', label: 'Width', type: 'number' },
          { name: 'depth', label: 'Height', type: 'number' }
        ],
        calcType: 'cft',
        unit: 'CFt'
      }
    ]
  },
  {
    id: 'plastering',
    title: '6. Plastering',
    subsections: [
      {
        id: 'plas_inside',
        title: 'Inside',
        type: 'single',
        fields: [
          { name: 'length', label: 'Centre Line', type: 'number' },
          { name: 'breadth', label: 'Height', type: 'number' }
        ],
        calcType: 'sqft',
        unit: 'SqFt'
      },
      {
        id: 'plas_outside',
        title: 'Outside',
        type: 'single',
        fields: [
          { name: 'length', label: 'Centre Line', type: 'number' },
          { name: 'breadth', label: 'Height', type: 'number' }
        ],
        calcType: 'sqft',
        unit: 'SqFt'
      },
      {
        id: 'plas_ceiling',
        title: 'Ceiling',
        type: 'single',
        fields: [
          { name: 'length', label: 'Centre Line', type: 'number' },
          { name: 'breadth', label: 'Breadth', type: 'number' },
          { name: 'number', label: 'Number', type: 'number', default: 1 }
        ],
        calcType: 'sqft',
        unit: 'SqFt'
      }
    ]
  },
  {
    id: 'flooring',
    title: '7. Flooring',
    type: 'multiple',
    fields: [
      { name: 'description', label: 'Description', type: 'text' },
      { name: 'length', label: 'Length', type: 'number' },
      { name: 'breadth', label: 'Breadth', type: 'number' }
    ],
    calcType: 'sqft',
    unit: 'SqFt'
  },
  {
    id: 'dadooing',
    title: '8. Dadooing',
    type: 'multiple',
    fields: [
      { name: 'description', label: 'Description', type: 'text' },
      { name: 'length', label: 'Length', type: 'number' },
      { name: 'breadth', label: 'Height', type: 'number' } // using breadth as generic multiplier field
    ],
    calcType: 'sqft',
    unit: 'SqFt'
  },
  {
    id: 'doors',
    title: '9. Doors',
    type: 'multiple',
    fields: [
      { name: 'description', label: 'Description', type: 'text' },
      { name: 'length', label: 'Length', type: 'number' },
      { name: 'breadth', label: 'Height', type: 'number' },
      { name: 'number', label: 'Number', type: 'number', default: 1 }
    ],
    calcType: 'sqft',
    unit: 'SqFt'
  },
  {
    id: 'windows',
    title: '10. Windows',
    type: 'multiple',
    fields: [
      { name: 'description', label: 'Description', type: 'text' },
      { name: 'length', label: 'Length', type: 'number' },
      { name: 'breadth', label: 'Height', type: 'number' },
      { name: 'number', label: 'Number', type: 'number', default: 1 }
    ],
    calcType: 'sqft',
    unit: 'SqFt'
  },
  {
    id: 'ms_works',
    title: '11. MS Works',
    subsections: [
      {
        id: 'ms_tmt',
        title: 'TMT Steels',
        type: 'single',
        fields: [
          { name: 'length', label: 'Area', type: 'number' }, // using length as param 1
          { name: 'breadth', label: 'Kilograms', type: 'number' } // using breadth as param 2
        ],
        calcType: 'tmt',
        unit: 'Kgs'
      },
      {
        id: 'ms_grill',
        title: 'MS Grill',
        type: 'multiple',
        fields: [
          { name: 'description', label: 'Description', type: 'text' },
          { name: 'length', label: 'Length', type: 'number' },
          { name: 'breadth', label: 'Height', type: 'number' },
          { name: 'number', label: 'Number', type: 'number', default: 1 }
        ],
        calcType: 'sqft',
        unit: 'SqFt'
      },
      {
        id: 'ms_railing',
        title: 'MS Railing',
        type: 'multiple',
        fields: [
          { name: 'description', label: 'Description', type: 'text' },
          { name: 'length', label: 'Length', type: 'number' },
          { name: 'breadth', label: 'Height', type: 'number' },
          { name: 'number', label: 'Number', type: 'number', default: 1 }
        ],
        calcType: 'sqft',
        unit: 'SqFt'
      },
      {
        id: 'ms_gate',
        title: 'MS Gate',
        type: 'multiple',
        fields: [
          { name: 'description', label: 'Description', type: 'text' },
          { name: 'length', label: 'Length', type: 'number' },
          { name: 'breadth', label: 'Height', type: 'number' },
          { name: 'number', label: 'Number', type: 'number', default: 1 }
        ],
        calcType: 'sqft',
        unit: 'SqFt'
      }
    ]
  },
  {
    id: 'weather_proofing',
    title: '12. Weather Proofing',
    subsections: [
      {
        id: 'wp_terrace',
        title: 'Terrace',
        type: 'single',
        fields: [
          { name: 'length', label: 'Length', type: 'number' },
          { name: 'breadth', label: 'Breadth', type: 'number' }
        ],
        calcType: 'sqft',
        unit: 'SqFt'
      },
      {
        id: 'wp_bathroom',
        title: 'Bathroom',
        type: 'single',
        fields: [
          { name: 'length', label: 'Length', type: 'number' },
          { name: 'breadth', label: 'Breadth', type: 'number' }
        ],
        calcType: 'sqft',
        unit: 'SqFt'
      }
    ]
  },
  {
    id: 'painting',
    title: '13. Painting',
    subsections: [
      {
        id: 'paint_inside',
        title: 'Inside',
        type: 'multiple',
        fields: [
          { name: 'description', label: 'Description', type: 'text' },
          { name: 'length', label: 'Length', type: 'number' },
          { name: 'breadth', label: 'Height', type: 'number' },
          { name: 'number', label: 'Number', type: 'number', default: 1 }
        ],
        calcType: 'sqft',
        unit: 'SqFt'
      },
      {
        id: 'paint_outside',
        title: 'Outside',
        type: 'multiple',
        fields: [
          { name: 'description', label: 'Description', type: 'text' },
          { name: 'length', label: 'Length', type: 'number' },
          { name: 'breadth', label: 'Height', type: 'number' },
          { name: 'number', label: 'Number', type: 'number', default: 1 }
        ],
        calcType: 'sqft',
        unit: 'SqFt'
      },
      {
        id: 'paint_enamel',
        title: 'Enamel',
        type: 'multiple',
        fields: [
          { name: 'description', label: 'Description', type: 'text' },
          { name: 'length', label: 'Length', type: 'number' },
          { name: 'breadth', label: 'Height', type: 'number' },
          { name: 'number', label: 'Number', type: 'number', default: 1 }
        ],
        calcType: 'sqft',
        unit: 'SqFt'
      },
      {
        id: 'paint_polishing',
        title: 'Polishing',
        type: 'multiple',
        fields: [
          { name: 'description', label: 'Description', type: 'text' },
          { name: 'length', label: 'Length', type: 'number' },
          { name: 'breadth', label: 'Height', type: 'number' },
          { name: 'number', label: 'Number', type: 'number', default: 1 }
        ],
        calcType: 'sqft',
        unit: 'SqFt'
      }
    ]
  },
  {
    id: 'compound_wall',
    title: '14. Compound Wall',
    type: 'single',
    fields: [
      { name: 'length', label: 'Length', type: 'number' },
      { name: 'breadth', label: 'Height', type: 'number' }
    ],
    calcType: 'sqft',
    unit: 'SqFt'
  },
  {
    id: 'sump_liters',
    title: '15. Sump',
    type: 'single',
    fields: [{ name: 'value', label: 'Value (Liters)', type: 'number' }],
    calcType: 'direct',
    unit: 'Liters'
  },
  {
    id: 'overhead_tank',
    title: '16. Overhead Tank',
    type: 'single',
    fields: [{ name: 'value', label: 'Value (Liters)', type: 'number' }],
    calcType: 'direct',
    unit: 'Liters'
  },
  {
    id: 'plumbing',
    title: '17. Plumbing Works',
    type: 'single',
    fields: [{ name: 'value', label: 'Value (Numbers)', type: 'number' }],
    calcType: 'direct',
    unit: 'Numbers'
  },
  {
    id: 'fittings',
    title: '18. Fittings',
    type: 'single',
    fields: [{ name: 'value', label: 'Value (Numbers)', type: 'number' }],
    calcType: 'direct',
    unit: 'Numbers'
  },
  {
    id: 'electrical',
    title: '19. Electrical Works',
    type: 'single',
    fields: [{ name: 'value', label: 'Area', type: 'number' }],
    calcType: 'direct',
    unit: 'SqFt'
  },
  {
    id: 'drainage',
    title: '20. Drainage Slab',
    type: 'single',
    fields: [
      { name: 'length', label: 'Length', type: 'number' },
      { name: 'breadth', label: 'Width', type: 'number' }
    ],
    calcType: 'sqft',
    unit: 'SqFt'
  }
];
