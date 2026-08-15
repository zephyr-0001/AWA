import React, { useState, useEffect } from 'react';
import { FORM_SCHEMA } from '../config/schema';

const RatesConfig = ({ onRatesChange, initialRates }) => {
  const getDefaultRates = () => {
    const defaultRates = {};
    FORM_SCHEMA.forEach(section => {
      if (section.subsections) {
        section.subsections.forEach(sub => {
          defaultRates[sub.id] = initialRates?.[sub.id] !== undefined ? initialRates[sub.id] : 0;
        });
      } else {
        defaultRates[section.id] = initialRates?.[section.id] !== undefined ? initialRates[section.id] : 0;
      }
    });
    return defaultRates;
  };

  const [rates, setRates] = useState(getDefaultRates());

  const handleRateChange = (id, value) => {
    const newRates = { ...rates, [id]: parseFloat(value) || 0 };
    setRates(newRates);
    onRatesChange(newRates);
  };

  useEffect(() => {
    onRatesChange(rates);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="rates-config">
      <h2>Rates Configuration</h2>
      <p className="form-desc">Set the predefined rates for each construction phase.</p>

      {FORM_SCHEMA.map(section => (
        <div key={section.id} className="rate-section">
          <h3>{section.title}</h3>
          <div className="rate-fields">
            {section.subsections ? (
              section.subsections.map(sub => (
                <div key={sub.id} className="field-group">
                  <label>{sub.title} (Rate per {sub.unit})</label>
                  <input
                    type="number"
                    value={rates[sub.id] === 0 ? '' : rates[sub.id]}
                    onChange={(e) => handleRateChange(sub.id, e.target.value)}
                    placeholder="0"
                  />
                </div>
              ))
            ) : (
              <div className="field-group">
                <label>Rate per {section.unit}</label>
                <input
                  type="number"
                  value={rates[section.id] === 0 ? '' : rates[section.id]}
                  onChange={(e) => handleRateChange(section.id, e.target.value)}
                  placeholder="0"
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RatesConfig;
