from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
import schemas, models, database, ai_agent

# Create tables logic isn't strictly necessary here if seed_data does it,
# but it's good practice to ensure they exist on startup
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="RiskRadar API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Welcome to the RiskRadar API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.get("/api/suppliers", response_model=List[schemas.SupplierOut])
def list_suppliers(db: Session = Depends(get_db)):
    return db.query(models.Supplier).all()

@app.get("/api/suppliers/{id}", response_model=schemas.SupplierDetailOut)
def get_supplier(id: int, db: Session = Depends(get_db)):
    supplier = db.query(models.Supplier).filter(models.Supplier.id == id).first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    return supplier

@app.get("/api/risk-events", response_model=List[schemas.RiskEventOut])
def list_risk_events(severity: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.RiskEvent).filter(models.RiskEvent.is_active == True)
    if severity:
        # basic case-insensitive match for demo
        query = query.filter(models.RiskEvent.severity.ilike(severity))
    return query.all()

@app.get("/api/risk-events/{id}", response_model=schemas.RiskEventOut)
def get_risk_event(id: int, db: Session = Depends(get_db)):
    event = db.query(models.RiskEvent).filter(models.RiskEvent.id == id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Risk event not found")
    return event

@app.get("/api/alerts", response_model=List[schemas.SupplyChainAlertOut])
def list_alerts(db: Session = Depends(get_db)):
    alerts = db.query(models.SupplyChainAlert).all()
    
    # Sort by impact level -> Severe, Major, Moderate, Minor
    impact_order = {"Severe": 4, "Major": 3, "Moderate": 2, "Minor": 1}
    alerts.sort(key=lambda x: impact_order.get(x.impact_level, 0), reverse=True)
    return alerts

@app.get("/api/dashboard/summary")
def get_dashboard_summary(db: Session = Depends(get_db)):
    total_suppliers = db.query(models.Supplier).count()
    # High risk is defined as score > 50 for this demo
    high_risk_count = db.query(models.Supplier).filter(models.Supplier.risk_score > 50.0).count()
    active_alerts_count = db.query(models.SupplyChainAlert).count()
    avg_risk_score = db.query(func.avg(models.Supplier.risk_score)).scalar() or 0.0

    return {
        "total_suppliers": total_suppliers,
        "high_risk_count": high_risk_count,
        "active_alerts_count": active_alerts_count,
        "average_risk_score": round(avg_risk_score, 2)
    }

@app.get("/api/risk-map")
def get_risk_map(db: Session = Depends(get_db)):
    # Group by country
    results = db.query(
        models.Supplier.country,
        func.count(models.Supplier.id).label('count'),
        func.avg(models.Supplier.risk_score).label('avg_score')
    ).group_by(models.Supplier.country).all()

    return [{"country": r[0], "count": r[1], "avg_risk_score": round(r[2], 2)} for r in results]

@app.post("/api/analyze")
def analyze_company(req: schemas.AnalyzeRequest, db: Session = Depends(get_db)):
    # 1. Custom explicit suppliers or company profile
    company = None
    suppliers = []
    if req.supplier_ids and len(req.supplier_ids) > 0:
        suppliers = db.query(models.Supplier).filter(models.Supplier.id.in_(req.supplier_ids)).all()
    else:
        company = db.query(models.Company).filter(models.Company.name.ilike(f"%{req.company_name}%")).first()
        if company and company.dependencies:
            import json
            try:
                dep_names = json.loads(company.dependencies)
                suppliers = db.query(models.Supplier).filter(models.Supplier.name.in_(dep_names)).all()
            except Exception:
                pass
            
    if not suppliers:
        # Fallback to random if no exact match
        suppliers = db.query(models.Supplier).limit(3).all()

    sup_dicts = [{"name": s.name, "country": s.country, "industry": s.industry, "risk_score": s.risk_score} for s in suppliers]
    
    # 3. Score Exposure
    exposure_summary = ai_agent.score_supply_chain_exposure(req.company_name, sup_dicts)
    
    # 4. Analyze each supplier
    supplier_analysis = []
    for s in sup_dicts:
        supplier_analysis.append(ai_agent.analyze_supplier_risk(s))
        
    # 5. Get a recent event to demonstrate mitigation recommendations
    recent_event = db.query(models.RiskEvent).filter(models.RiskEvent.is_active == True).order_by(models.RiskEvent.id.desc()).first()
    recent_event_dict = {"event_type": "unknown", "severity": "low", "description": "No active events"}
    if recent_event:
        recent_event_dict = {
            "event_type": recent_event.event_type,
            "severity": recent_event.severity,
            "description": recent_event.description
        }
    mitigation_steps = ai_agent.recommend_mitigation(recent_event_dict)

    return {
        "company_name": company.name if company else req.company_name,
        "exposure_analysis": exposure_summary,
        "supplier_details": supplier_analysis,
        "recommended_mitigation": mitigation_steps
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
