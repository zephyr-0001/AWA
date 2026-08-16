import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FORM_SCHEMA } from '../config/schema';

const formatCurrency = (val) => Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const formatQuantity = (val) => Number(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const generateFinalSummaryPdfBlob = (summaryRows, calculatedTotal, gst, grandTotal, projectName) => {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.text('AWA BOQ Form - Final Summary', 14, 22);
  
  doc.setFontSize(11);
  doc.text(`Project: ${projectName || 'Untitled Project'}\nGenerated on: ${new Date().toLocaleDateString()}`, 14, 30);

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
      { content: `${formatQuantity(row.total)} ${row.unit}`, styles: { fontStyle: 'bold' } },
      { content: formatCurrency(row.rate), styles: { fontStyle: 'bold' } },
      { content: formatCurrency(row.finalCost), styles: { fontStyle: 'bold' } }
    ]);
  });

  tableData.push([
    { content: 'Calculated Total', colSpan: 4, styles: { halign: 'right', fontStyle: 'bold' } },
    { content: formatCurrency(calculatedTotal), styles: { fontStyle: 'bold' } }
  ]);
  
  tableData.push([
    { content: 'GST (18%)', colSpan: 4, styles: { halign: 'right', fontStyle: 'italic', textColor: [100, 100, 100] } },
    { content: formatCurrency(gst), styles: { fontStyle: 'italic', textColor: [100, 100, 100] } }
  ]);

  tableData.push([
    { content: 'Grand Total', colSpan: 4, styles: { halign: 'right', fontStyle: 'bold', fillColor: [240, 240, 240] } },
    { content: formatCurrency(grandTotal), styles: { fontStyle: 'bold', fillColor: [240, 240, 240] } }
  ]);

  doc.autoTable({
    startY: 42,
    head: [['Section', 'Sub-Section', 'Quantity', 'Rate', 'Total Cost']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [79, 70, 229] }, // Indigo primary color
    columnStyles: {
      0: { cellWidth: 45 },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 25, halign: 'right' },
      3: { cellWidth: 20, halign: 'right' },
      4: { cellWidth: 30, halign: 'right' },
    }
  });

  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text('* GST is added on the calculated total value to arrive at the final grand total value.', 14, doc.lastAutoTable.finalY + 10);

  return doc.output('blob');
};

export const generateBasicCostPdfBlob = (basicCosts, projectName) => {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.text('AWA BOQ Form - Basic Cost', 14, 22);
  
  doc.setFontSize(11);
  doc.text(`Project: ${projectName || 'Untitled Project'}\nGenerated on: ${new Date().toLocaleDateString()}`, 14, 30);

  if (basicCosts && basicCosts.length > 0 && basicCosts.some(r => r.description || r.brand || r.unit || r.rate)) {
    const basicCostData = basicCosts.filter(r => r.description || r.brand || r.unit || r.rate).map(r => [
      r.description,
      r.brand,
      r.unit,
      r.rate ? formatCurrency(r.rate) : ''
    ]);

    doc.autoTable({
      startY: 42,
      head: [['Description', 'Brand', 'Unit', 'Rate']],
      body: basicCostData,
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] },
      columnStyles: {
        3: { halign: 'right' }
      }
    });
  } else {
    doc.text('No Basic Cost items added.', 14, 50);
  }

  return doc.output('blob');
};

export const generateBoqBreakdownPdfBlob = (rawItems, projectName, dynamicSchema) => {
  const doc = new jsPDF();
  const schemaToUse = dynamicSchema || FORM_SCHEMA;
  
  doc.setFontSize(18);
  doc.text('AWA BOQ Form - Detail Breakdown', 14, 22);
  
  doc.setFontSize(11);
  doc.text(`Project: ${projectName || 'Untitled Project'}\nGenerated on: ${new Date().toLocaleDateString()}`, 14, 30);

  let currentY = 42;
  let sectionCounter = 1;

  schemaToUse.forEach(section => {
    if (section.isReference) return;
    const sectionItems = rawItems[section.id];
    
    // Calculate display title (strip old hardcoded number and add new)
    const displayTitle = `${sectionCounter}. ${section.title.replace(/^\d+\.\s*/, '')}`;
    sectionCounter++;
    
    if (sectionItems) {
      let hasContent = false;
      const subItems = section.subsections || [section];
      
      subItems.forEach(sub => {
        const rows = sectionItems[sub.id] || [];
        const validRows = rows.filter(row => Object.keys(row).some(k => row[k] !== '' && row[k] !== undefined));
        
        if (validRows.length > 0) {
          if (!hasContent) {
            // Print Section Header once
            if (currentY > 250) { doc.addPage(); currentY = 20; }
            doc.setFontSize(14);
            doc.setTextColor(79, 70, 229);
            doc.text(displayTitle, 14, currentY);
            currentY += 6;
            hasContent = true;
          }

          const tableData = validRows.map((row, index) => {
            return [
              row.description ? `- ${row.description}` : `- Item ${index + 1}`,
              row.length !== undefined ? formatQuantity(row.length) : '',
              row.breadth !== undefined ? formatQuantity(row.breadth) : '',
              row.depth !== undefined ? formatQuantity(row.depth) : '',
              row.number !== undefined ? formatQuantity(row.number) : ''
            ];
          });

          doc.autoTable({
            startY: currentY,
            head: [[sub.title, 'Length', 'Breadth/Width', 'Depth/Height', 'Number']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
            margin: { left: 14 }
          });
          
          currentY = doc.lastAutoTable.finalY + 8;
        }
      });
    }
  });
  
  if (currentY === 42) {
    doc.text('No detailed breakdown data found.', 14, 50);
  }

  return doc.output('blob');
};
