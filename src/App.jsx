import React, { useState, useEffect } from 'react';
import { Maximize2, Minimize2, RotateCcw, Sun, Moon } from 'lucide-react';
import AreaForm from './pages/AreaForm';
import BasicCostForm from './pages/BasicCostForm';
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
  const [basicCosts, setBasicCosts] = useState(() => {
    const saved = localStorage.getItem('awa_basicCosts');
    return saved ? JSON.parse(saved) : [{ description: '', brand: '', unit: '', rate: '' }];
  });
  const [customSubsections, setCustomSubsections] = useState(() => {
    const saved = localStorage.getItem('awa_customSubsections');
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

  useEffect(() => {
    localStorage.setItem('awa_basicCosts', JSON.stringify(basicCosts));
  }, [basicCosts]);

  useEffect(() => {
    localStorage.setItem('awa_customSubsections', JSON.stringify(customSubsections));
  }, [customSubsections]);

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
    
    setRawItems(prev => {
      const nextRawItems = { ...prev, [sectionData.id]: sectionData.items };
      
      // Cross-sync: Excavation Footings -> PCC Footings & Concrete Footings
      if (sectionData.id === 'excavation') {
        const exFootingsData = sectionData.items['ex_footings'] || [];
        const exCompoundWallData = sectionData.items['ex_compound_wall'] || [];
        const exSumpData = sectionData.items['ex_sump'] || [];
        
        // deep copy to avoid reference sharing which could cause weird bugs
        const clonedFootings = JSON.parse(JSON.stringify(exFootingsData));
        const clonedCompoundWall = JSON.parse(JSON.stringify(exCompoundWallData));
        const clonedSump = JSON.parse(JSON.stringify(exSumpData));
        
        if (!nextRawItems['pcc']) nextRawItems['pcc'] = {};
        nextRawItems['pcc']['pcc_footings'] = clonedFootings;
        nextRawItems['pcc']['pcc_compound_wall'] = clonedCompoundWall;
        nextRawItems['pcc']['pcc_sump'] = clonedSump;
        
        if (!nextRawItems['concrete']) nextRawItems['concrete'] = {};
        nextRawItems['concrete']['con_footings'] = clonedFootings;
      }
      return nextRawItems;
    });
  };

  const handleRatesChange = (newRates) => {
    setRates(newRates);
  };

  const handleClearAll = () => {
    if (window.confirm("WARNING: Are you sure you want to clear all data and start a new project?\n\nPlease make sure you have exported and saved your current work first!")) {
      localStorage.removeItem('awa_formData');
      localStorage.removeItem('awa_rates');
      localStorage.removeItem('awa_projectName');
      localStorage.removeItem('awa_rawItems');
      localStorage.removeItem('awa_basicCosts');
      localStorage.removeItem('awa_customSubsections');
      setFormData({});
      setRates({});
      setProjectName('');
      setRawItems({});
      setBasicCosts([{ description: '', brand: '', unit: '', rate: '' }]);
      setCustomSubsections({});
      setFormKey(k => k + 1);
    }
  };

  return (
    <div className={`app-container ${isDarkMode ? 'dark' : ''}`}>
      <header className="app-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <h1>AWA</h1>
          <button className="theme-toggle" onClick={toggleDarkMode} title="Toggle Theme" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem', width: '36px', height: '36px' }}>
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {activeTab === 'form' && (
            <>
              <button className="btn-compact" onClick={() => setExpandToggle(e => e + 1)} title="Expand All">
                <Maximize2 size={14} /> Expand
              </button>
              <button className="btn-compact" onClick={() => setCollapseToggle(c => c + 1)} title="Collapse All">
                <Minimize2 size={14} /> Collapse
              </button>
            </>
          )}
          <button className="btn-compact danger" onClick={handleClearAll} title="Start New Project">
            <RotateCcw size={14} /> Reset
          </button>
        </div>
      </header>
      
      <nav className="app-nav">
        <button className={activeTab === 'form' ? 'active' : ''} onClick={() => setActiveTab('form')}>BOQ Form</button>
        <button className={activeTab === 'basic_cost' ? 'active' : ''} onClick={() => setActiveTab('basic_cost')}>Basic Cost</button>
        <button className={activeTab === 'rates' ? 'active' : ''} onClick={() => setActiveTab('rates')}>Rates</button>
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
            customSubsections={customSubsections}
            setCustomSubsections={setCustomSubsections}
          />
        </div>
        <div style={{ display: activeTab === 'rates' ? 'block' : 'none' }}>
          <RatesConfig 
            key={`rates-${formKey}`}
            onRatesChange={handleRatesChange} 
            initialRates={rates} 
          />
        </div>
        <div style={{ display: activeTab === 'basic_cost' ? 'block' : 'none' }}>
          <BasicCostForm basicCosts={basicCosts} onChange={setBasicCosts} />
        </div>
        <div style={{ display: activeTab === 'summary' ? 'block' : 'none' }}>
          <Summary formData={formData} rates={rates} rawItems={rawItems} basicCosts={basicCosts} projectName={projectName} />
        </div>
        <div style={{ display: activeTab === 'builder' ? 'block' : 'none' }}>
          <FormBuilderPrototype />
        </div>
      </main>
    </div>
  );
}

export default App;
