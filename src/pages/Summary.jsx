import React from 'react';
import { Download } from 'lucide-react';
import { exportToPdf } from '../utils/exportPdf';
import { exportToExcel } from '../utils/exportExcel';

const Summary = ({ formData, rates, rawItems, projectName }) => {
  let grandTotal = 0;

  const rows = [];
  
  Object.values(formData).forEach(section => {
    Object.keys(section.totals).forEach(subId => {
      const { total, unit, title } = section.totals[subId];
      const rate = rates[subId] || 0;
      const finalCost = total * rate;
      grandTotal += finalCost;
      
      rows.push({
        id: subId,
        sectionTitle: section.title,
        subTitle: title !== section.title ? title : '',
        total,
        unit,
        rate,
        finalCost
      });
    });
  });

  const handleExportPdf = () => {
    exportToPdf(rows, grandTotal, projectName);
  };

  const handleExportExcel = () => {
    exportToExcel(rows, grandTotal, rawItems, projectName);
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
              <th>Sub-Section</th>
              <th>Calculated Total</th>
              <th>Unit</th>
              <th>Rate Configured</th>
              <th>Final Cost</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.id}>
                <td>{row.sectionTitle}</td>
                <td>{row.subTitle}</td>
                <td>{row.total.toFixed(2)}</td>
                <td>{row.unit}</td>
                <td>{row.rate.toFixed(2)}</td>
                <td>{row.finalCost.toFixed(2)}</td>
              </tr>
            ))}
            <tr className="grand-total-row">
              <td colSpan="5">Grand Total</td>
              <td>{grandTotal.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Summary;
