import React from 'react';
import { FORM_SCHEMA } from '../config/schema';
import FormSection from '../components/FormSection';

const AreaForm = ({ onTotalsChange, projectName, setProjectName, expandToggle, collapseToggle, initialRawItems }) => {
  const handleSectionChange = (sectionData) => {
    onTotalsChange(sectionData);
  };

  return (
    <div className="area-form">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h2>Area Calculation Form</h2>
          <p className="form-desc" style={{ marginBottom: 0 }}>Fill in the dimensions for each applicable section.</p>
        </div>
      </div>

      <div className="section-container" style={{ padding: '1.25rem' }}>
        <div className="field-group">
          <label>Project Name</label>
          <input 
            type="text" 
            placeholder="Enter Project Name (Used for Export files)" 
            value={projectName} 
            onChange={(e) => setProjectName(e.target.value)} 
          />
        </div>
      </div>
      
      {FORM_SCHEMA.map((section) => (
        <FormSection 
          key={section.id} 
          section={section} 
          onChange={handleSectionChange}
          expandToggle={expandToggle}
          collapseToggle={collapseToggle}
          initialData={initialRawItems[section.id] || {}}
        />
      ))}
    </div>
  );
};

export default AreaForm;
