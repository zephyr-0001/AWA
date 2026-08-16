import React, { useState, useMemo } from 'react';
import { FORM_SCHEMA } from '../config/schema';
import FormSection from '../components/FormSection';

const AreaForm = ({ 
  onTotalsChange, 
  projectName, 
  setProjectName, 
  expandToggle, 
  collapseToggle, 
  initialRawItems,
  customSubsections,
  setCustomSubsections
}) => {
  const [activeSectionId, setActiveSectionId] = useState(null);

  const handleSectionChange = (sectionData) => {
    setActiveSectionId(sectionData.id);
    onTotalsChange(sectionData);
  };

  const handleSectionFocus = (sectionId) => {
    setActiveSectionId(sectionId);
  };

  const handleAddSubsection = (sectionId) => {
    const section = FORM_SCHEMA.find(s => s.id === sectionId);
    if (!section) return;

    // Use the first subsection as the template, or the section itself if it doesn't have subsections
    const template = (section.subsections && section.subsections.length > 0) 
      ? section.subsections[0] 
      : section;

    const name = window.prompt(`Enter name for new subsection under ${section.title.replace(/^\d+\.\s*/, '')}:`);
    if (!name || name.trim() === '') return;

    const newSubsectionId = `${sectionId}_custom_${Date.now()}`;
    const newSubsection = {
      id: newSubsectionId,
      title: name.trim(),
      type: 'multiple', // all custom sections will be multiple rows
      fields: template.fields,
      calcType: template.calcType,
      unit: template.unit
    };

    setCustomSubsections(prev => {
      const existing = prev[sectionId] || [];
      return {
        ...prev,
        [sectionId]: [...existing, newSubsection]
      };
    });
    
    setActiveSectionId(sectionId);
  };

  // Merge FORM_SCHEMA with customSubsections
  const dynamicSchema = useMemo(() => {
    return FORM_SCHEMA.map(section => {
      const customSubs = customSubsections[section.id];
      if (!customSubs || customSubs.length === 0) return section;

      // If the section didn't have subsections before, we need to convert it into a parent with subsections
      if (!section.subsections) {
        return {
          ...section,
          subsections: [
            {
              id: section.id, // original fields stay under the original id
              title: 'General',
              type: section.type,
              fields: section.fields,
              calcType: section.calcType,
              unit: section.unit
            },
            ...customSubs
          ]
        };
      } else {
        return {
          ...section,
          subsections: [...section.subsections, ...customSubs]
        };
      }
    });
  }, [customSubsections]);

  return (
    <div className="area-form">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h2>Bill Of Quantities Form</h2>
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
            onFocus={() => setActiveSectionId(null)}
          />
        </div>
      </div>
      
      {dynamicSchema.map((section) => (
        <FormSection 
          key={section.id} 
          section={section} 
          onChange={handleSectionChange}
          onFocus={() => handleSectionFocus(section.id)}
          isActive={activeSectionId === section.id}
          expandToggle={expandToggle}
          collapseToggle={collapseToggle}
          initialData={initialRawItems[section.id] || {}}
          onAddSubsection={section.id !== 'centre_line' ? () => handleAddSubsection(section.id) : null}
        />
      ))}
    </div>
  );
};

export default AreaForm;
