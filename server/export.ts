import ExcelJS from 'exceljs';
import { ScoreOutput } from './scoring';

/**
 * Builds a styled 2-tab Excel workbook matching the Sunjet Energy specification:
 * - Tab 1: "Summary Matrix" with dark blue headers (#1B2A4A), white text, frozen panes,
 *   auto-filter, and tier color-coding.
 * - Tab 2+: Per-candidate detail worksheets with structured breakdown, pros, cons, and skills.
 */
export async function buildExcelReportBuffer(results: ScoreOutput[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Sunjet Energy Talent Funnel';
  workbook.lastModifiedBy = 'Sunjet HR Engine';
  workbook.created = new Date();
  workbook.modified = new Date();

  // Dark blue branding header styling
  const HEADER_FILL: ExcelJS.Fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF1B2A4A' } // Dark blue
  };

  const HEADER_FONT: Partial<ExcelJS.Font> = {
    name: 'Segoe UI',
    size: 11,
    bold: true,
    color: { argb: 'FFFFFFFF' } // White text
  };

  const BORDER_STYLE: Partial<ExcelJS.Borders> = {
    top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
    left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
    bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
    right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
  };

  // ==========================================
  // TAB 1: SUMMARY MATRIX
  // ==========================================
  const summarySheet = workbook.addWorksheet('Summary Matrix', {
    views: [{ state: 'frozen', xSplit: 0, ySplit: 1 }] // Frozen top row
  });

  summarySheet.columns = [
    { header: 'Candidate Name', key: 'candidateName', width: 24 },
    { header: 'File Name', key: 'fileName', width: 26 },
    { header: 'Score %', key: 'scorePct', width: 14 },
    { header: 'Funnel Tier', key: 'tier', width: 16 },
    { header: 'Key Matched Skills', key: 'matchedSkills', width: 34 },
    { header: 'Missing Skills / Gaps', key: 'missingSkills', width: 34 },
    { header: 'Next Action', key: 'nextAction', width: 36 },
    { header: 'Scoring Method', key: 'method', width: 20 }
  ];

  // Apply styling to header row
  const headerRow = summarySheet.getRow(1);
  headerRow.height = 28;
  headerRow.eachCell((cell) => {
    cell.fill = HEADER_FILL;
    cell.font = HEADER_FONT;
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  });

  // Enable AutoFilter on Summary Matrix
  summarySheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: 8 }
  };

  // Add candidate data rows
  results.forEach((item, index) => {
    const rowNumber = index + 2;
    const scorePctValue = Math.round(item.score * 100);

    const row = summarySheet.addRow({
      candidateName: item.candidateName,
      fileName: item.fileName,
      scorePct: `${scorePctValue}%`,
      tier: `Tier ${item.tier} ${item.tier === 1 ? '★ (Top Pick)' : item.tier === 2 ? '● (Screen)' : '▲ (Reserve)'}`,
      matchedSkills: item.matchedSkills.join(', ') || 'N/A',
      missingSkills: item.missingSkills.join(', ') || 'None flagged',
      nextAction: item.nextAction,
      method: item.rawBreakdown?.method === 'gemini_ai' ? 'Gemini 2.5 Flash' : 'TF-IDF Vectorizer'
    });

    row.height = 24;

    // Apply borders and alignments
    row.eachCell((cell, colNumber) => {
      cell.border = BORDER_STYLE;
      cell.font = { name: 'Segoe UI', size: 10 };
      cell.alignment = { vertical: 'middle', wrapText: colNumber === 5 || colNumber === 6 };

      // Align Score and Tier to center
      if (colNumber === 3 || colNumber === 4) {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      }
    });

    // Tier-specific color fills for the Tier cell
    const tierCell = row.getCell(4);
    if (item.tier === 1) {
      tierCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE6F4EA' } // Soft green
      };
      tierCell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FF137333' } };
    } else if (item.tier === 2) {
      tierCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFEF7E0' } // Soft amber
      };
      tierCell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FFB06000' } };
    } else {
      tierCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFCE8E6' } // Soft red
      };
      tierCell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FFC5221F' } };
    }

    // Bold the Score % cell
    const scoreCell = row.getCell(3);
    scoreCell.font = { name: 'Segoe UI', size: 10, bold: true };
  });

  // ==========================================
  // TAB 2+: CANDIDATE DETAIL SHEETS
  // ==========================================
  // Generate a detail sheet for each candidate (up to 30 sheets max to maintain performance)
  const candidatesForDetail = results.slice(0, 30);
  const usedSheetNames = new Set<string>();

  candidatesForDetail.forEach((candidate, idx) => {
    // Excel sheet names cannot exceed 31 characters and cannot contain : \ / ? * [ ]
    let sanitizedName = candidate.candidateName.replace(/[:\\/?*[\]]/g, '').trim();
    if (!sanitizedName) sanitizedName = `Candidate ${idx + 1}`;
    if (sanitizedName.length > 25) sanitizedName = sanitizedName.substring(0, 25);

    let sheetName = sanitizedName;
    let counter = 1;
    while (usedSheetNames.has(sheetName.toLowerCase())) {
      sheetName = `${sanitizedName.substring(0, 22)} (${counter})`;
      counter++;
    }
    usedSheetNames.add(sheetName.toLowerCase());

    const detailSheet = workbook.addWorksheet(sheetName, {
      views: [{ state: 'frozen', xSplit: 0, ySplit: 2 }]
    });

    detailSheet.columns = [
      { key: 'colA', width: 24 },
      { key: 'colB', width: 65 }
    ];

    // Candidate Header Banner
    const titleRow = detailSheet.addRow([
      `CANDIDATE DOSSIER: ${candidate.candidateName.toUpperCase()}`,
      `Funnel Tier ${candidate.tier} | Score: ${Math.round(candidate.score * 100)}%`
    ]);
    titleRow.height = 30;
    titleRow.eachCell((cell) => {
      cell.fill = HEADER_FILL;
      cell.font = HEADER_FONT;
      cell.alignment = { vertical: 'middle' };
    });

    detailSheet.addRow([]); // Blank spacer

    // Section 1: Overview
    const addSectionHeader = (title: string) => {
      const sRow = detailSheet.addRow([title, '']);
      sRow.height = 22;
      sRow.getCell(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF1F5F9' }
      };
      sRow.getCell(1).font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FF1E293B' } };
      detailSheet.mergeCells(sRow.number, 1, sRow.number, 2);
    };

    const addKeyValue = (label: string, value: string) => {
      const kvRow = detailSheet.addRow([label, value]);
      kvRow.height = 20;
      kvRow.getCell(1).font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FF475569' } };
      kvRow.getCell(2).font = { name: 'Segoe UI', size: 10, color: { argb: 'FF0F172A' } };
      kvRow.getCell(1).border = BORDER_STYLE;
      kvRow.getCell(2).border = BORDER_STYLE;
      kvRow.getCell(2).alignment = { wrapText: true, vertical: 'middle' };
    };

    addSectionHeader('1. EXECUTIVE SUMMARY & RECRUITER ACTION');
    addKeyValue('Candidate Name', candidate.candidateName);
    addKeyValue('Source File', candidate.fileName);
    addKeyValue('Match Score', `${Math.round(candidate.score * 100)}% (${candidate.score.toFixed(3)})`);
    addKeyValue('Funnel Tier', `Tier ${candidate.tier} (${candidate.tier === 1 ? 'High Priority Shortlist' : candidate.tier === 2 ? 'Secondary Evaluation' : 'Pipeline Hold'})`);
    addKeyValue('Next Recommended Action', candidate.nextAction);

    detailSheet.addRow([]); // Blank spacer

    addSectionHeader('2. QUALIFICATION ANALYSIS: PROS & CONS');
    candidate.pros.forEach((pro, pIdx) => {
      addKeyValue(`Strength #${pIdx + 1}`, pro);
    });
    candidate.cons.forEach((con, cIdx) => {
      addKeyValue(`Gap / Note #${cIdx + 1}`, con);
    });

    detailSheet.addRow([]); // Blank spacer

    addSectionHeader('3. SKILLS OVERLAP & GAP ANALYSIS');
    addKeyValue('Verified Matched Skills', candidate.matchedSkills.join(', ') || 'No direct keyword overlap found');
    addKeyValue('Missing JD Requirements', candidate.missingSkills.join(', ') || 'All core requirements mapped');

    detailSheet.addRow([]); // Blank spacer

    addSectionHeader('4. TECHNICAL AUDIT TRAIL');
    addKeyValue('Evaluation Method', candidate.rawBreakdown?.method || 'N/A');
    if (candidate.rawBreakdown?.model) {
      addKeyValue('Model ID', candidate.rawBreakdown.model);
    }
    if (candidate.rawBreakdown?.details) {
      addKeyValue('Assessment Notes', candidate.rawBreakdown.details);
    }
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
