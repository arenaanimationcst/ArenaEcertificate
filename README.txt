ARENA ANIMATION C.S.T - CERTIFICATE SITE
=========================================

WHAT IS INSIDE
  index.html              Public landing page (students never see the dashboard here)
  c/                      Student page: opens the certificate, Download PDF / image. Nothing can be edited.
  admin/                  YOUR dashboard. Do not share this address with students.
  assets/                 Scripts, styles, fonts and the certificate artwork
  vendor/                 PDF and Excel libraries (bundled, no internet needed)
  sw.js                   Service worker (offline use and faster loading)
  .nojekyll, 404.html     GitHub Pages helpers

HOW TO PUT IT ON GITHUB PAGES
  1. On github.com create a repository, for example "certificates" (public).
  2. Upload EVERYTHING from this folder (keep the folders). Upload the folder contents,
     not the zip file itself. Make sure the hidden file .nojekyll is included.
  3. Repository Settings > Pages > Source: "Deploy from a branch" > Branch: main, folder: / (root) > Save.
  4. After a minute your site is live at  https://YOUR-ORG.github.io/certificates/
       Student links look like  https://YOUR-ORG.github.io/certificates/c/#v=...
       Your dashboard is at     https://YOUR-ORG.github.io/certificates/admin/
  5. Open the dashboard once and use "Install" / "Add to Home screen" if you want it as an app.

USING IT
  New seminar > fill college, date, certificate text, message > add students > Send.
  Keep {{link}} in the WhatsApp message so each student gets their own certificate link.

IMPORTANT
  - Choose the repository name once. Renaming it later breaks links already sent.
  - Seminar and student data is saved in the browser you use. Press Backup now and then.
  - To release an update, upload the new files and change V='arena-cert-v1' in sw.js
    to v2 so phones and laptops fetch the new version.
