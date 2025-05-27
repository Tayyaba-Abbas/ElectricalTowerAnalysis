// import jsPDF from 'jspdf';

// export const exportCSV = (data, filename = 'report.csv') => {
//   const rows = data.components.map(c => [c.component, c.mappedHeightCm, c.mappedWidthCm]);
//   let csv = "Component,Mapped Height (cm),Mapped Width (cm)\n";
//   rows.forEach(row => {
//     csv += row.join(",") + "\n";
//   });
//   downloadFile(csv, filename, 'text/csv');
// };

// export const exportJSON = (data, filename = 'report.json') => {
//   const jsonStr = JSON.stringify(data, null, 2);
//   downloadFile(jsonStr, filename, 'application/json');
// };

// export const exportPDF = (data, filename = 'report.pdf') => {
//   const doc = new jsPDF();
//   doc.text(`Number of 'Cross Pattern' Predictions: ${data.predictionCount}`, 10, 10);
//   doc.text('Dimensions Table:', 10, 20);

//   let y = 30;
//   data.components.forEach(c => {
//     doc.text(`${c.component}: ${c.mappedHeightCm} cm x ${c.mappedWidthCm} cm`, 10, y);
//     y += 10;
//   });

//   doc.save(filename);
// };

// const downloadFile = (content, filename, mimeType) => {
//   const blob = new Blob([content], { type: mimeType });
//   const url = URL.createObjectURL(blob);
//   const a = document.createElement('a');
//   a.href = url;
//   a.download = filename;
//   a.click();
//   URL.revokeObjectURL(url);
// };

import jsPDF from 'jspdf';

export const exportJSON = (data, fileName) => {
  const formattedData = {
    ...data,
    components: data.components.map(item => ({
      component: item.component,
      heightPixels: Number(item.heightPixels).toFixed(2),
      widthPixels: Number(item.widthPixels).toFixed(2),
      mappedHeightCm: Number(item.mappedHeightCm).toFixed(2),
      mappedWidthCm: Number(item.mappedWidthCm).toFixed(2),
    }))
  };

  const blob = new Blob([JSON.stringify(formattedData, null, 2)], {
    type: 'application/json',
  });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${fileName}.json`;
  link.click();
};

export const exportCSV = (data, fileName) => {
  const rows = data.components.map(item => [
    item.component,
    Number(item.heightPixels).toFixed(2),
    Number(item.widthPixels).toFixed(2),
    Number(item.mappedHeightCm).toFixed(2),
    Number(item.mappedWidthCm).toFixed(2)
  ]);

  const header = ['Component', 'Height (px)', 'Width (px)', 'Mapped Height (cm)', 'Mapped Width (cm)'];
  const csvContent = [header, ...rows].map(e => e.join(",")).join("\n");

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `${fileName}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportPDF = (data, fileName) => {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text('Electrical Tower Analysis Report', 10, 10);

  doc.setFontSize(12);
  doc.text(`Insulator Height (px): ${Number(data.insulatorHeightPx).toFixed(2)}`, 10, 20);
  doc.text(`Insulator Width (px): ${Number(data.insulatorWidthPx).toFixed(2)}`, 10, 27);
  doc.text(`Prediction Count: ${data.predictionCount}`, 10, 34);

  if (data.originalImage) {
    doc.text('Original Image:', 10, 45);
    doc.addImage(data.originalImage, 'PNG', 10, 50, 80, 60);
  }

  if (data.annotatedImage) {
    doc.text('Annotated Image:', 110, 45);
    doc.addImage(data.annotatedImage, 'PNG', 110, 50, 80, 60);
  }

  let y = 115;
  doc.text('Component Dimensions:', 10, y);
  y += 10;

  data.components.forEach((item, index) => {
    doc.text(
      `${index + 1}) ${item.component} - ${Number(item.mappedHeightCm).toFixed(2)} cm x ${Number(item.mappedWidthCm).toFixed(2)} cm`,
      10,
      y
    );
    y += 8;
  });

  doc.save(`${fileName}.pdf`);
};

