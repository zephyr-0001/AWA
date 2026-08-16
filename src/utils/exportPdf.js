import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FORM_SCHEMA } from '../config/schema';

export const exportToPdf = (summaryRows, calculatedTotal, gst, grandTotal, projectName, basicCosts) => {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.text('AWA BOQ Form - Summary Report', 14, 22);
  
  doc.setFontSize(11);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

  const tableData = [];
  
  let currentSection = '';

  summaryRows.forEach(row => {
    let displaySection = '';
    if (row.sectionTitle !== currentSection) {
      displaySection = row.sectionTitle;
      currentSection = row.sectionTitle;
    }

    tableData.push([
      { content: displaySection, styles: { fontStyle: 'bold' } },
      { content: row.subTitle || 'Total', styles: { fontStyle: 'bold' } },
      { content: `${row.total.toFixed(2)} ${row.unit}`, styles: { fontStyle: 'bold' } },
      { content: row.rate.toFixed(2), styles: { fontStyle: 'bold' } },
      { content: row.finalCost.toFixed(2), styles: { fontStyle: 'bold' } }
    ]);

    row.rawRows.forEach((r, i) => {
      let breakdownDesc = r.description || `Item ${i + 1}`;
      let dims = ['length', 'breadth', 'depth', 'number']
        .filter(k => r[k] !== undefined && r[k] !== '')
        .map(k => `${k}: ${r[k]}`)
        .join(' | ');
      
      let breakdownStr = `  ↳ ${breakdownDesc}`;
      if (dims) breakdownStr += `\n    (${dims})`;

      tableData.push([
        '',
        { content: breakdownStr, styles: { textColor: [100, 100, 100], fontSize: 9 } },
        '', '', ''
      ]);
    });
  });

  tableData.push([
    { content: 'Calculated Total', colSpan: 4, styles: { halign: 'right', fontStyle: 'bold' } },
    { content: calculatedTotal.toFixed(2), styles: { fontStyle: 'bold' } }
  ]);
  
  tableData.push([
    { content: 'GST (18%)', colSpan: 4, styles: { halign: 'right', fontStyle: 'italic', textColor: [100, 100, 100] } },
    { content: gst.toFixed(2), styles: { fontStyle: 'italic', textColor: [100, 100, 100] } }
  ]);

  tableData.push([
    { content: 'Grand Total', colSpan: 4, styles: { halign: 'right', fontStyle: 'bold', fillColor: [240, 240, 240] } },
    { content: grandTotal.toFixed(2), styles: { fontStyle: 'bold', fillColor: [240, 240, 240] } }
  ]);

  doc.autoTable({
    startY: 35,
    head: [['Section', 'Sub-Section & Breakdown', 'Quantity', 'Rate', 'Total Cost']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [79, 70, 229] }, // Indigo primary color
    columnStyles: {
      0: { cellWidth: 35 },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 25, halign: 'right' },
      3: { cellWidth: 20, halign: 'right' },
      4: { cellWidth: 25, halign: 'right' },
    }
  });

  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text('* GST is added on the calculated total value to arrive at the final grand total value.', 14, doc.lastAutoTable.finalY + 10);

  // Basic Cost Table
  if (basicCosts && basicCosts.length > 0 && basicCosts.some(r => r.description || r.brand || r.unit || r.rate)) {
    doc.addPage();
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Basic Cost of Materials', 14, 22);

    const basicCostData = basicCosts.filter(r => r.description || r.brand || r.unit || r.rate).map(r => [
      r.description,
      r.brand,
      r.unit,
      r.rate
    ]);

    doc.autoTable({
      startY: 30,
      head: [['Description', 'Brand', 'Unit', 'Rate']],
      body: basicCostData,
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] }
    });
  }

  const fileName = projectName ? `${projectName.replace(/[^a-zA-Z0-9_\-\s]/g, '_')}_AWA_BOQ.pdf` : 'AWA_BOQ_Report.pdf';
  doc.save(fileName);
};
