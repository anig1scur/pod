import React, { FC, useCallback, useRef } from 'react';
import { Scripts } from '@/types';
import jsPDF from 'jspdf';

export type pdfExporterProps = {
  id: string;
  mode: string
  words: Set<string>;
  scripts: Scripts;
  title: string;
  displayAuthor?: boolean;
}


const PdfExporter: FC<pdfExporterProps> = (props) => {
  const { id, scripts, words, title, displayAuthor = true } = props;

  const exportToPDF = useCallback(() => {
    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
    });
    let yOffset = 10;
    const pageHeight = pdf.internal.pageSize.height;
    const pageWidth = pdf.internal.pageSize.width;
    const margin = 12;

    const addNewPage = () => {
      pdf.addPage();
      yOffset = margin;
    };

    const wrapText = (text: string, fontSize: number, maxWidth: number) => {
      pdf.setFontSize(fontSize);
      const words = text.split(' ');
      let lines = [];
      let currentLine = words[0];

      for (let i = 1;i < words.length;i++) {
        const word = words[i];
        const width = pdf.getStringUnitWidth(currentLine + " " + word) * fontSize / pdf.internal.scaleFactor;
        if (width < maxWidth) {
          currentLine += " " + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
      lines.push(currentLine);
      return lines;
    };

    const titleFontSize = 17;
    const titleMaxWidth = pageWidth - 2 * margin;
    const titleLines = wrapText(title, titleFontSize, titleMaxWidth);

    pdf.setFontSize(titleFontSize);
    yOffset += 5;
    titleLines.forEach((line) => {
      pdf.text(line, pageWidth / 2, yOffset, { align: 'center' });
      yOffset += titleFontSize * 0.5;
    });

    yOffset += 8;

    scripts.forEach((script) => {
      if (yOffset > pageHeight - 20) {
        addNewPage();
      }

      if (displayAuthor) {
        pdf.setFontSize(13);
        pdf.text(script.author, margin, yOffset);
        yOffset += 6;
      }

      pdf.setFontSize(11);
      const scriptWords = script.text.split(' ');
      let line = '';
      const maxWidth = pageWidth - 2 * margin;

      scriptWords.forEach((word, wordIndex) => {
        let displayWord = word;
        if (words.has(word)) {
          displayWord = '_'.repeat(word.length);
        }

        const testLine = line + displayWord + ' ';
        const testWidth = pdf.getStringUnitWidth(testLine) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;

        if (testWidth > maxWidth) {
          pdf.text(line, margin, yOffset);
          yOffset += 6;
          line = displayWord + ' ';

          if (yOffset > pageHeight - 20) {
            addNewPage();
          }
        } else {
          line = testLine;
        }

        if (wordIndex === scriptWords.length - 1) {
          pdf.text(line, margin, yOffset);
          yOffset += 6;

          if (yOffset > pageHeight - 20) {
            addNewPage();
          }
        }
      });

      yOffset += 3;
    });

    pdf.save(`${ id }.pdf`);
  }, [scripts, words, title, id]);

  return <button onClick={ exportToPDF }>Export to PDF</button>;
}

export default PdfExporter;
