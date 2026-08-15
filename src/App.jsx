import React, { useState, useEffect } from 'react';
import { Maximize2, Minimize2, RotateCcw } from 'lucide-react';
import AreaForm from './pages/AreaForm';
import RatesConfig from './pages/RatesConfig';
import Summary from './pages/Summary';
import FormBuilderPrototype from './pages/FormBuilderPrototype';
import './styles/index.css';

function App() {
  const [activeTab, setActiveTab] = useState('form');
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('awa_formData');
    return saved ? JSON.parse(saved) : {};
  });
  const [rates, setRates] = useState(() => {
    const saved = localStorage.getItem('awa_rates');
    return saved ? JSON.parse(saved) : {};
  });
  const [projectName, setProjectName] = useState(() => {
    return localStorage.getItem('awa_projectName') || '';
  });
  const [rawItems, setRawItems] = useState(() => {
    const saved = localStorage.getItem('awa_rawItems');
    return saved ? JSON.parse(saved) : {};
  });

  const [expandToggle, setExpandToggle] = useState(0);
  const [collapseToggle, setCollapseToggle] = useState(0);

  // A key to force remount FormSections on clear
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
      document.body.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('awa_formData', JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    localStorage.setItem('awa_rates', JSON.stringify(rates));
  }, [rates]);

  useEffect(() => {
    localStorage.setItem('awa_projectName', projectName);
  }, [projectName]);

  useEffect(() => {
    localStorage.setItem('awa_rawItems', JSON.stringify(rawItems));
  }, [rawItems]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  };

  const handleTotalsChange = (sectionData) => {
    setFormData(prev => ({ ...prev, [sectionData.id]: sectionData }));
    setRawItems(prev => ({ ...prev, [sectionData.id]: sectionData.items }));
  };

  const handleRatesChange = (newRates) => {
    setRates(newRates);
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all data and start a new project?")) {
      localStorage.removeItem('awa_formData');
      localStorage.removeItem('awa_rates');
      localStorage.removeItem('awa_projectName');
      localStorage.removeItem('awa_rawItems');
      setFormData({});
      setRates({});
      setProjectName('');
      setRawItems({});
      setFormKey(k => k + 1);
    }
  };

  return (
    <div className={`app-container ${isDarkMode ? 'dark' : ''}`}>
      <header className="app-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <h1>AWA</h1>
          <button className="theme-toggle" onClick={toggleDarkMode}>
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
        
        {activeTab === 'form' && (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button className="btn-compact" onClick={() => setExpandToggle(e => e + 1)} title="Expand All">
              <Maximize2 size={14} /> Expand
            </button>
            <button className="btn-compact" onClick={() => setCollapseToggle(c => c + 1)} title="Collapse All">
              <Minimize2 size={14} /> Collapse
            </button>
            <button className="btn-compact danger" onClick={handleClearAll} title="Start New Project">
              <RotateCcw size={14} /> Reset
            </button>
          </div>
        )}
      </header>
      
      <nav className="app-nav">
        <button className={activeTab === 'form' ? 'active' : ''} onClick={() => setActiveTab('form')}>Area Form</button>
        <button className={activeTab === 'rates' ? 'active' : ''} onClick={() => setActiveTab('rates')}>Rates Config</button>
        <button className={activeTab === 'summary' ? 'active' : ''} onClick={() => setActiveTab('summary')}>Summary</button>
        <button className={activeTab === 'builder' ? 'active' : ''} onClick={() => setActiveTab('builder')}>Form Builder (Proto)</button>
      </nav>

      <main className="app-main">
        <div style={{ display: activeTab === 'form' ? 'block' : 'none' }}>
          <AreaForm 
            key={formKey}
            onTotalsChange={handleTotalsChange} 
            projectName={projectName} 
            setProjectName={setProjectName} 
            expandToggle={expandToggle}
            collapseToggle={collapseToggle}
            initialRawItems={rawItems}
          />
        </div>
        <div style={{ display: activeTab === 'rates' ? 'block' : 'none' }}>
          <RatesConfig 
            key={`rates-${formKey}`}
            onRatesChange={handleRatesChange} 
            initialRates={rates} 
          />
        </div>
        <div style={{ display: activeTab === 'summary' ? 'block' : 'none' }}>
          <Summary formData={formData} rates={rates} rawItems={rawItems} projectName={projectName} />
        </div>
        <div style={{ display: activeTab === 'builder' ? 'block' : 'none' }}>
          <FormBuilderPrototype />
        </div>
      </main>
    </div>
  );
}

export default App;
