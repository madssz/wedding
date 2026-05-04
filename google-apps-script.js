// =============================================================
// Google Apps Script для збереження відповідей у Google Sheets
// =============================================================
//
// ІНСТРУКЦІЯ:
// 1. Відкрийте Google Sheets: https://sheets.google.com
// 2. Створіть нову таблицю з назвою "Весілля — Відповіді гостей"
// 3. У першому рядку додайте заголовки стовпців:
//    Timestamp | Ім'я | Телефон | Присутність | Кількість гостей | Напої | Трансфер | Звідки забрати | Побажання
// 4. Відкрийте меню: Розширення → Apps Script
// 5. Видаліть весь код і вставте цей скрипт
// 6. Натисніть "Розгорнути" → "Нове розгортання"
// 7. Тип: "Веб-додаток"
// 8. Виконувати як: "Я"
// 9. Хто має доступ: "Будь-хто"
// 10. Натисніть "Розгорнути" та скопіюйте URL
// 11. Вставте URL у файл script.js замість 'YOUR_GOOGLE_SCRIPT_URL_HERE'
//
// =============================================================

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.name || '',
      data.phone || '',
      data.attendance === 'yes' ? 'Так' : 'Ні',
      data.guests_count || '',
      data.alcohol || '',
      data.transfer === 'yes' ? 'Так' : 'Ні',
      data.transfer_details || '',
      data.wishes || ''
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput('Wedding RSVP Script is running!')
    .setMimeType(ContentService.MimeType.TEXT);
}
