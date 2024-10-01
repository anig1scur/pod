import React, { FC, useCallback, useRef } from 'react';
import { Scripts } from '@/types';
import jsPDF from 'jspdf';
import { loadCustomFont } from '@/utils/fontLoader';

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

  const exportToPDF = useCallback(async () => {
    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
    });

    const boldName = "LibreCaslonText-Bold";
    const normalName = "LibreCaslonText-Regular";

    await loadCustomFont(pdf, boldName);
    await loadCustomFont(pdf, normalName);

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

    const titleFontSize = 18;
    const titleMaxWidth = pageWidth - 2 * margin;
    const titleLines = wrapText(title, titleFontSize, titleMaxWidth);

    pdf.setFontSize(titleFontSize);
    pdf.setFont('LibreCaslonText-Bold');
    yOffset += 5;

    titleLines.forEach((line) => {
      pdf.text(line, pageWidth / 2, yOffset, { align: 'center' });
      yOffset += titleFontSize * 0.5;
    });

    yOffset += 8;

    pdf.setFont('LibreCaslonText-Regular');
    scripts.forEach((script) => {
      if (yOffset > pageHeight - 20) {
        addNewPage();
      }
      if (script.text === '[CLIP: Music]') {
        return;
      }

      let authorWidth = 0;
      if (script.author && displayAuthor) {
        pdf.setFontSize(13);
        pdf.setTextColor(138, 38, 38);
        authorWidth = pdf.getStringUnitWidth(script.author) * 13 / pdf.internal.scaleFactor;
        pdf.text(script.author, margin, yOffset);
        pdf.setTextColor(0, 0, 0);
      }

      const firstLineStartX = margin + authorWidth + (authorWidth > 0 ? 3.5 : 0);
      const maxTextWidth = pageWidth - margin * 2;

      pdf.setFontSize(11);
      const scriptWords = script.text.split(' ');
      let line = '';
      let lineWidth = 0;
      let isFirstLine = true;

      scriptWords.forEach((word, wordIndex) => {
        let displayWord = words.has(word) ? '_'.repeat(word.length) : word;
        const wordWidth = pdf.getStringUnitWidth(displayWord + ' ') * 11 / pdf.internal.scaleFactor;

        if (lineWidth + wordWidth > (isFirstLine ? maxTextWidth - authorWidth - 5 : maxTextWidth)) {
          pdf.text(line.trim(), isFirstLine ? firstLineStartX : margin, yOffset);
          yOffset += 5.5;
          line = '';
          lineWidth = 0;
          isFirstLine = false;

          if (yOffset > pageHeight - 20) {
            addNewPage();
          }
        }

        line += displayWord + ' ';
        lineWidth += wordWidth;

        if (wordIndex === scriptWords.length - 1) {
          pdf.text(line.trim(), isFirstLine ? firstLineStartX : margin, yOffset);
          yOffset += 5;

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
