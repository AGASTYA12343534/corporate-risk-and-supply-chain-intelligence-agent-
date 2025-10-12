# RiskRadar - Corporate Risk & Supply Chain Intelligence Agent

## Overview
RiskRadar is a full-stack web application designed for corporate risk and supply chain intelligence using AI.

## Project Structure
- `/frontend`: React + Vite + Tailwind CSS
- `/backend`: Python FastAPI
- `/data`: Sample JSON data for the application

## Running the Application

### Backend
1. Navigate to the backend directory:
   ```bash
   cd riskradar/backend
   ```
2. Create and activate a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   # On Windows: venv\Scripts\activate
   # On Mac/Linux: source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the server:
   ```bash
   uvicorn main:app --reload
   # Or simply: python main.py
   ```

### Frontend
1. Navigate to the frontend directory:
   ```bash
   cd riskradar/frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
