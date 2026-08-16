import * as XLSX from 'xlsx';
import { FORM_SCHEMA } from '../config/schema';

export const exportToExcel = (summaryRows, calculatedTotal, gst, grandTotal, rawItems, projectName, basicCosts) => {
  const wb = XLSX.utils.book_new();

  // 1. Create Summary Sheet
  const summaryData = [];
  
  let currentSection = '';

  summaryRows.forEach(row => {
    // Only show Section name if it changes to avoid repeating
    let displaySection = '';
    if (row.sectionTitle !== currentSection) {
      displaySection = row.sectionTitle;
      currentSection = row.sectionTitle;
    }

    // Main Sub-section Total Row
    summaryData.push({
      'Section': displaySection,
      'Sub-Section & Breakdown': row.subTitle || 'Total',
      'Quantity': row.total,
      'Unit': row.unit,
      'Rate': row.rate,
      'Total Cost': row.finalCost
    });

    // Breakdown Rows
    row.rawRows.forEach((r, i) => {
      let breakdownDesc = r.description || `Item ${i + 1}`;
      let dims = ['length', 'breadth', 'depth', 'number']
        .filter(k => r[k] !== undefined && r[k] !== '')
        .map(k => `${k}: ${r[k]}`)
        .join(' | ');
      
      let breakdownStr = `  ↳ ${breakdownDesc}`;
      if (dims) breakdownStr += ` (${dims})`;

      summaryData.push({
        'Section': '', 
        'Sub-Section & Breakdown': breakdownStr,
        'Quantity': '',
        'Unit': '',
        'Rate': '',
        'Total Cost': ''
      });
    });
  });

  // Totals
  summaryData.push({});
  summaryData.push({ 'Sub-Section & Breakdown': 'Calculated Total', 'Total Cost': calculatedTotal });
  summaryData.push({ 'Sub-Section & Breakdown': 'GST (18%)', 'Total Cost': gst });
  summaryData.push({ 'Sub-Section & Breakdown': 'Grand Total', 'Total Cost': grandTotal });

  const wsSummary = XLSX.utils.json_to_sheet(summaryData);
  
  // Auto-width for summary sheet
  wsSummary['!cols'] = [
    { wch: 25 }, // Section
    { wch: 50 }, // Sub-section & Breakdown
    { wch: 12 }, // Quantity
    { wch: 10 }, // Unit
    { wch: 12 }, // Rate
    { wch: 15 }  // Total Cost
  ];
  
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');

  // 2. Basic Cost Sheet
  if (basicCosts && basicCosts.length > 0 && basicCosts.some(r => r.description || r.brand || r.unit || r.rate)) {
    const basicCostData = basicCosts.filter(r => r.description || r.brand || r.unit || r.rate).map(r => ({
      'Description': r.description,
      'Brand': r.brand,
      'Unit': r.unit,
      'Rate': r.rate
    }));
    const wsBasic = XLSX.utils.json_to_sheet(basicCostData);
    wsBasic['!cols'] = [{ wch: 40 }, { wch: 20 }, { wch: 15 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, wsBasic, 'Basic Cost');
  }

  // 3. Create sheets for each major section
  FORM_SCHEMA.forEach(section => {
    if (section.isReference) return;
    const sectionItems = rawItems[section.id];
    if (sectionItems) {
      let sheetData = [];
      const subItems = section.subsections || [section];
      subItems.forEach(sub => {
        const rows = sectionItems[sub.id] || [];
        rows.forEach((row, index) => {
          // Filter out completely empty rows
          if (Object.keys(row).some(k => row[k] !== '' && row[k] !== undefined)) {
            sheetData.push({
              'Sub-Section': sub.title,
              'Description': row.description || '',
              'Length': row.length !== undefined ? row.length : '',
              'Breadth/Width': row.breadth !== undefined ? row.breadth : '',
              'Depth/Height': row.depth !== undefined ? row.depth : '',
              'Number': row.number !== undefined ? row.number : ''
            });
          }
        });
      });

      if (sheetData.length > 0) {
        const sheetName = section.title.replace(/[^\w\s-]/gi, '').substring(0, 31);
        const wsSection = XLSX.utils.json_to_sheet(sheetData);
        wsSection['!cols'] = [{ wch: 20 }, { wch: 40 }, { wch: 12 }, { wch: 15 }, { wch: 15 }, { wch: 10 }];
        XLSX.utils.book_append_sheet(wb, wsSection, sheetName);
      }
    }
  });

  const fileName = projectName ? `${projectName.replace(/[^a-zA-Z0-9_\-\s]/g, '_')}_AWA_BOQ.xlsx` : 'AWA_BOQ_Report.xlsx';
  XLSX.writeFile(wb, fileName);
};
