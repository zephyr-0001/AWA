import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const exportToPdf = (rows, grandTotal, projectName) => {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.text('AWA Calculative Form - Summary Report', 14, 22);
  
  doc.setFontSize(11);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

  const tableData = rows.map(row => [
    row.sectionTitle,
    row.subTitle,
    `${row.total.toFixed(2)} ${row.unit}`,
    row.rate.toFixed(2),
    row.finalCost.toFixed(2)
  ]);

  tableData.push([
    { content: 'Grand Total', colSpan: 4, styles: { halign: 'right', fontStyle: 'bold' } },
    { content: grandTotal.toFixed(2), styles: { fontStyle: 'bold' } }
  ]);

  doc.autoTable({
    startY: 35,
    head: [['Section', 'Sub-Section', 'Calculated Total', 'Rate', 'Final Cost']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246] }, // Primary color
  });

  const fileName = projectName ? `${projectName.replace(/[^a-zA-Z0-9_\-\s]/g, '_')}_AWA_Summary.pdf` : 'AWA_Summary_Report.pdf';
  doc.save(fileName);
};
