/**
 * Inganathi Driving Academy — K53 result email endpoint
 *
 * Deploy as a Google Apps Script Web App:
 *   Execute as: Me
 *   Who has access: Anyone
 *
 * Receives JSON from the GitHub Pages test and emails a plain-text report.
 * Do not put Google account credentials in the website.
 */

const INSTRUCTOR_EMAIL = "info@uvanofinserv.co.za";
const APP_NAME = "Inganathi Driving Academy K53 Learner's Test";

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ success: false, message: "No result data received." });
    }

    const data = JSON.parse(e.postData.contents);
    const required = ["name", "surname", "cellphone", "result", "score", "percentage"];
    const missing = required.filter(function (key) {
      return !String(data[key] || "").trim();
    });

    if (missing.length) {
      return jsonResponse({
        success: false,
        message: "Missing required fields: " + missing.join(", ")
      });
    }

    // Basic validation and length limits protect the mailbox from oversized payloads.
    const name = safeText(data.name, 100);
    const surname = safeText(data.surname, 100);
    const cellphone = safeText(data.cellphone, 40);
    const idNumber = safeText(data.id_number, 30);
    const result = safeText(data.result, 10).toUpperCase();
    const score = safeText(data.score, 40);
    const percentage = safeText(data.percentage, 20);
    const passMark = safeText(data.pass_mark || "80%", 20);
    const submittedAt = safeText(data.submitted_at || new Date().toLocaleString("en-ZA"), 100);
    const session = safeText(data.session || "Not specified", 40);
    const totalQuestions = safeText(data.session_questions || "", 20);
    const timeLimit = safeText(data.time_limit || "60 minutes", 30);
    const timeExpired = safeText(data.time_expired || "NO", 10);
    const sourceUrl = safeText(data.page_url || "", 300);

    const subject = "Inganathi K53 Test Result — " + name + " " + surname + " — " + result;
    const body = [
      "INGANATHI DRIVING ACADEMY",
      "K53 LEARNER'S TEST RESULT",
      "",
      "Learner: " + name + " " + surname,
      "Cellphone: " + cellphone,
      "ID number: " + (idNumber || "Not provided"),
      "",
      "Result: " + result,
      "Score: " + score,
      "Percentage: " + percentage,
      "Pass mark: " + passMark,
      "Session: " + session,
      "Questions in session: " + totalQuestions,
      "Time limit: " + timeLimit,
      "Time expired: " + timeExpired,
      "Submitted: " + submittedAt,
      sourceUrl ? "Test page: " + sourceUrl : "",
      "",
      "This is an automatically generated result email."
    ].filter(function (line) { return line !== null && line !== undefined; }).join("\n");

    MailApp.sendEmail({
      to: INSTRUCTOR_EMAIL,
      subject: subject,
      body: body,
      name: "Inganathi Driving Academy"
    });

    return jsonResponse({ success: true, message: "Result email sent." });
  } catch (error) {
    console.error(error);
    return jsonResponse({ success: false, message: "Could not send the result email." });
  }
}

function safeText(value, maxLength) {
  return String(value == null ? "" : value).replace(/[\\r\\n\\t]+/g, " ").trim().slice(0, maxLength);
}

function jsonResponse(value) {
  return ContentService
    .createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}

// Run once from the Apps Script editor to authorize email sending.
function authorizeEmailSending() {
  MailApp.getRemainingDailyQuota();
}
