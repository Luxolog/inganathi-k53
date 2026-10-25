# Inganathi K53 result emails — Google Apps Script

This endpoint emails each completed test result to **info@uvanofinserv.co.za** as plain text.

## Setup

1. Open https://script.google.com/ and create a new project.
2. Replace the editor contents with `Code.gs` from this folder.
3. Save the project.
4. Select `authorizeEmailSending` and click **Run**. Review and approve the Google permission to send email.
5. Select **Deploy → New deployment**.
6. Choose **Web app**.
7. Set **Execute as** to **Me**.
8. Set **Who has access** to **Anyone** and deploy. Google may require you to sign in again to approve this public web app.
9. Copy the Web app URL ending in `/exec`. Do not share the script editor URL.
10. Provide that `/exec` URL so it can be connected to the GitHub Pages test.

## Important

- Do not put Google account passwords or credentials in the GitHub repository.
- This is a public endpoint; anyone who obtains its URL could attempt to submit a message. Review deployment access and monitor usage.
- The learner's ID number is personal information. Limit access to the receiving mailbox and handle results according to your privacy obligations.
- The test website should send the JSON body as `text/plain;charset=utf-8` to avoid a browser preflight request.
- GitHub Pages cannot send email directly using SMTP. Apps Script sends the email on the server side.
- The existing FormSubmit integration remains active until the Apps Script web app URL is configured and tested.
