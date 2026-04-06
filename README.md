# RiskRadar - Corporate Risk & Supply Chain Intelligence Agent

**RiskRadar** is a powerful full-stack intelligence platform built for modern enterprises to autonomously monitor, evaluate, and mitigate vulnerabilities across their global supply chain networks. Leveraging AI-driven synthesis, it actively scans vendor networks to proactively generate mitigation playbooks before disruptions occur.

### Tech Stack
* **Frontend**: React 19, Tailwind CSS 4, React Router, Recharts, React Simple Maps
* **Backend**: Python, FastAPI, SQLAlchemy
* **Database**: SQLite (SQLAlchemy ORM mapped)
* **Intelligence**: OpenAI API (gpt-3.5-turbo fallback-capable agent)
* **Design Pattern**: Headless RESTful microservices

### Core Features
* 📊 **Executive Dashboard**: Real-time KPI summaries monitoring active global alerts and aggregate network risk baselines.
* 🤖 **AI Analysis Studio (Agent Engine)**: Flagship module leveraging an LLM to generate custom intelligence reports, PDF exports, and actionable mitigation playbooks based on supply chain exposure.
* 🌍 **Global Geospatial Risk Map**: Topographic interactive heat maps plotting vendor density against severe geopolitical and economic risk indices.
* 🗃️ **Dynamic Supplier Directory**: Searchable, filter-capable data grid for vendor auditing.
* 🚨 **Global Alert Monitoring**: Grid-level tracking system parsing high-severity event summaries from the field.
* 🛡️ **Robust Fallback Engine**: Proprietary smart-logic fallback generates synthesized insight even when external OpenAI services are intentionally disconnected.
* 📱 **Mobile Responsive Layout**: Tailwind-powered scaling across desktop and mobile.
* 💾 **CSV & PDF Reporting**: Instant data portability for enterprise compliance teams.

### 💼 Built for Resume
> **Corporate Risk & Supply Chain Intelligence Agent**  
> *Architected a full-stack, AI-powered predictive risk system simulating structural vendor disruptions. Built the robust Python FastAPI REST engine bound to SQL databases and orchestrated an interactive React/Tailwind frontend. Engineered an AI abstraction layer utilizing prompt engineering to synthesize structural risk logic with seamless rule-based operational fallback protocols. The system is designed scaling principles to reduce exposure windows for critical infrastructure dependencies.*

### How to Run Locally

You will need two terminal windows to run both services.

#### 1. Start the Backend API (FastAPI)
```bash
cd backend
# Create and activate a virtual environment (optional but recommended)
python -m venv venv
.\venv\Scripts\activate   # (Windows)
source venv/bin/activate  # (Mac/Linux)

# Install dependencies
pip install -r requirements.txt

# Run the backend server
uvicorn main:app --reload
```
The API will spin up on `http://localhost:8000`.

#### 2. Start the Frontend (Vite + React)
```bash
cd frontend

# Install dependencies (use legacy-peer-deps for React 19 mapping)
npm install --legacy-peer-deps

# Run the application
npm start
```
The App will compile and bind locally to `http://localhost:5173`. 

### Architecture Diagram

```ascii
                      +------------------+
                      |                  |
      +-------------->|     React UI     +---------+
      |               |  (Dashboard/Map) |         |
      |               +--------+---------+         |
      |                        |                   |
      v                        v                   v
+-----+-----+-------+    +-----+-----+-------+  +--+----+-------+
|  Alerts / Vendors |    |  AI Analysis Tool |  |  Geo Mapping  |
+---------+---------+    +---------+---------+  +---------+-----+
          |                        |                      |
          +------------------------+----------------------+
                                   |
                                   v  (REST / JSON)
                          +------------------+
                          |   FastAPI App    |
                          | (Backend Server) |
                          +--------+---------+
                                   |
                  +----------------+----------------+
                  |                                 |
                  v                                 v
        +---------+---------+            +----------+----------+
        |   SQLite Database |            | OpenAI Integration  |
        |  (SQLAlchemy ORM) |            |   (Agent Engine)    |
        +-------------------+            +---------------------+
```
