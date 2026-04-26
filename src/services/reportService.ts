import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Request } from '@/types';
import { formatDate } from '@/utils/helpers';
import logoImg from '@/assets/logo.png'; 

// REPARAȚIA 1: O metodă perfect sigură de a citi fișiere binare și a le transforma în Base64
const fetchFontAsBase64 = async (url: string): Promise<string> => {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        // Extragem doar textul de bază, ignorând prefixul "data:..."
        resolve(reader.result.split(',')[1]); 
      } else {
        reject(new Error("Eroare la conversia fontului"));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const reportService = {
  exportToPDF: async (requests: Request[], title: string = "Raport Activitate Centria") => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.setCharSpace(0);

    let activeFont = 'helvetica'; // Font de rezervă (fără diacritice)

    try {
      // REPARAȚIA 2: Folosim fonturile oficiale de la pdfmake (optimizate special pentru PDF-uri)
      const [regularFont, boldFont] = await Promise.all([
        fetchFontAsBase64('https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-Regular.ttf'),
        fetchFontAsBase64('https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-Medium.ttf') // Medium e folosit ca Bold aici
      ]);

      doc.addFileToVFS('Roboto-Regular.ttf', regularFont);
      doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');

      doc.addFileToVFS('Roboto-Bold.ttf', boldFont);
      doc.addFont('Roboto-Bold.ttf', 'Roboto', 'bold');

      activeFont = 'Roboto'; // Dacă totul e OK, activăm Roboto!
    } catch (error) {
      console.warn("Nu s-au putut încărca fonturile cu diacritice. Trecem la fontul standard.", error);
    }

    try {
      doc.addImage(logoImg, 'PNG', 14, 10, 35, 12);
    } catch (e) {
      console.warn("Logoul nu a putut fi încărcat în PDF.");
    }

    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.setFont(activeFont, 'normal');
    doc.text("Platforma Centria ERP", pageWidth - 14, 15, { align: 'right' });
    doc.text(`Data: ${new Date().toLocaleDateString('ro-RO')}`, pageWidth - 14, 20, { align: 'right' });

    doc.setDrawColor(226, 232, 240);
    doc.line(14, 26, pageWidth - 14, 26);

    doc.setFontSize(16);
    doc.setFont(activeFont, 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(title, 14, 40);

    doc.setFontSize(10);
    doc.setFont(activeFont, 'normal');
    doc.setTextColor(100);
    doc.text(`Acest document conține istoricul a ${requests.length} solicitări procesate prin sistem.`, 14, 47);

    const tableColumn = ["Nr.", "Titlu Solicitare", "Instituție", "Furnizor", "Status", "Data"];
    const tableRows = requests.map((req, index) => [
      index + 1,
      req.title, 
      req.municipality?.name || 'Nespecificat',
      req.provider?.name || 'Nealocat',
      {
        content: req.status === 'accepted' ? 'Acceptat' : req.status === 'rejected' ? 'Respins' : 'În Așteptare',
        styles: { 
          textColor: (req.status === 'accepted' ? [16, 185, 129] : req.status === 'rejected' ? [239, 68, 68] : [245, 158, 11]) as [number, number, number],
          fontStyle: 'bold' as const 
        }
      },
      formatDate(req.createdAt)
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 55,
      theme: 'grid',
      styles: { 
        font: activeFont,
        fontSize: 9,
        cellPadding: 3,
        valign: 'middle'
      },
      headStyles: { 
        fillColor: [2, 132, 199], 
        textColor: 255, 
        fontStyle: 'bold',
        halign: 'left'
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 10 },
        4: { halign: 'center', cellWidth: 25 },
        5: { halign: 'center', cellWidth: 25 }
      },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      margin: { top: 30 },
      didDrawPage: (data) => {
        doc.setFontSize(8);
        doc.setTextColor(150);
        const str = `Pagina ${data.pageNumber}`;
        doc.text(str, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
      }
    });

    doc.save(`Raport_Centria_${formatDate(new Date().toISOString()).replace(/\//g, '-')}.pdf`);
  },

  exportToExcel: (requests: Request[], filename: string = "Export_Centria") => {
    const data = requests.map(req => ({
      "NR. CRT": "",
      "TITLU CERERE": req.title,
      "DESCRIERE": req.description,
      "STATUS": req.status === 'accepted' ? 'Acceptat' : req.status === 'rejected' ? 'Respins' : 'În Așteptare',
      "PRIMĂRIE": req.municipality?.name || '-',
      "CUI PRIMĂRIE": req.municipality?.cui || '-',
      "LOCALITATE": req.locality || '-',
      "FURNIZOR": req.provider?.name || '-',
      "DATA CREĂRII": formatDate(req.createdAt),
      "PERSOANĂ CONTACT": req.contactPerson.name,
      "TELEFON": req.contactPerson.phone
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Istoric");
    
    const wscols = [
      { wch: 8 }, { wch: 30 }, { wch: 50 }, { wch: 15 }, { wch: 25 },
      { wch: 15 }, { wch: 20 }, { wch: 25 }, { wch: 15 }, { wch: 20 }, { wch: 15 }
    ];
    worksheet['!cols'] = wscols;

    XLSX.writeFile(workbook, `${filename}_${new Date().getTime()}.xlsx`);
  }
};