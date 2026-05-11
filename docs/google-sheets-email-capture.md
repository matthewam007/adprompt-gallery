# Google Sheets Email Capture

Sheet:

`https://docs.google.com/spreadsheets/d/1-NLCGGO0I-Oi1zQes8qPISWeBtklg6XmPhaAdjLyyQY/edit`

## 1. Add Headers

In row 1 of the first sheet, add:

```text
email | source | created_at | details
```

## 2. Add Apps Script

In Google Sheets, go to `Extensions -> Apps Script` and paste:

```js
const SHEET_ID = "1-NLCGGO0I-Oi1zQes8qPISWeBtklg6XmPhaAdjLyyQY";
const SHEET_NAME = "Sheet1";

function doPost(e) {
  const payload = JSON.parse(e.postData.contents || "{}");
  const email = String(payload.email || "").trim().toLowerCase();
  const source = String(payload.source || "unknown");
  const createdAt = String(payload.createdAt || new Date().toISOString());
  const details = String(payload.details || "");

  if (!email || !email.includes("@")) {
    return json({ ok: false, error: "Invalid email" }, 400);
  }

  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.getSheets()[0];
  sheet.appendRow([email, source, createdAt, details]);

  return json({ ok: true }, 200);
}

function json(body, status) {
  return ContentService
    .createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## 3. Deploy

Click `Deploy -> New deployment`.

- Type: `Web app`
- Execute as: `Me`
- Who has access: `Anyone`

Copy the Web App URL.

## 4. Add Env Var

Create or update `.env.local`:

```bash
GOOGLE_SHEETS_WEBHOOK_URL="YOUR_WEB_APP_URL"
```

Restart the dev server.
