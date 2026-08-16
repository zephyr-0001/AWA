import * as XLSX from 'xlsx-js-style';
import { FORM_SCHEMA } from '../config/schema';

export const generateExcelBlob = (summaryRows, calculatedTotal, gst, grandTotal, rawItems, projectName, basicCosts, dynamicSchema) => {
  const schemaToUse = dynamicSchema || FORM_SCHEMA;
  const wb = XLSX.utils.book_new();

  // STYLES
  const headerStyle = {
    font: { bold: true, color: { rgb: "FFFFFF" } },
    fill: { fgColor: { rgb: "4F46E5" } }, // Indigo Primary
    alignment: { horizontal: "center", vertical: "center" },
    border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } }
  };

  const titleStyle = {
    font: { bold: true, sz: 16, color: { rgb: "333333" } },
    alignment: { horizontal: "left", vertical: "center" }
  };

  const sectionHeaderStyle = {
    font: { bold: true, color: { rgb: "000000" } },
    fill: { fgColor: { rgb: "E5E7EB" } }, // Gray 200
    border: { top: { style: "thin" }, bottom: { style: "thin" } }
  };

  const rowStyle = {
    font: { bold: true },
    fill: { fgColor: { rgb: "F9FAFB" } }, // Gray 50
    border: { top: { style: "thin" }, bottom: { style: "thin" } }
  };

  const breakdownStyle = {
    font: { italic: true, color: { rgb: "4B5563" } } // Gray 600
  };

  const totalsStyle = {
    font: { bold: true },
    alignment: { horizontal: "right" }
  };

  const grandTotalStyle = {
    font: { bold: true, color: { rgb: "FFFFFF" } },
    fill: { fgColor: { rgb: "10B981" } }, // Emerald 500
    alignment: { horizontal: "right" }
  };

  // 1. Create Summary Sheet Data
  const summaryData = [];
  
  // Top Row: App Name and Project Name
  summaryData.push([{ v: "AWA BOQ Report", t: "s", s: titleStyle }, "", "", "", "", ""]);
  summaryData.push([{ v: `Project: ${projectName || "Untitled"}`, t: "s", s: { font: { italic: true } } }, "", "", "", "", ""]);
  summaryData.push([{ v: `Generated on: ${new Date().toLocaleDateString()}`, t: "s", s: { font: { italic: true } } }, "", "", "", "", ""]);
  summaryData.push([]); // Empty row
  
  // Table Header
  summaryData.push([
    { v: "Section", s: headerStyle },
    { v: "Sub-Section & Breakdown", s: headerStyle },
    { v: "Quantity", s: headerStyle },
    { v: "Unit", s: headerStyle },
    { v: "Rate", s: headerStyle },
    { v: "Total Cost", s: headerStyle }
  ]);

  let currentSection = '';

  summaryRows.forEach(row => {
    let displaySection = '';
    if (row.sectionTitle !== currentSection) {
      displaySection = row.sectionTitle;
      currentSection = row.sectionTitle;
    }

    summaryData.push([
      { v: displaySection, s: rowStyle },
      { v: row.subTitle || 'Total', s: rowStyle },
      { v: Number(row.total), t: 'n', z: '#,##0.00', s: rowStyle },
      { v: row.unit, s: rowStyle },
      { v: Number(row.rate), t: 'n', z: '#,##0.00', s: rowStyle },
      { v: Number(row.finalCost), t: 'n', z: '#,##0.00', s: rowStyle }
    ]);

    row.rawRows.forEach((r, i) => {
      let breakdownDesc = r.description ? `- ${r.description}` : `- Item ${i + 1}`;
      let dims = ['length', 'breadth', 'depth', 'number']
        .filter(k => r[k] !== undefined && r[k] !== '')
        .map(k => `${k}: ${r[k]}`)
        .join(' | ');
      
      let breakdownStr = `  ${breakdownDesc}`;
      if (dims) breakdownStr += ` (${dims})`;

      summaryData.push([
        "", 
        { v: breakdownStr, s: breakdownStyle },
        "", "", "", ""
      ]);
    });
  });

  summaryData.push([]); // Spacer
  
  summaryData.push([
    "", "", "", "",
    { v: "Calculated Total", s: totalsStyle },
    { v: Number(calculatedTotal), t: 'n', z: '#,##0.00', s: totalsStyle }
  ]);
  
  summaryData.push([
    "", "", "", "",
    { v: "GST (18%)", s: { ...totalsStyle, font: { italic: true } } },
    { v: Number(gst), t: 'n', z: '#,##0.00', s: { ...totalsStyle, font: { italic: true } } }
  ]);
  
  summaryData.push([
    "", "", "", "",
    { v: "Grand Total", s: grandTotalStyle },
    { v: Number(grandTotal), t: 'n', z: '#,##0.00', s: grandTotalStyle }
  ]);

  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  
  // Merge Title Cells
  if(!wsSummary['!merges']) wsSummary['!merges'] = [];
  wsSummary['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 5 } });
  wsSummary['!merges'].push({ s: { r: 1, c: 0 }, e: { r: 1, c: 5 } });
  
  wsSummary['!cols'] = [
    { wch: 30 }, // Section
    { wch: 50 }, // Sub-section & Breakdown
    { wch: 15 }, // Quantity
    { wch: 10 }, // Unit
    { wch: 15 }, // Rate
    { wch: 20 }  // Total Cost
  ];
  
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');

  // 2. Basic Cost Sheet
  if (basicCosts && basicCosts.length > 0 && basicCosts.some(r => r.description || r.brand || r.unit || r.rate)) {
    const basicCostData = [];
    basicCostData.push([{ v: "AWA BOQ - Basic Cost", t: "s", s: titleStyle }, "", "", ""]);
    basicCostData.push([]);
    
    basicCostData.push([
      { v: "Description", s: headerStyle },
      { v: "Brand", s: headerStyle },
      { v: "Unit", s: headerStyle },
      { v: "Rate", s: headerStyle }
    ]);
    
    basicCosts.filter(r => r.description || r.brand || r.unit || r.rate).forEach(r => {
      basicCostData.push([
        r.description || "",
        r.brand || "",
        r.unit || "",
        { v: Number(r.rate) || 0, t: 'n', z: '#,##0.00' }
      ]);
    });

    const wsBasic = XLSX.utils.aoa_to_sheet(basicCostData);
    if(!wsBasic['!merges']) wsBasic['!merges'] = [];
    wsBasic['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 3 } });
    
    wsBasic['!cols'] = [{ wch: 40 }, { wch: 20 }, { wch: 15 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, wsBasic, 'Basic Cost');
  }

  // 3. Create sheets for each major section
  let sectionCounter = 1;
  schemaToUse.forEach(section => {
    if (section.isReference) return;
    const sectionItems = rawItems[section.id];
    
    const displayTitle = `${sectionCounter}. ${section.title.replace(/^\d+\.\s*/, '')}`;
    sectionCounter++;
    
    if (sectionItems) {
      let sheetData = [];
      sheetData.push([{ v: displayTitle, t: "s", s: titleStyle }, "", "", "", "", ""]);
      sheetData.push([]);
      
      const subItems = section.subsections || [section];
      subItems.forEach(sub => {
        const rows = sectionItems[sub.id] || [];
        const validRows = rows.filter(row => Object.keys(row).some(k => row[k] !== '' && row[k] !== undefined));
        
        if (validRows.length > 0) {
          // Sub-section header
          sheetData.push([
            { v: sub.title, s: sectionHeaderStyle },
            { v: "Length", s: sectionHeaderStyle },
            { v: "Breadth/Width", s: sectionHeaderStyle },
            { v: "Depth/Height", s: sectionHeaderStyle },
            { v: "Number", s: sectionHeaderStyle }
          ]);
          
          validRows.forEach((row, index) => {
            sheetData.push([
              row.description ? `- ${row.description}` : `- Item ${index + 1}`,
              { v: row.length !== undefined ? Number(row.length) : "", t: 'n', z: '#,##0.00' },
              { v: row.breadth !== undefined ? Number(row.breadth) : "", t: 'n', z: '#,##0.00' },
              { v: row.depth !== undefined ? Number(row.depth) : "", t: 'n', z: '#,##0.00' },
              { v: row.number !== undefined ? Number(row.number) : "", t: 'n', z: '#,##0.00' }
            ]);
          });
          sheetData.push([]); // spacer
        }
      });

      if (sheetData.length > 2) {
        const sheetName = displayTitle.replace(/[^\w\s-]/gi, '').substring(0, 31);
        const wsSection = XLSX.utils.aoa_to_sheet(sheetData);
        if(!wsSection['!merges']) wsSection['!merges'] = [];
        wsSection['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } });
        
        wsSection['!cols'] = [{ wch: 30 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];
        XLSX.utils.book_append_sheet(wb, wsSection, sheetName);
      }
    }
  });

  return XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
};
