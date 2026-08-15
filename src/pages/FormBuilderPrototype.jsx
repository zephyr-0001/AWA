import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

// A mock isolated state for prototyping how a user might configure the fields
const FormBuilderPrototype = () => {
  const [fields, setFields] = useState([
    { id: 1, name: 'description', label: 'Description', type: 'text' },
    { id: 2, name: 'length', label: 'Length', type: 'number' },
    { id: 3, name: 'breadth', label: 'Breadth', type: 'number' },
  ]);

  const handleAddField = () => {
    setFields([...fields, { id: Date.now(), name: `field_${Date.now()}`, label: 'New Field', type: 'number' }]);
  };

  const handleRemoveField = (id) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const handleFieldChange = (id, prop, value) => {
    setFields(fields.map(f => f.id === id ? { ...f, [prop]: value } : f));
  };

  return (
    <div className="form-builder-proto">
      <h2>Form Builder (Prototype)</h2>
      <p className="form-desc">
        Mockup interface for configuring form fields dynamically. Note: This is an isolated prototype and does not affect the actual Area Form.
      </p>

      <div className="builder-container">
        <div className="builder-config">
          <h3>Configure Fields</h3>
          {fields.map(field => (
            <div key={field.id} className="builder-field-row">
              <input 
                type="text" 
                value={field.label} 
                onChange={e => handleFieldChange(field.id, 'label', e.target.value)}
                placeholder="Field Label"
              />
              <select 
                value={field.type} 
                onChange={e => handleFieldChange(field.id, 'type', e.target.value)}
              >
                <option value="number">Number</option>
                <option value="text">Text</option>
              </select>
              <button onClick={() => handleRemoveField(field.id)} className="icon-btn delete-btn">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button onClick={handleAddField} className="add-row-btn" style={{ marginTop: '1rem' }}>
            <Plus size={16} /> Add Field
          </button>
        </div>

        <div className="builder-preview">
          <h3>Live Preview</h3>
          <div className="form-block preview-block">
            <div className="form-row">
              {fields.map(field => (
                <div key={field.id} className="field-group">
                  <label>{field.label}</label>
                  <input type={field.type} placeholder={field.label} disabled />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormBuilderPrototype;
