import React from 'react';
import { Download } from 'lucide-react';
import { exportToPdf } from '../utils/exportPdf';
import { exportToExcel } from '../utils/exportExcel';
import { FORM_SCHEMA } from '../config/schema';
import '../styles/index.css';

const Summary = ({ formData, rates, rawItems, basicCosts, projectName }) => {
  let calculatedTotal = 0;

  // Build rows array, excluding reference sections like Centre Line
  const rows = [];
  
  FORM_SCHEMA.forEach(schemaSection => {
    if (schemaSection.isReference) return;
    
    const sectionData = formData[schemaSection.id];
    if (!sectionData) return;

    Object.keys(sectionData.totals).forEach(subId => {
      const { total, unit, title } = sectionData.totals[subId];
      if (total === 0) return; // Skip if total is 0 to avoid clutter

      const rate = rates[subId] || 0;
      const finalCost = total * rate;
      calculatedTotal += finalCost;
      
      const rawRows = rawItems[schemaSection.id] && rawItems[schemaSection.id][subId] 
        ? rawItems[schemaSection.id][subId] 
        : [];

      rows.push({
        id: subId,
        sectionTitle: sectionData.title,
        subTitle: title !== sectionData.title ? title : '',
        total,
        unit,
        rate,
        finalCost,
        rawRows: rawRows.filter(r => Object.keys(r).some(k => r[k] !== '' && r[k] !== undefined && r[k] !== null))
      });
    });
  });

  const gst = calculatedTotal * 0.18;
  const grandTotal = calculatedTotal + gst;

  const handleExportPdf = () => {
    exportToPdf(rows, calculatedTotal, gst, grandTotal, projectName, basicCosts);
  };

  const handleExportExcel = () => {
    exportToExcel(rows, calculatedTotal, gst, grandTotal, rawItems, projectName, basicCosts);
  };

  return (
    <div className="summary-page">
      <div className="summary-header">
        <h2>Summary & Final Rates</h2>
        <div className="export-actions">
          <button onClick={handleExportPdf} className="btn-export">
            <Download size={16} /> Export PDF
          </button>
          <button onClick={handleExportExcel} className="btn-export">
            <Download size={16} /> Export Excel
          </button>
        </div>
      </div>

      <div className="summary-table-container">
        <table className="summary-table">
          <thead>
            <tr>
              <th>Section</th>
              <th>Sub-Section & Breakdown</th>
              <th>Quantity</th>
              <th>Unit</th>
              <th>Rate</th>
              <th>Total Cost</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <React.Fragment key={row.id}>
                <tr style={{ backgroundColor: 'var(--bg-color)' }}>
                  <td style={{ fontWeight: 600 }}>{row.sectionTitle}</td>
                  <td style={{ fontWeight: 600 }}>{row.subTitle}</td>
                  <td style={{ fontWeight: 600 }}>{row.total.toFixed(2)}</td>
                  <td style={{ fontWeight: 600 }}>{row.unit}</td>
                  <td style={{ fontWeight: 600 }}>{row.rate.toFixed(2)}</td>
                  <td style={{ fontWeight: 600 }}>{row.finalCost.toFixed(2)}</td>
                </tr>
                {row.rawRows.map((r, i) => (
                  <tr key={`${row.id}-raw-${i}`} style={{ opacity: 0.85 }}>
                    <td></td>
                    <td style={{ paddingLeft: '2rem' }}>
                      <span style={{ color: 'var(--primary-color)' }}>
                        {r.description || `Item ${i + 1}`}
                      </span>
                      <div style={{ fontSize: '0.75rem', marginTop: '0.25rem', color: 'var(--text-secondary)' }}>
                        {['length', 'breadth', 'depth', 'number']
                          .filter(k => r[k] !== undefined && r[k] !== '')
                          .map(k => `${k}: ${r[k]}`)
                          .join(' | ')}
                      </div>
                    </td>
                    <td colSpan={4}></td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
            <tr className="grand-total-row" style={{ borderTop: '2px solid var(--border-color)' }}>
              <td colSpan="5">Calculated Total</td>
              <td>{calculatedTotal.toFixed(2)}</td>
            </tr>
            <tr className="grand-total-row" style={{ borderTop: 'none', backgroundColor: 'transparent' }}>
              <td colSpan="5" style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>GST (18%)</td>
              <td style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>{gst.toFixed(2)}</td>
            </tr>
            <tr className="grand-total-row">
              <td colSpan="5">Grand Total</td>
              <td style={{ color: 'var(--primary-color)' }}>{grandTotal.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
        
        <div style={{ padding: '1rem 1.5rem', fontSize: '0.8125rem', color: 'var(--text-secondary)', textAlign: 'right', fontStyle: 'italic' }}>
          * GST is added on the calculated total value to arrive at the final grand total value.
        </div>
      </div>

      {basicCosts && basicCosts.length > 0 && basicCosts.some(r => r.description || r.brand || r.unit || r.rate) && (
        <div className="summary-table-container" style={{ marginTop: '3rem' }}>
          <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)' }}>
            <h3 style={{ margin: 0 }}>Basic Cost of Materials</h3>
          </div>
          <table className="summary-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Brand</th>
                <th>Unit</th>
                <th>Rate</th>
              </tr>
            </thead>
            <tbody>
              {basicCosts.filter(r => r.description || r.brand || r.unit || r.rate).map((row, i) => (
                <tr key={i}>
                  <td>{row.description}</td>
                  <td>{row.brand}</td>
                  <td>{row.unit}</td>
                  <td>{row.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Summary;
