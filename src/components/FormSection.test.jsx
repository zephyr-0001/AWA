import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FormSection from './FormSection';
import { describe, it, expect, vi } from 'vitest';

describe('FormSection Component', () => {
  const mockSection = {
    id: 'test_section',
    title: 'Test Section',
    type: 'single',
    fields: [
      { name: 'length', label: 'Length', type: 'number' },
      { name: 'breadth', label: 'Breadth', type: 'number' }
    ],
    calcType: 'sqft',
    unit: 'SqFt'
  };

  it('renders section title correctly', () => {
    render(<FormSection section={mockSection} onChange={() => {}} />);
    expect(screen.getByText('Test Section')).toBeInTheDocument();
  });

  it('calculates totals correctly and calls onChange', () => {
    const handleChange = vi.fn();
    render(<FormSection section={mockSection} onChange={handleChange} />);
    
    // There should be inputs for Length and Breadth
    const inputs = screen.getAllByRole('spinbutton'); // number inputs
    
    fireEvent.change(inputs[0], { target: { value: '10' } }); // length
    fireEvent.change(inputs[1], { target: { value: '5' } }); // breadth

    // Expect onChange to be called with correct totals
    expect(handleChange).toHaveBeenCalledWith(expect.objectContaining({
      totals: expect.objectContaining({
        'test_section': expect.objectContaining({ total: 50, unit: 'SqFt' })
      })
    }));
  });
});
