# EasyWISP Onboarding Questionnaire

This folder is a standalone version of the questionnaire flow, separated from the rest of the EasyWISP application so you can host it privately for client onboarding.

## Files to host
- `index.html`
- `onboarding.js`
- `styles.css`

Host these three files together as a static site.

## Recommended hosting
Use **Cloudflare Pages** for hosting and **Cloudflare Access** to protect the site.

Why this setup works well:
- simple for a static frontend
- fast global delivery
- easy private access control
- works well for live onboarding calls

## Access model
Protect the site with Cloudflare Access and allow only:
- your email address
- approved team emails
- specific client emails when needed

For external clients, use **One-Time PIN** email login so they do not need a permanent account.

## Cloudflare setup
1. Create a Cloudflare account and open the dashboard.
2. Go to **Workers & Pages** → **Create application** → **Pages**.
3. Choose **Upload assets**.
4. Upload the contents of this folder, or upload a zip and extract it locally before deploying.
5. Publish the site and confirm the questionnaire loads.
6. In Cloudflare, open **Zero Trust**.
7. Go to **Access** → **Applications** → **Add an application**.
8. Choose **Self-hosted**.
9. Enter the Pages hostname for this questionnaire.
10. Under identity providers, enable **One-Time PIN**.
11. Create an **Allow** policy for:
    - your email
    - your staff emails
    - any client emails you want to let in
12. Add a default **Deny** policy for everyone else.
13. Test access in an incognito browser window before sending the link to a client.

## Suggested workflow for onboarding calls
1. Add the client’s email to the Access allowlist before the call.
2. Send them the private questionnaire URL.
3. They log in with a one-time PIN sent to their email.
4. Walk through the questionnaire together live.
5. Remove their email from the allowlist afterward if you want temporary access only.

## Local preview
You can test locally by opening `index.html` directly, or by serving this folder with any static file server.
