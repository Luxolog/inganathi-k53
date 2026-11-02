/**
 * Inganathi Learner Survey — Google Apps Script backend
 * Deploy as a Web App: Execute as Me; access Anyone.
 * Keep the destination spreadsheet private in Google Drive.
 * Run setupInganathiSurvey() once from the Apps Script editor.
 */
const PROP_SHEET_ID = "INGANATHI_SURVEY_SHEET_ID";
const HEADERS = [
  "Submitted At","First Name","Surname","Cellphone","Email","Area","Age Group","Licence Interest",
  "Learner Status","Challenges","Next Step","Study Interest","Support Requested","Start Timing",
  "Other Challenge","Referred By","Would Recommend","Wants To Refer","Referred Person Name",
  "Referred Person Phone","Contact Preference","Processing Consent","Marketing Consent"
];

function setupInganathiSurvey() {
  const props = PropertiesService.getScriptProperties();
  let id = props.getProperty(PROP_SHEET_ID);
  let ss;
  if (id) {
    ss = SpreadsheetApp.openById(id);
  } else {
    ss = SpreadsheetApp.create("Inganathi Driving Academy — Learner Survey Responses");
    id = ss.getId();
    props.setProperty(PROP_SHEET_ID, id);
    const sheet = ss.getSheets()[0];
    sheet.setName("Survey Responses");
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold").setBackground("#080d18").setFontColor("#ffffff");
    sheet.autoResizeColumns(1, HEADERS.length);
  }
  Logger.log("Private response spreadsheet: " + ss.getUrl());
  return ss.getUrl();
}

function doPost(e) {
  try {
    const raw = e && e.postData && e.postData.contents;
    if (!raw) return json_({ ok: false, error: "Empty request" });
    const data = JSON.parse(raw);
    if (data.website) return json_({ ok: true }); // honeypot
    const required = ["firstName","surname","phone","area","licenceType","learnerStatus","studyInterest"];
    required.forEach(k => { if (!String(data[k] || "").trim()) throw new Error("Missing required field: " + k); });
    if (data.contactConsent !== true) throw new Error("Consent is required.");
    const phone = String(data.phone).replace(/[^+\d]/g, "");
    if (phone.length < 7 || phone.length > 16) throw new Error("Invalid cellphone number.");
    if (String(data.firstName).length > 70 || String(data.surname).length > 70) throw new Error("Name too long.");
    if (String(data.email || "").length > 120) throw new Error("Email too long.");
    if (data.hasReferral === "Yes" && data.friendPhone && !data.friendName) throw new Error("Referral name required.");
    const cache = CacheService.getScriptCache();
    const fingerprint = Utilities.base64EncodeWebSafe(
      Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, phone + "|" + new Date().toISOString().slice(0,10))
    );
    if (cache.get("submitted_" + fingerprint)) return json_({ ok: true, duplicate: true });
    const id = PropertiesService.getScriptProperties().getProperty(PROP_SHEET_ID);
    if (!id) throw new Error("Survey is not configured. Run setupInganathiSurvey first.");
    const ss = SpreadsheetApp.openById(id);
    const sheet = ss.getSheetByName("Survey Responses") || ss.getSheets()[0];
    const row = [
      new Date(), safe_(data.firstName), safe_(data.surname), safe_(data.phone), safe_(data.email),
      safe_(data.area), safe_(data.ageGroup), safe_(data.licenceType), safe_(data.learnerStatus),
      safe_(list_(data.challenges)), safe_(data.nextStep), safe_(data.studyInterest), safe_(list_(data.support)),
      safe_(data.startWhen), safe_(data.challengeOther), safe_(data.referrerName), safe_(data.recommend),
      safe_(data.hasReferral), safe_(data.friendName), safe_(data.friendPhone), safe_(data.contactPreference),
      "Yes", data.marketingConsent === true ? "Yes" : "No"
    ];
    sheet.appendRow(row);
    cache.put("submitted_" + fingerprint, "1", 60 * 60 * 12);
    return json_({ ok: true });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: String(err.message || err) });
  }
}

function safe_(value) {
  const s = String(value == null ? "" : value).slice(0, 1000);
  // Prevent user-entered values from being interpreted as spreadsheet formulas.
  return /^[=+@\-]/.test(s) ? "'" + s : s;
}
function list_(value) { return Array.isArray(value) ? value.join(", ") : ""; }
function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
