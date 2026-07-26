import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
const dir = resolve(process.cwd(), 'public/downloads');
mkdirSync(dir, { recursive: true });
function pdf(title) {
  const text = `${title} - Spec Sheet (Placeholder)`;
  const objs = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>',
    `<< /Length ${text.length + 40} >>\nstream\nBT /F1 20 Tf 60 760 Td (${text}) Tj ET\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ];
  let pdf = '%PDF-1.4\n';
  const offsets = [];
  objs.forEach((o, i) => { offsets.push(pdf.length); pdf += `${i + 1} 0 obj\n${o}\nendobj\n`; });
  const xref = pdf.length;
  pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`;
  offsets.forEach((off) => { pdf += `${String(off).padStart(10, '0')} 00000 n \n`; });
  pdf += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return pdf;
}
for (const [f, t] of [['EG-8000-选型手册.pdf', 'EG-8000 Edge Gateway'], ['DM-300-选型手册.pdf', 'DM-300 Smart Meter'], ['SS-104-选型手册.pdf', 'SS-104 Serial Server']]) {
  writeFileSync(resolve(dir, f), pdf(t), 'latin1');
  console.log('✓', f);
}
