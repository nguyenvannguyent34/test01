
/**
 * Google Apps Script lưu và trả kết quả thi
 *
 * Cách dùng:
 * 1) Tạo Google Sheet mới.
 * 2) Extensions -> Apps Script.
 * 3) Dán toàn bộ mã này vào Code.gs.
 * 4) Sửa SHEET_NAME nếu muốn.
 * 5) Deploy -> New deployment -> Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6) Sao chép URL Web App và dán vào biến SCRIPT_URL trong index.html
 */

const SHEET_NAME = 'Results';

function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) || '';

    if (action === 'list') {
      const rows = getAllResults_();
      return jsonOutput_({ ok: true, rows: rows });
    }

    return jsonOutput_({
      ok: true,
      message: 'Quiz result API is running.'
    });
  } catch (error) {
    return jsonOutput_({
      ok: false,
      message: error.message || String(error)
    });
  }
}

function doPost(e) {
  try {
    const payload = parseBody_(e);
    if (!payload) {
      return jsonOutput_({ ok: false, message: 'Không có dữ liệu gửi lên.' });
    }

    const sheet = getOrCreateSheet_();
    ensureHeader_(sheet);

    const row = [
      payload.submittedAt || new Date().toISOString(),
      payload.fullName || '',
      payload.unit || '',
      Number(payload.score || 0),
      Number(payload.total || 20),
      Number(payload.percent || 0),
      Number(payload.usedSeconds || 0),
      payload.usedTimeText || '',
      Number(payload.questionCount || 20),
      JSON.stringify(payload.answerDetails || [])
    ];

    sheet.appendRow(row);

    return jsonOutput_({ ok: true, message: 'Đã lưu kết quả.' });
  } catch (error) {
    return jsonOutput_({
      ok: false,
      message: error.message || String(error)
    });
  }
}

function parseBody_(e) {
  if (!e || !e.postData || !e.postData.contents) return null;

  const raw = e.postData.contents;
  try {
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

function getOrCreateSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  return sheet;
}

function ensureHeader_(sheet) {
  if (sheet.getLastRow() > 0) return;

  const headers = [[
    'submittedAt',
    'fullName',
    'unit',
    'score',
    'total',
    'percent',
    'usedSeconds',
    'usedTimeText',
    'questionCount',
    'answerDetails'
  ]];

  sheet.getRange(1, 1, 1, headers[0].length).setValues(headers);
  sheet.getRange(1, 1, 1, headers[0].length).setFontWeight('bold');
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, headers[0].length);
}

function getAllResults_() {
  const sheet = getOrCreateSheet_();
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  if (lastRow < 2) return [];

  const values = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();
  return values.map(r => ({
    submittedAt: r[0],
    fullName: r[1],
    unit: r[2],
    score: r[3],
    total: r[4],
    percent: r[5],
    usedSeconds: r[6],
    usedTimeText: r[7],
    questionCount: r[8],
    answerDetails: safeParseJson_(r[9])
  }));
}

function safeParseJson_(value) {
  try {
    return JSON.parse(value || '[]');
  } catch (err) {
    return [];
  }
}

function jsonOutput_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
