import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface PDFExportOptions {
  title: string;
  fileName: string;
  data: any[];
  columns: {
    header: string;
    dataKey: string;
    width?: number;
  }[];
  orientation?: 'portrait' | 'landscape';
  pageSize?: 'a4' | 'letter' | 'legal';
  headerImage?: string; // base64 PNG atau URL
  footerImage?: string; // base64 PNG atau URL
  headerInfo?: {
    printDate?: string;
    filterDescription?: string;
  };
}

export function exportGenericDataToPDF(options: PDFExportOptions) {
  const {
    title,
    fileName,
    data,
    columns,
    orientation = 'portrait',
    pageSize = 'a4',
    headerImage,
    footerImage,
    headerInfo,
  } = options;

  const doc = new jsPDF({
    orientation,
    unit: 'mm',
    format: pageSize,
  });

  const printDate =
    headerInfo?.printDate ||
    new Date().toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  // Tinggi gambar header/footer (kamu bisa ubah sesuai tinggi gambar kamu)
  const headerHeight = headerImage ? 35 : 0;
  const footerHeight = footerImage ? 35 : 0;

  // Y posisi awal SEMUA konten
  let yPosition = headerHeight + 15;

  // Judul utama
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Sistem Informasi Jadwal Perkuliahan', doc.internal.pageSize.width / 2, yPosition, {
    align: 'center',
  });
  yPosition += 8;

  // Subjudul
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(title, doc.internal.pageSize.width / 2, yPosition, { align: 'center' });
  yPosition += 6;

  // Filter aktif
  if (headerInfo?.filterDescription) {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.text(`Filter aktif: ${headerInfo.filterDescription}`, doc.internal.pageSize.width / 2, yPosition, { align: 'center' });
    yPosition += 6;
  }

  // Siapkan data tabel
  const tableData = data.map((item) =>
    columns.map((col) => {
      const value = item[col.dataKey];
      if (value === null || value === undefined) return '-';
      if (typeof value === 'boolean') return value ? 'Ya' : 'Tidak';
      if (col.dataKey === 'status') return value === 'aktif' ? 'Aktif' : 'Nonaktif';
      return String(value);
    })
  );

  autoTable(doc, {
    head: [columns.map((c) => c.header)],
    body: tableData,
    startY: yPosition,
    theme: 'grid',
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 10,
    },
    bodyStyles: {
      fontSize: 9,
      textColor: 50,
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    columnStyles: columns.reduce((acc, col, idx) => {
      if (col.width) acc[idx] = { cellWidth: col.width };
      return acc;
    }, {} as any),
    // Semua margin kena tambahan gambar header/footer
    margin: {
      top: headerHeight + 15,
      bottom: footerHeight + 15,
      left: 15,
      right: 15,
    },
    tableWidth: 'wrap',
    styles: {
      cellPadding: 3,
      fontSize: 9,
      overflow: 'linebreak',
    },
    didDrawPage: (data) => {
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const currentPage = (doc as any).getCurrentPageInfo().pageNumber;

      // Gambar header
      if (headerImage) {
        doc.addImage(headerImage, 'PNG', 0, 0, pageWidth, headerHeight);
      }

      // Gambar footer
      if (footerImage) {
        doc.addImage(footerImage, 'PNG', 0, pageHeight - footerHeight, pageWidth, footerHeight);
      }

      // "Dicetak pada..." di area header (bawah gambar)
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`Dicetak pada: ${printDate}`, 15, headerHeight + 5);

      // Nomor halaman di area footer (atas gambar)
      doc.text(`Halaman ${currentPage}`, pageWidth / 2, pageHeight - footerHeight - 5, { align: 'center' });
    },
  });

  doc.save(fileName);
}




