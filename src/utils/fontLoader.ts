import { jsPDF } from 'jspdf';

export async function loadCustomFont(doc: jsPDF, font: string) {
  const fontPath = `/fonts/${ font }.ttf`;

  try {
    const fontResponse = await fetch(fontPath);
    const fontArrayBuffer = await fontResponse.arrayBuffer();
    const fontData = Buffer.from(new Uint8Array(fontArrayBuffer)).toString('base64');

    doc.addFileToVFS(`${ font }.ttf`, fontData);
    doc.addFont(`${ font }.ttf`, font, 'normal');

    console.log('Custom font loaded successfully');
  } catch (error) {
    console.error('Failed to load custom font:', error);
  }
}
