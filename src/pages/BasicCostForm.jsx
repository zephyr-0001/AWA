import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import '../styles/index.css';

const BasicCostForm = ({ basicCosts, onChange }) => {
  const handleRowChange = (index, field, value) => {
    const newData = [...basicCosts];
    newData[index] = { ...newData[index], [field]: value };
    onChange(newData);
  };

  const addRow = () => {
    onChange([...basicCosts, { description: '', brand: '', unit: '', rate: '' }]);
  };

  const removeRow = (index) => {
    onChange(basicCosts.filter((_, i) => i !== index));
  };

  // Ensure there's always at least one row
  useEffect(() => {
    if (!basicCosts || basicCosts.length === 0) {
      onChange([{ description: '', brand: '', unit: '', rate: '' }]);
    }
  }, [basicCosts, onChange]);

  return (
    <div className="section-container" style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2>Basic Cost of Materials</h2>
        <p className="form-desc">
          Enter the materials, brand, unit and rate for reference. This will be exported as a separate sheet in Excel.
        </p>
      </div>

      <div className="summary-table-container">
        <table className="summary-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Brand</th>
              <th>Unit</th>
              <th>Rate</th>
              <th style={{ width: '60px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {basicCosts && basicCosts.map((row, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="text"
                    value={row.description || ''}
                    onChange={(e) => handleRowChange(index, 'description', e.target.value)}
                    placeholder="E.g. Cement 43 Grade"
                    style={{ border: 'none', boxShadow: 'none', background: 'transparent', padding: '0.25rem' }}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={row.brand || ''}
                    onChange={(e) => handleRowChange(index, 'brand', e.target.value)}
                    placeholder="Brand"
                    style={{ border: 'none', boxShadow: 'none', background: 'transparent', padding: '0.25rem' }}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={row.unit || ''}
                    onChange={(e) => handleRowChange(index, 'unit', e.target.value)}
                    placeholder="Unit"
                    style={{ border: 'none', boxShadow: 'none', background: 'transparent', padding: '0.25rem' }}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={row.rate || ''}
                    onChange={(e) => handleRowChange(index, 'rate', e.target.value)}
                    placeholder="0"
                    style={{ border: 'none', boxShadow: 'none', background: 'transparent', padding: '0.25rem' }}
                  />
                </td>
                <td>
                  <button className="icon-btn delete-btn" onClick={() => removeRow(index)} title="Remove row">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div style={{ marginTop: '1.5rem' }}>
        <button className="add-row-btn" onClick={addRow}>
          <Plus size={16} /> Add Row
        </button>
      </div>
    </div>
  );
};

export default BasicCostForm;
