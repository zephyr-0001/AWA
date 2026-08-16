import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { calculateCFt, calculateSqFt, calculateStairsType1, calculateStairsType2, calculateTMT } from '../utils/calculations';
import '../styles/index.css';

const FormSection = ({ section, onChange, expandToggle, collapseToggle, initialData }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [data, setData] = useState(initialData || {});

  const initialDataStr = JSON.stringify(initialData || {});

  useEffect(() => {
    // Only update internal state if the incoming data actually changed (e.g. from cross-sync)
    if (initialDataStr !== JSON.stringify(data)) {
      setData(JSON.parse(initialDataStr));
    }
  }, [initialDataStr]);

  const getRowTotal = (row, calcType) => {
    switch (calcType) {
      case 'cft':
        return calculateCFt(row.length, row.breadth, row.depth, row.number);
      case 'sqft':
        return calculateSqFt(row.length, row.breadth, row.number);
      case 'stairs1':
        return calculateStairsType1(row.length, row.breadth, row.depth, row.number);
      case 'stairs2':
        return calculateStairsType2(row.length, row.breadth, row.depth);
      case 'tmt':
        return calculateTMT(row.length, row.breadth);
      case 'direct':
        return parseFloat(row.value) || 0;
      default:
        return 0;
    }
  };

  const handleRowChange = (subId, index, field, value) => {
    setData((prev) => {
      const sectionData = prev[subId] || [];
      const newData = [...sectionData];
      if (!newData[index]) newData[index] = {};
      newData[index] = { ...newData[index], [field]: value };
      return { ...prev, [subId]: newData };
    });
  };

  const addRow = (subId) => {
    setData((prev) => {
      const sectionData = prev[subId] || [];
      return { ...prev, [subId]: [...sectionData, {}] };
    });
  };

  const removeRow = (subId, index) => {
    setData((prev) => {
      const sectionData = prev[subId] || [];
      return { ...prev, [subId]: sectionData.filter((_, i) => i !== index) };
    });
  };

  useEffect(() => {
    if (onChange) {
      const payload = { id: section.id, title: section.title, totals: {}, items: data };
      const subItems = section.subsections || [section];
      
      subItems.forEach((sub) => {
        const rows = data[sub.id] || [];
        const total = rows.reduce((sum, row) => sum + getRowTotal(row, sub.calcType), 0);
        payload.totals[sub.id] = { total, unit: sub.unit, title: sub.title };
      });
      
      onChange(payload);
    }
  }, [data, section]);

  useEffect(() => {
    if (expandToggle > 0) setIsOpen(true);
  }, [expandToggle]);

  useEffect(() => {
    if (collapseToggle > 0) setIsOpen(false);
  }, [collapseToggle]);

  const computeSectionTotal = () => {
    let total = 0;
    let unit = '';
    const subItems = section.subsections || [section];
    subItems.forEach((sub) => {
      const rows = data[sub.id] || [];
      total += rows.reduce((sum, row) => sum + getRowTotal(row, sub.calcType), 0);
      unit = sub.unit;
    });
    return { total, unit };
  };

  const renderBlock = (block) => {
    const rows = data[block.id] && data[block.id].length > 0 ? data[block.id] : [{}];
    const blockTotal = rows.reduce((sum, row) => sum + getRowTotal(row, block.calcType), 0);

    return (
      <div key={block.id} className="form-block">
        <div className="block-header">
          <h4>{block.title !== section.title ? block.title : ''}</h4>
          <span className="block-total">Total: {blockTotal.toFixed(2)} {block.unit}</span>
        </div>
        
        {rows.map((row, index) => (
          <div key={index} className="form-row">
            {block.fields.map((field) => (
              <div key={field.name} className="field-group" style={field.name === 'description' ? { flex: 2, minWidth: '200px' } : {}}>
                <label>{field.label}</label>
                {field.type === 'text' ? (
                  <input
                    type="text"
                    value={row[field.name] || ''}
                    onChange={(e) => handleRowChange(block.id, index, field.name, e.target.value)}
                    placeholder={field.label}
                  />
                ) : (
                  <input
                    type="number"
                    value={row[field.name] || ''}
                    onChange={(e) => handleRowChange(block.id, index, field.name, e.target.value)}
                    placeholder={field.default ? String(field.default) : '0'}
                  />
                )}
              </div>
            ))}
            <div className="row-actions">
              <span className="row-total">{getRowTotal(row, block.calcType).toFixed(2)} {block.unit}</span>
              {block.type === 'multiple' && (
                <button className="icon-btn delete-btn" onClick={() => removeRow(block.id, index)} title="Remove row">
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </div>
        ))}
        {block.type === 'multiple' && (
          <button className="add-row-btn" onClick={() => addRow(block.id)}>
            <Plus size={16} /> Add Row
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="section-container">
      <div className="section-header" onClick={() => setIsOpen(!isOpen)}>
        <h3>{section.title}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {!isOpen && (
            <span className="block-total" style={{ fontSize: '0.8rem', padding: '0.15rem 0.5rem' }}>
              Total: {computeSectionTotal().total.toFixed(2)} {computeSectionTotal().unit}
            </span>
          )}
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>
      {isOpen && (
        <div className="section-content">
          {section.subsections ? (
            section.subsections.map(renderBlock)
          ) : (
            renderBlock(section)
          )}
        </div>
      )}
    </div>
  );
};

export default FormSection;
