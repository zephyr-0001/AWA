import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import { describe, it, expect } from 'vitest';

describe('App Integration', () => {
  it('renders all main tabs', () => {
    render(<App />);
    expect(screen.getByText('AWA')).toBeInTheDocument();
    expect(screen.getByText('BOQ Form')).toBeInTheDocument();
    expect(screen.getByText('Basic Cost')).toBeInTheDocument();
    expect(screen.getByText('Rates Config')).toBeInTheDocument();
    expect(screen.getByText('Summary')).toBeInTheDocument();
    expect(screen.getByText('Form Builder (Proto)')).toBeInTheDocument();
  });

  it('toggles dark mode', () => {
    render(<App />);
    const toggleBtn = screen.getByTitle('Toggle Theme');
    expect(document.body.classList.contains('dark')).toBe(false); // assuming it starts in light mode in test environment
    
    fireEvent.click(toggleBtn);
    expect(document.body.classList.contains('dark')).toBe(true);
    
    fireEvent.click(toggleBtn);
    expect(document.body.classList.contains('dark')).toBe(false);
  });
});
