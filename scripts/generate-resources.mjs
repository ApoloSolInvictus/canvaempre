import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  PDFDocument,
  StandardFonts,
  rgb,
} from 'pdf-lib';
import { courses } from '../src/data/courses.js';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const outputDirectory = join(root, 'public', 'recursos');
const logoPath = join(root, 'public', 'w-studio-logo.png');

const colors = {
  ink: rgb(0.05, 0.07, 0.16),
  muted: rgb(0.38, 0.42, 0.52),
  violet: rgb(0.43, 0.21, 1),
  cyan: rgb(0.08, 0.72, 0.82),
  pale: rgb(0.96, 0.96, 1),
  line: rgb(0.88, 0.89, 0.94),
  white: rgb(1, 1, 1),
};

const wrapText = (text, font, size, maxWidth) => {
  const words = text.split(/\s+/);
  const lines = [];
  let line = '';

  words.forEach((word) => {
    const candidate = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
      line = candidate;
    } else {
      if (line) lines.push(line);
      line = word;
    }
  });
  if (line) lines.push(line);
  return lines;
};

const drawParagraph = ({
  page,
  text,
  font,
  size,
  x,
  y,
  width,
  color = colors.muted,
  lineHeight = size * 1.45,
}) => {
  const lines = wrapText(text, font, size, width);
  lines.forEach((line, index) => {
    page.drawText(line, {
      x,
      y: y - index * lineHeight,
      size,
      font,
      color,
    });
  });
  return y - lines.length * lineHeight;
};

const drawResource = async (course, resource, resourceIndex, logoBytes) => {
  const pdf = await PDFDocument.create();
  pdf.setTitle(`${resource.title} - Canva para Emprender`);
  pdf.setAuthor('W Studio');
  pdf.setSubject(`Recurso práctico del módulo ${course.title}`);
  pdf.setCreator('W Studio, desarrollado con asistencia de OpenAI Codex');

  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const logo = await pdf.embedPng(logoBytes);
  const page = pdf.addPage([612, 792]);
  const { width, height } = page.getSize();
  const margin = 54;
  const contentWidth = width - margin * 2;

  page.drawRectangle({
    x: 0,
    y: height - 16,
    width: width * 0.55,
    height: 16,
    color: colors.cyan,
  });
  page.drawRectangle({
    x: width * 0.55,
    y: height - 16,
    width: width * 0.45,
    height: 16,
    color: colors.violet,
  });

  page.drawImage(logo, {
    x: margin,
    y: height - 104,
    width: 74,
    height: 55,
  });
  page.drawText('CANVA PARA EMPRENDER', {
    x: margin + 92,
    y: height - 67,
    size: 10,
    font: bold,
    color: colors.violet,
  });
  page.drawText(`Nivel ${course.level} - ${course.title}`, {
    x: margin + 92,
    y: height - 87,
    size: 11,
    font: regular,
    color: colors.muted,
  });

  let y = height - 145;
  page.drawText(resource.type.toUpperCase(), {
    x: margin,
    y,
    size: 10,
    font: bold,
    color: colors.cyan,
  });
  y -= 34;
  y = drawParagraph({
    page,
    text: resource.title,
    font: bold,
    size: 25,
    x: margin,
    y,
    width: contentWidth,
    color: colors.ink,
    lineHeight: 30,
  });
  y -= 14;
  y = drawParagraph({
    page,
    text: resource.description,
    font: regular,
    size: 12,
    x: margin,
    y,
    width: contentWidth,
    lineHeight: 18,
  });

  y -= 24;
  page.drawRectangle({
    x: margin,
    y: y - 214,
    width: contentWidth,
    height: 230,
    color: colors.pale,
    borderColor: colors.line,
    borderWidth: 1,
  });
  page.drawText('LISTA DE TRABAJO', {
    x: margin + 22,
    y: y - 18,
    size: 11,
    font: bold,
    color: colors.violet,
  });

  let itemY = y - 52;
  resource.items.forEach((item) => {
    page.drawRectangle({
      x: margin + 22,
      y: itemY - 3,
      width: 13,
      height: 13,
      borderColor: colors.violet,
      borderWidth: 1.3,
    });
    const lines = wrapText(item, regular, 11, contentWidth - 70);
    lines.forEach((line, lineIndex) => {
      page.drawText(line, {
        x: margin + 48,
        y: itemY - lineIndex * 15,
        size: 11,
        font: regular,
        color: colors.ink,
      });
    });
    itemY -= Math.max(38, lines.length * 15 + 14);
  });

  y -= 252;
  page.drawText('COMO USARLO', {
    x: margin,
    y,
    size: 10,
    font: bold,
    color: colors.violet,
  });
  y -= 24;
  y = drawParagraph({
    page,
    text: resource.useCase,
    font: regular,
    size: 11,
    x: margin,
    y,
    width: contentWidth,
    color: colors.ink,
    lineHeight: 17,
  });

  y -= 25;
  page.drawText('NOTAS Y APLICACION A MI NEGOCIO', {
    x: margin,
    y,
    size: 10,
    font: bold,
    color: colors.violet,
  });
  for (let line = 0; line < 4; line += 1) {
    page.drawLine({
      start: { x: margin, y: y - 25 - line * 27 },
      end: { x: width - margin, y: y - 25 - line * 27 },
      color: colors.line,
      thickness: 1,
    });
  }

  page.drawText(
    `Recurso ${resourceIndex + 1} de ${course.resources.length} - W Studio`,
    {
      x: margin,
      y: 31,
      size: 8,
      font: bold,
      color: colors.muted,
    },
  );
  page.drawText(
    'Programa independiente, no afiliado ni patrocinado por Canva.',
    {
      x: width - margin - 242,
      y: 31,
      size: 7.5,
      font: regular,
      color: colors.muted,
    },
  );

  return pdf.save();
};

await mkdir(outputDirectory, { recursive: true });
const logoBytes = await readFile(logoPath);

for (const course of courses) {
  for (const [resourceIndex, resource] of course.resources.entries()) {
    const fileName = `${course.id}-recurso-${resourceIndex + 1}.pdf`;
    const bytes = await drawResource(
      course,
      resource,
      resourceIndex,
      logoBytes,
    );
    await writeFile(join(outputDirectory, fileName), bytes);
  }
}

console.log(
  `Generados ${courses.reduce(
    (total, course) => total + course.resources.length,
    0,
  )} recursos en ${outputDirectory}`,
);

