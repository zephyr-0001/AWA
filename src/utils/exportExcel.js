import * as XLSX from 'xlsx';
import { FORM_SCHEMA } from '../config/schema';

export const exportToExcel = (summaryRows, grandTotal, rawItems, projectName) => {
  const wb = XLSX.utils.book_new();

  // 1. Create Summary Sheet
  const summaryData = summaryRows.map(row => ({
    'Section': row.sectionTitle,
    'Sub-Section': row.subTitle,
    'Total': row.total,
    'Unit': row.unit,
    'Rate': row.rate,
    'Final Cost': row.finalCost
  }));

  // Add Grand Total row
  summaryData.push({
    'Section': 'Grand Total',
    'Sub-Section': '',
    'Total': '',
    'Unit': '',
    'Rate': '',
    'Final Cost': grandTotal
  });

  const wsSummary = XLSX.utils.json_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');

  // 2. Create sheets for each major section based on rawItems
  FORM_SCHEMA.forEach(section => {
    const sectionItems = rawItems[section.id];
    if (sectionItems) {
      let sheetData = [];
      
      // If the section has subsections
      if (section.subsections) {
        section.subsections.forEach(sub => {
          const rows = sectionItems[sub.id] || [];
          rows.forEach((row, index) => {
            sheetData.push({
              'Sub-Section': sub.title,
              'Row Index': index + 1,
              ...row
            });
          });
        });
      } else {
        // Single section (no subsections)
        const rows = sectionItems[section.id] || [];
        rows.forEach((row, index) => {
          sheetData.push({
            'Row Index': index + 1,
            ...row
          });
        });
      }

      if (sheetData.length > 0) {
        // Sanitize sheet name (Excel limits to 31 chars)
        const sheetName = section.title.replace(/[^\w\s-]/gi, '').substring(0, 31);
        const wsSection = XLSX.utils.json_to_sheet(sheetData);
        XLSX.utils.book_append_sheet(wb, wsSection, sheetName);
      }
    }
  });

  const fileName = projectName ? `${projectName.replace(/[^a-zA-Z0-9_\-\s]/g, '_')}_AWA_Detailed.xlsx` : 'AWA_Detailed_Report.xlsx';
  XLSX.writeFile(wb, fileName);
};
