# Hostinger Deployment & Custom Domain Connection Guide

This comprehensive guide explains step-by-step how to deploy **Hassan Platform (V1)** to **Hostinger** and connect your own **custom `.com` domain**, configure free SSL/HTTPS, set up business email, and prepare for future database/backend scaling.

---

## Table of Contents
1. [Overview of Hostinger Hosting Options](#1-overview-of-hostinger-hosting-options)
2. [Step 1: Uploading Files to Hostinger (Method A: File Manager)](#step-1-uploading-files-to-hostinger-method-a-file-manager)
3. [Step 2: Uploading via Hostinger Git Auto-Deploy (Method B: Recommended)](#step-2-uploading-via-hostinger-git-auto-deploy-method-b-recommended)
4. [Step 3: Connecting Your Custom .com Domain](#step-3-connecting-your-custom-com-domain)
5. [Step 4: Activating Free SSL Certificate (HTTPS)](#step-4-activating-free-ssl-certificate-https)
6. [Step 5: Setting Up Custom Business Email (contact@yourdomain.com)](#step-5-setting-up-custom-business-email)
7. [Step 6: Setting Up Automated Backups](#step-6-setting-up-automated-backups)
8. [Step 7: Troubleshooting Common Hosting Issues](#step-7-troubleshooting-common-hosting-issues)
9. [Step 8: Future Scaling Path (Phases 2–7: Node.js, Python & Database)](#step-8-future-scaling-path-phases-27)

---

## 1. Overview of Hostinger Hosting Options

For **Version 1 (Static Web Architecture)**, any of the following Hostinger plans work flawlessly:
* **Hostinger Premium Web Hosting** (Recommended starting plan: includes free `.com` domain, free SSL, and business email).
* **Hostinger Business Web Hosting** (Faster NVMe storage + daily automated backups).
* **Hostinger Cloud / VPS Hosting** (Recommended later in Phase 2–5 when running continuous Python trading bots or custom license verification APIs).

---

## Step 1: Uploading Files to Hostinger (Method A: File Manager)

If you prefer uploading via browser:

1. **Log in to your Hostinger hPanel** at [https://hpanel.hostinger.com](https://hpanel.hostinger.com).
2. Go to **Websites** &rarr; Select your website &rarr; Click **Manage**.
3. Under the **Files** section, click **File Manager**.
4. Open the `public_html` directory (this is your website's root folder).
5. Ensure the directory is empty (delete the default `default.php` file if present).
6. Upload all files and folders from this project:
   ```text
   public_html/
   ├── index.html
   ├── about.html
   ├── services.html
   ├── products.html
   ├── portfolio.html
   ├── reviews.html
   ├── contact.html
   ├── sitemap.xml
   ├── robots.txt
   └── assets/
       ├── css/
       ├── js/
       └── images/
   ```
7. That's it! Visit your domain in the browser to confirm it loads immediately.

---

## Step 2: Uploading via Hostinger Git Auto-Deploy (Method B: Recommended)

Hostinger hPanel has a built-in Git deployment tool. This allows you to update your live website automatically whenever you push code to your GitHub repository (`https://github.com/Shifrozy/hassan-platform`).

1. In **Hostinger hPanel**, go to **Advanced** &rarr; **Git**.
2. Under **Create a New Repository**:
   * **Repository:** `https://github.com/Shifrozy/hassan-platform.git`
   * **Branch:** `main`
   * **Install Path:** `public_html`
3. Click **Create**.
4. Hostinger will clone the repository into `public_html`.
5. Under **Webhook (Auto Deployment)**:
   * Copy the provided Webhook URL.
   * Open your GitHub repository &rarr; **Settings** &rarr; **Webhooks** &rarr; **Add webhook**.
   * Paste the Webhook URL and set content type to `application/json`.
   * Now, every `git push` to `main` will instantly update your live website!

---

## Step 3: Connecting Your Custom .com Domain

### Option A: If your domain was purchased through Hostinger
Hostinger automatically points the DNS records to your hosting account. No manual DNS configuration is required.

### Option B: If your domain was purchased through Namecheap, GoDaddy, Cloudflare, etc.
You have two options:

#### 1. Point via Nameservers (Recommended)
Change your domain registrar's nameservers to Hostinger's nameservers:
* `ns1.dns-parking.com`
* `ns2.dns-parking.com`

#### 2. Point via DNS A Record
In your domain registrar's DNS management panel:
* **Host / Name:** `@`
* **Type:** `A`
* **Value / Points to:** Your Hostinger Server IP (found in hPanel under **Hosting** &rarr; **Details** &rarr; **Server IP**).
* **TTL:** `300` or `Automatic`.

* **Host / Name:** `www`
* **Type:** `CNAME`
* **Value:** `yourdomain.com`

> **Note:** DNS propagation typically takes between 15 minutes to 24 hours globally.

---

## Step 4: Activating Free SSL Certificate (HTTPS)

Hostinger provides unlimited lifetime **Let's Encrypt SSL** certificates for free:

1. In **Hostinger hPanel**, go to **Security** &rarr; **SSL**.
2. Click **Install SSL** next to your domain.
3. Once active, toggle **Force HTTPS** to `ON`.
4. This ensures all visitors are securely redirected to `https://yourdomain.com` with the security padlock icon.

---

## Step 5: Setting Up Custom Business Email

Having `contact@yourdomain.com` gives your personal brand instant authority:

1. In **Hostinger hPanel**, go to **Emails** &rarr; **Email Accounts**.
2. Click **Create Email Account**.
3. Choose username (e.g. `contact` or `hassan`).
4. Set a strong password.
5. You can access webmail directly via `https://mail.hostinger.com` or connect it to your iPhone/Android/Gmail/Outlook using the provided IMAP/SMTP settings.

---

## Step 6: Setting Up Automated Backups

1. In **Hostinger hPanel**, go to **Files** &rarr; **Backups**.
2. Hostinger performs automated weekly (or daily on Business plans) backups.
3. You can click **Generate New Backup** anytime before making major code modifications.

---

## Step 7: Troubleshooting Common Hosting Issues

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| **403 Forbidden** | Missing `index.html` in `public_html` | Ensure `index.html` is in the root `public_html` directory, not inside a nested subfolder. |
| **404 Not Found on subpages** | Case sensitivity in file names | Ensure links match exact case (e.g. `services.html`, not `Services.html`). |
| **CSS / Images Not Loading** | Incorrect relative paths | Check that assets are linked with relative paths (e.g. `assets/css/main.css`). |
| **SSL Not Secure Warning** | Propagation in progress | Allow 30 minutes after domain point before reinstalling SSL in hPanel. |

---

## Step 8: Future Scaling Path (Phases 2–7)

When you are ready to transition from **Version 1 (Static + Client JS)** to **Phases 2–7 (Node.js/Python Backend, PostgreSQL, Stripe/Crypto Payments, Automated MT5 WebRequest Licensing API)**:

1. **Hostinger Node.js / VPS:** Hostinger supports Node.js application hosting and Ubuntu VPS.
2. **Serverless APIs:** Alternatively, you can keep the frontend on Hostinger Web Hosting and deploy backend serverless API functions to **Supabase**, **Vercel Functions**, or a low-cost **DigitalOcean/Hetzner VPS** for your live EA licensing verification API.
3. See [`docs/ARCHITECTURE_AND_SCALING.md`](file:///d:/Projects/Hassan%20Products/docs/ARCHITECTURE_AND_SCALING.md) for the complete roadmap.
