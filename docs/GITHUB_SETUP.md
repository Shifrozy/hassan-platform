# GitHub Workflow & Repository Guide

This document describes how the Git repository for **Hassan Platform** is structured and how to push, update, and manage code releases.

---

## Repository Details

* **Remote URL:** `https://github.com/Shifrozy/hassan-platform`
* **Default Branch:** `main`

---

## Common Git Commands

### 1. Checking Status
```bash
git status
```

### 2. Staging & Committing New Changes
```bash
git add .
git commit -m "feat: add new trading product or update services"
```

### 3. Pushing Changes to GitHub
```bash
git push origin main
```

---

## Connecting GitHub to Automatic Deployment (Hostinger / Vercel / GitHub Pages)

### Option A: Hostinger Git Auto-Deployment
1. Follow the instructions in [`docs/HOSTINGER_DEPLOYMENT_GUIDE.md`](file:///d:/Projects/Hassan%20Products/docs/HOSTINGER_DEPLOYMENT_GUIDE.md#step-2-uploading-via-hostinger-git-auto-deploy-method-b-recommended).
2. Connect the GitHub Webhook to your Hostinger deployment URL.
3. Every push to `main` will automatically update your live website on Hostinger!

### Option B: Free Staging / Preview on GitHub Pages
1. On GitHub, navigate to **Settings** &rarr; **Pages**.
2. Under **Build and deployment**, select **Deploy from a branch**.
3. Choose branch `main` and folder `/ (root)`.
4. Click **Save**.
5. Your website will be live immediately at `https://shifrozy.github.io/hassan-platform/`.
