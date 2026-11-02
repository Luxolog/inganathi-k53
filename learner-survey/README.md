# Inganathi Learner Survey

A separate, mobile-friendly learner acquisition and referral survey for the existing Inganathi K53 GitHub Pages website. It does not replace or modify the K53 manual, question bank, or test engine.

## Files
- `index.html` — public survey UI
- `Code.gs` — Google Apps Script endpoint; writes submissions to a private Google Sheet

## Google Sheets setup (required before launch)
1. Sign in to the Google account that should own the Inganathi survey data.
2. Open [Google Apps Script](https://script.google.com/) and create a new standalone project named **Inganathi Learner Survey**.
3. Replace the starter code with the contents of `Code.gs` from this folder.
4. In the Apps Script editor, select and run `setupInganathiSurvey`. Approve the requested Google Sheets permissions. This creates the response spreadsheet in the executing account's Drive. Do not share that spreadsheet publicly.
5. In **Deploy → New deployment → Web app**, set **Execute as: Me** and **Who has access: Anyone**. This is needed so learners can submit without signing into Google. The script writes as the owner; the spreadsheet itself remains private in Drive.
6. Deploy and copy the Web App URL ending in `/exec`.
7. Open `learner-survey/index.html` in this repository and replace `PASTE_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE` in the `SURVEY_ENDPOINT` constant with the deployed URL. Commit the change.
8. After any future change to `Code.gs`, create a new Apps Script version and update the deployment to that version.

## Privacy and operations
- Only the Google account that owns the response spreadsheet (and people explicitly granted Drive access) can view the submissions.
- Do not change the spreadsheet's General access setting to public or anyone-with-link.
- Public submissions are accepted by the Apps Script web app; only the response spreadsheet is private. The endpoint URL is not a password. Review submissions and monitor for spam.
- The form asks for processing consent. Marketing consent is separate and optional. Follow up for marketing only where consent is recorded.
- Referral contact fields should only be completed where the referred person has agreed to be contacted. Respondents can share the survey URL instead.
- The browser uses a no-CORS submission because Apps Script web apps redirect requests. The confirmation means the browser sent the request; it cannot independently verify that the row was written. Check the private Sheet during launch testing.
- This is a lead survey, not a learner registration, booking, or payment system. It does not collect identity numbers.

## Publish
The parent site uses GitHub Pages from the repository's `main` branch. Once the endpoint is configured and committed, the survey will be available at:

`https://luxolog.github.io/inganathi-k53/learner-survey/`
