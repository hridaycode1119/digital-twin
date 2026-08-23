# TwinHealth — AI-Powered Digital Twin for Personalized Healthcare

[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014-black?logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Three.js](https://img.shields.io/badge/3D%20Engine-Three.js%20%2F%20R3F-black?logo=three.js)](https://threejs.org/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%2016-336791?logo=postgresql)](https://www.postgresql.org/)
[![XGBoost](https://img.shields.io/badge/ML%20Engine-XGBoost%20%2B%20SHAP-orange)](https://xgboost.readthedocs.io/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> An AI-powered Digital Twin platform that integrates multimodal patient health data into a continuously updated virtual health representation, providing predictive disease analytics, explainable AI insights, personalized recommendations, and interactive 3D health simulations.

---

## 🌟 Key Features

* 🧬 **Interactive 3D Digital Twin:** Real-time 3D anatomical human model with organ-level health status overlays (Heart, Brain, Lungs, Liver, Kidneys, Pancreas) built with Three.js & React Three Fiber.
* 📄 **AI Medical Record Ingestion & OCR:** Automated extraction, categorization, and normalization of lab reports (Blood, Lipid panels, Metabolic profiles) with AI-generated summaries.
* 🔮 **Predictive Disease Risk Engine:** Validated ML models predicting 10-year Cardiovascular Disease (CVD) and Type 2 Diabetes risk.
* 🔍 **Explainable AI (XAI):** Transparent SHAP waterfall attribution explaining exact clinical and lifestyle risk drivers.
* 📊 **Multivariate AI Health Score:** 0–100 wellness index synthesized across vitals, labs, body composition, sleep, and lifestyle.
* 🧪 **What-If Health Simulator:** Dynamic physiological scenario modeling allowing patients to project health impacts of lifestyle interventions.
* 💬 **RAG AI Health Assistant:** Conversational assistant grounded in user medical records and verified clinical references with strict safety guardrails.
* 🩺 **Doctor & Researcher Portals:** Multi-role platform with clinical annotation workflows and model benchmark comparisons.

---

## 📐 System Architecture

```text
                     PATIENT DATA PLATFORM
      [ Lab Reports / OCR ]   [ Wearables & Vitals ]   [ Lifestyle Tracking ]
                                       │
                                       ▼
                       FASTAPI BACKEND CORE ENGINE
           ┌───────────────────────────┼───────────────────────────┐
           ▼                           ▼                           ▼
  [ Digital Twin State ]    [ ML Prediction & SHAP ]     [ RAG Assistant ]
           │                           │                           │
           └───────────────────────────┼───────────────────────────┘
                                       ▼
                     INTERACTIVE 3D WEB CLIENT (NEXT.JS)
          [ 3D Anatomy (R3F) ]  [ Health Timeline ]  [ Doctor Review Portal ]
```

---

## 📚 Technical Documentation Index

All core engineering specifications are ready for development:

| Document | Description |
| :--- | :--- |
| 📖 [Product Requirements (PRD)](./PRD.md) | Full product specifications, user journeys, modules, and research roadmap. |
| 🗺️ [Phase-Wise Execution Roadmap](./Digital_Twin_Project_Phase_Wise_Roadmap.pdf) | 16-phase milestone plan from MVP to full deployment and research publication. |
| 🏗️ [System Architecture](./docs/ARCHITECTURE.md) | Multi-tier architecture, component communication, 3D rendering & RAG design. |
| 🗄️ [Database Schema & Data Dictionary](./docs/DATABASE_SCHEMA.md) | PostgreSQL tables, DDL, relations, JSONB structures, enums, and indexes. |
| 🔌 [API Specification & Contracts](./docs/API_SPECIFICATION.md) | REST API endpoints, JSON schemas, headers, status codes, and examples. |
| 🤖 [Machine Learning & AI Specification](./docs/ML_AI_SPECIFICATION.md) | ML models, datasets, metrics, SHAP XAI, Health Score & Simulator formulas. |
| 💻 [Development & Setup Guide](./docs/DEVELOPMENT_GUIDE.md) | Monorepo layout, Docker Compose setup, local run scripts, and testing guide. |
| 🛡️ [Security, Privacy & Compliance](./docs/SECURITY_AND_COMPLIANCE.md) | RBAC, encryption at rest/transit, audit logging, DPDP/GDPR/HIPAA principles. |

---

## 🚀 Quickstart Guide

### 1. Clone & Configure
```bash
git clone https://github.com/your-org/digital-twin.git
cd digital-twin
cp .env.example .env
```

### 2. Launch Supporting Services (Docker)
```bash
docker compose up -d postgres redis minio qdrant
```

### 3. Start Backend & Frontend
* **Backend (FastAPI):**
  ```bash
  cd apps/api
  python -m venv .venv
  source .venv/bin/activate  # Or .venv\Scripts\activate on Windows
  pip install -r requirements.txt
  alembic upgrade head
  uvicorn app.main:app --reload
  ```
* **Frontend (Next.js):**
  ```bash
  cd apps/web
  npm install
  npm run dev
  ```

---

## 🧭 Phased Delivery Milestones

* **Phase 0–1:** Architecture, Schema, Design System & Clickable Prototype
* **Phase 2–3:** Authentication, RBAC, Patient Onboarding & Profile Layer
* **Phase 4–5:** Medical Document OCR Pipeline, Health Dashboard & Timeline
* **Phase 6–8:** ML Disease Risk Models, SHAP XAI, Health Score, RAG AI Assistant
* **Phase 9–11:** 3D Digital Twin Anatomy (R3F), What-If Simulator, Doctor Portal
* **Phase 12–16:** Advanced Integrations, Security Auditing, Deployment & Research Paper

---

## ⚖️ Disclaimer

*TwinHealth is an academic research prototype and decision-support tool. It is not an FDA-cleared or CE-marked medical device and does not provide standalone diagnostic determinations or prescription medical advice.*
