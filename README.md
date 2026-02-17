# Jared Wilson – Cloud Portfolio

Production-ready static portfolio site hosted on AWS using secure, automated CI/CD via GitHub Actions.

## 🌐 Live Site
https://jaredwilson.me

---

## 🏗 Architecture

GitHub (main branch)  
→ GitHub Actions (OIDC)  
→ Amazon S3 (private bucket)  
→ CloudFront (OAC + HTTPS)  
→ Route 53 (DNS)  

---

## ⚙️ Tech Stack

- HTML / CSS / JavaScript
- Amazon S3 (static hosting)
- Amazon CloudFront (CDN)
- AWS Certificate Manager (TLS)
- Route 53 (DNS)
- IAM (OIDC federation)
- GitHub Actions (CI/CD)

---

## 🔐 Security Design

- S3 bucket is private
- CloudFront uses Origin Access Control
- No long-lived AWS access keys
- GitHub OIDC federation for temporary credentials
- Security headers via CloudFront Response Headers Policy
- HTTPS enforced (ACM certificate)

---

## 🚀 Deployment (CI/CD)

Automatic deployment on push to `main` branch

Workflow:
1. GitHub Action assumes IAM role via OIDC
2. Syncs site to S3
3. Invalidates CloudFront cache

Deployment is fully automated.

---

## 🧠 What This Demonstrates

- Secure static site hosting
- OIDC-based IAM federation
- Least privilege access design
- CDN integration
- DNS delegation
- Automated cloud deployment

