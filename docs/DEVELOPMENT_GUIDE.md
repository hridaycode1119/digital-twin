# Development & Environment Setup Guide

## Project: TwinHealth — AI-Powered Digital Twin for Personalized Healthcare

---

## 1. Monorepo Repository Structure

```text
digital-twin/
├── apps/
│   ├── web/                         # Next.js 14+ Frontend (React Three Fiber, Tailwind)
│   │   ├── public/
│   │   │   └── models/              # 3D Anatomical GLTF/GLB models (body, organs)
│   │   ├── src/
│   │   │   ├── app/                 # App Router (login, onboarding, dashboard, twin, etc.)
│   │   │   ├── components/          # UI Components (3D viewer, charts, timeline, modals)
│   │   │   ├── hooks/               # Custom React hooks (useDigitalTwin, useVitals)
│   │   │   ├── lib/                 # API client (Axios/Ky), utils, query client
│   │   │   ├── stores/              # Zustand state stores (authStore, twinStore)
│   │   │   └── types/               # TypeScript interfaces & API contracts
│   │   ├── package.json
│   │   ├── tailwind.config.ts
│   │   └── tsconfig.json
│   │
│   └── api/                         # FastAPI Backend Application
│       ├── alembic/                 # Database schema migrations
│       ├── app/
│       │   ├── api/
│       │   │   └── v1/              # Versioned API route controllers
│       │   │       ├── auth.py
│       │   │       ├── patients.py
│       │   │       ├── records.py
│       │   │       ├── digital_twin.py
│       │   │       ├── predictions.py
│       │   │       ├── simulation.py
│       │   │       └── chat.py
│       │   ├── core/                # Config, security (JWT), database engine, logging
│       │   ├── models/              # SQLAlchemy ORM database models
│       │   ├── schemas/             # Pydantic v2 request/response validation schemas
│       │   ├── services/            # Business logic (TwinEngine, OCRService, RAGService)
│       │   └── ml/                  # ML inference wrappers, SHAP pipelines, scalers
│       ├── tests/                   # Pytest test suite
│       ├── Dockerfile
│       └── requirements.txt
│
├── packages/
│   ├── ml_pipelines/                # Offline Model Training & Evaluation Scripts
│   │   ├── datasets/                # Cleaned datasets & fetch scripts
│   │   ├── notebooks/               # Jupyter exploration & research ablation experiments
│   │   ├── src/                     # Training pipelines (Heart, Diabetes, Stroke)
│   │   └── saved_models/            # Serialized models (.pkl, .joblib, .json)
│   └── shared_types/                # Shared schemas / TypeScript-Python type definitions
│
├── docker-compose.yml               # Multi-service local development container orchestration
├── .env.example                     # Unified environment template
├── README.md                        # Master project documentation
└── docs/                            # Engineering specification documents
```

---

## 2. System Prerequisites

Ensure the following tools are installed on your workstation:
* **Node.js:** `v20.x` or higher (with `npm` or `pnpm`)
* **Python:** `3.11` or `3.12`
* **Docker Desktop:** with Docker Compose v2+
* **Git:** for version control

---

## 3. Environment Variables Configuration

Create a `.env` file in the root directory (or in `apps/api` and `apps/web`):

```bash
# ==========================================
# Application & Security
# ==========================================
APP_ENV=development
SECRET_KEY=your-super-secret-jwt-signing-key-change-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# ==========================================
# Database & Cache
# ==========================================
POSTGRES_USER=twinhealth_user
POSTGRES_PASSWORD=twinhealth_secure_pass
POSTGRES_DB=twinhealth_db
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
DATABASE_URL=postgresql+asyncpg://twinhealth_user:twinhealth_secure_pass@localhost:5432/twinhealth_db

REDIS_URL=redis://localhost:6379/0

# ==========================================
# Object Storage (MinIO / S3)
# ==========================================
STORAGE_ENDPOINT=http://localhost:9000
STORAGE_ACCESS_KEY=minioadmin
STORAGE_SECRET_KEY=minioadmin
STORAGE_BUCKET_NAME=medical-records

# ==========================================
# AI & Vector DB Services
# ==========================================
OPENAI_API_KEY=sk-...
VECTOR_DB_URL=http://localhost:6333
VECTOR_DB_COLLECTION=patient_health_records

# ==========================================
# Frontend Configuration
# ==========================================
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

---

## 4. Local Development Quickstart

### Option A: Using Docker Compose (Recommended)

To spin up all backing services (PostgreSQL, Redis, MinIO, Qdrant, FastAPI, Next.js):

```bash
# 1. Start all infrastructure and applications
docker compose up -d

# 2. View logs
docker compose logs -f

# 3. Access applications:
# Frontend UI:      http://localhost:3000
# FastAPI Swagger:  http://localhost:8000/docs
# MinIO Console:    http://localhost:9001
```

### Option B: Running Services Locally

#### Step 1: Start Infrastructure Containers
```bash
docker compose up -d postgres redis minio qdrant
```

#### Step 2: Set Up & Run Backend (FastAPI)
```bash
cd apps/api

# Create and activate python virtual environment
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations
alembic upgrade head

# Start FastAPI development server with auto-reload
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

#### Step 3: Set Up & Run Frontend (Next.js)
```bash
cd apps/web

# Install dependencies
npm install

# Start Next.js development server
npm run dev
```

---

## 5. Testing & Quality Assurance

### Backend Tests
```bash
cd apps/api
pytest -v --cov=app tests/
```

### Frontend Tests & Type Checking
```bash
cd apps/web
npm run typecheck
npm run test
```

### Code Formatting & Linting
* **Python Backend:** `ruff check .` and `ruff format .`
* **TypeScript Frontend:** `npm run lint` and `npx prettier --write .`
