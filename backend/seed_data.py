import json
from datetime import datetime, timedelta, timezone
from database import SessionLocal, engine, Base
from models import Supplier, RiskEvent, SupplyChainAlert, Company
import random

def seed_db():
    print("Dropping existing tables...")
    Base.metadata.drop_all(bind=engine)
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    # 15 Suppliers
    suppliers_data = [
        {"name": "TechComponents Yantai", "country": "China", "industry": "Semiconductors", "risk_score": 75.5, "status": "Under Review"},
        {"name": "Shenzhen AutoParts Hub", "country": "China", "industry": "Automotive", "risk_score": 62.1, "status": "Active"},
        {"name": "Foxconn Zhengzhou", "country": "China", "industry": "Electronics Assembly", "risk_score": 45.0, "status": "Active"},
        {"name": "Bavaria Engines GmbH", "country": "Germany", "industry": "Automotive", "risk_score": 25.4, "status": "Active"},
        {"name": "Ruhr Steelworks", "country": "Germany", "industry": "Metals & Mining", "risk_score": 30.1, "status": "Active"},
        {"name": "Global Fabs Texas", "country": "US", "industry": "Semiconductors", "risk_score": 15.2, "status": "Active"},
        {"name": "Midwest Agro-Logistics", "country": "US", "industry": "Agriculture", "risk_score": 22.0, "status": "Active"},
        {"name": "Tata Electronics Hub", "country": "India", "industry": "Electronics Assembly", "risk_score": 42.5, "status": "Active"},
        {"name": "Mumbai Pharma Synthetics", "country": "India", "industry": "Pharmaceuticals", "risk_score": 58.7, "status": "Active"},
        {"name": "Gujarat Textiles Pvt Ltd", "country": "India", "industry": "Textiles", "risk_score": 38.4, "status": "Active"},
        {"name": "Mekong Delta Manufacturing", "country": "Vietnam", "industry": "Apparel", "risk_score": 50.1, "status": "Active"},
        {"name": "Hanoi Tech Assembly", "country": "Vietnam", "industry": "Electronics Assembly", "risk_score": 48.0, "status": "Active"},
        {"name": "Monterrey Auto Assembly", "country": "Mexico", "industry": "Automotive", "risk_score": 33.2, "status": "Active"},
        {"name": "Jalisco Agave & Produce", "country": "Mexico", "industry": "Agriculture", "risk_score": 41.6, "status": "Active"},
        {"name": "Tijuana Medical Devices", "country": "Mexico", "industry": "Healthcare Devices", "risk_score": 28.5, "status": "Active"}
    ]

    suppliers = []
    for data in suppliers_data:
        s = Supplier(**data)
        db.add(s)
        suppliers.append(s)
    
    db.commit()
    for s in suppliers:
        db.refresh(s)

    # 20 Risk Events
    now = datetime.now(timezone.utc)
    risk_events_data = [
        {"supplier_id": suppliers[0].id, "event_type": "geopolitical", "severity": "High", "description": "New export restrictions impact semiconductor components.", "date_detected": now - timedelta(days=2)},
        {"supplier_id": suppliers[1].id, "event_type": "regulatory", "severity": "Medium", "description": "Local emission regulations tightened for automotive manufacturing.", "date_detected": now - timedelta(days=15)},
        {"supplier_id": suppliers[2].id, "event_type": "natural disaster", "severity": "Low", "description": "Mild flooding in the region causing minor logistical delays.", "date_detected": now - timedelta(days=5)},
        {"supplier_id": suppliers[3].id, "event_type": "cyber", "severity": "Medium", "description": "Ransomware attack mitigated, minor data disruption reported.", "date_detected": now - timedelta(days=30)},
        {"supplier_id": suppliers[4].id, "event_type": "financial", "severity": "Low", "description": "Steel prices surge, increasing operational costs.", "date_detected": now - timedelta(days=10)},
        {"supplier_id": suppliers[5].id, "event_type": "financial", "severity": "Low", "description": "Positive quarterly earnings but slow expansion rate.", "date_detected": now - timedelta(days=45)},
        {"supplier_id": suppliers[6].id, "event_type": "natural disaster", "severity": "High", "description": "Drought conditions severely impact logistics channels.", "date_detected": now - timedelta(days=3)},
        {"supplier_id": suppliers[7].id, "event_type": "regulatory", "severity": "Medium", "description": "Tax incentive changes affecting local assembly costs.", "date_detected": now - timedelta(days=12)},
        {"supplier_id": suppliers[8].id, "event_type": "regulatory", "severity": "High", "description": "FDA inspection identifies compliance gaps in synthesizing unit.", "date_detected": now - timedelta(days=4)},
        {"supplier_id": suppliers[9].id, "event_type": "financial", "severity": "Medium", "description": "Currency depreciation affecting raw cotton import costs.", "date_detected": now - timedelta(days=20)},
        {"supplier_id": suppliers[10].id, "event_type": "natural disaster", "severity": "Critical", "description": "Typhoon damages main storage warehouse leading to 30% capacity loss.", "date_detected": now - timedelta(days=1)},
        {"supplier_id": suppliers[11].id, "event_type": "geopolitical", "severity": "Medium", "description": "Regional port strikes causing 48-hour shipment delays.", "date_detected": now - timedelta(days=6)},
        {"supplier_id": suppliers[12].id, "event_type": "cyber", "severity": "High", "description": "Data breach on supplier portal exposes sensitive blueprint designs.", "date_detected": now - timedelta(days=8)},
        {"supplier_id": suppliers[13].id, "event_type": "financial", "severity": "Medium", "description": "Labor union demands wage hike, threatening walkouts.", "date_detected": now - timedelta(days=11)},
        {"supplier_id": suppliers[14].id, "event_type": "regulatory", "severity": "Low", "description": "New medical device certification standards mandated for next year.", "date_detected": now - timedelta(days=25)},
        {"supplier_id": suppliers[0].id, "event_type": "cyber", "severity": "Critical", "description": "Advanced persistent threat (APT) activity detected on internal networks.", "date_detected": now - timedelta(days=7)},
        {"supplier_id": suppliers[2].id, "event_type": "natural disaster", "severity": "Medium", "description": "Power grid failures due to heatwave reducing production hours.", "date_detected": now - timedelta(days=14)},
        {"supplier_id": suppliers[5].id, "event_type": "geopolitical", "severity": "Medium", "description": "State-level subsidy allocations re-directed, varying factory output.", "date_detected": now - timedelta(days=18)},
        {"supplier_id": suppliers[8].id, "event_type": "geopolitical", "severity": "High", "description": "Trade tariffs increased on key pharmaceutical ingredients.", "date_detected": now - timedelta(days=22)},
        {"supplier_id": suppliers[12].id, "event_type": "financial", "severity": "Low", "description": "Supplier transitions to nearshoring models stabilizing transport costs.", "date_detected": now - timedelta(days=2)}
    ]

    for data in risk_events_data:
        re = RiskEvent(**data)
        db.add(re)
    
    # 10 Supply Chain Alerts
    alerts_data = [
        {"title": "Global Semiconductor Shortage Escalation", "category": "Shortage", "affected_region": "Global", "impact_level": "Severe", "summary": "Export bans have escalated, projecting a 15% drop in semiconductor availability."},
        {"title": "Suez Canal Temporary Blockage", "category": "Logistics", "affected_region": "Middle East / Europe", "impact_level": "Major", "summary": "A large vessel is grounded, causing immediate bottleneck for 120+ cargo ships."},
        {"title": "Vietnam Typhoon Recovery Delay", "category": "Natural Disaster", "affected_region": "Southeast Asia", "impact_level": "Severe", "summary": "Recovery from recent typhoons is slower than expected, heavily impacting apparel and electronics."},
        {"title": "US West Coast Port Labor Strike", "category": "Labor", "affected_region": "North America", "impact_level": "Major", "summary": "Ongoing labor strikes at LA/Long Beach ports causing 7-day average docking delays."},
        {"title": "European Energy Market Volatility", "category": "Financial", "affected_region": "Europe", "impact_level": "Moderate", "summary": "Gas price spikes are affecting cost structures for energy-intensive metals and chemicals."},
        {"title": "Mexico Nearshoring Growth Strains Infrastructure", "category": "Logistics", "affected_region": "Latin America", "impact_level": "Moderate", "summary": "Rapid industrial growth in Northern Mexico is overwhelming local road and rail infrastructure."},
        {"title": "India Pharmaceutical Export Restrictions", "category": "Regulatory", "affected_region": "South Asia", "impact_level": "Major", "summary": "New regulatory hurdles on exporting active pharmaceutical ingredients (APIs)."},
        {"title": "Global Ransomware Campaign Targeting Manufacturing", "category": "Cyber", "affected_region": "Global", "impact_level": "Severe", "summary": "Coordinated cyber attacks have crippled software systems for several tier-2 manufacturers."},
        {"title": "Drought in US Midwest Affecting Crop Yields", "category": "Natural Disaster", "affected_region": "North America", "impact_level": "Moderate", "summary": "Prolonged low rainfall forecasts predict a 10% dip in agricultural raw material output."},
        {"title": "Red Sea Shipping Route Unrest", "category": "Geopolitical", "affected_region": "Middle East", "impact_level": "Major", "summary": "Geopolitical tensions force carriers to reroute around Cape of Good Hope, adding 10-14 days to transit times."}
    ]

    for data in alerts_data:
        alert = SupplyChainAlert(**data)
        db.add(alert)

    # 5 Companies
    companies_data = [
        {"name": "OmniTech Global", "sector": "Consumer Electronics", "exposure_score": 72.4, "dependencies": json.dumps(["TechComponents Yantai", "Foxconn Zhengzhou", "Tata Electronics Hub", "Hanoi Tech Assembly"])},
        {"name": "AutoDrive Motors", "sector": "Automotive", "exposure_score": 65.1, "dependencies": json.dumps(["Shenzhen AutoParts Hub", "Bavaria Engines GmbH", "Monterrey Auto Assembly"])},
        {"name": "MediLife Group", "sector": "Healthcare", "exposure_score": 54.8, "dependencies": json.dumps(["Mumbai Pharma Synthetics", "Tijuana Medical Devices"])},
        {"name": "AgriFoods International", "sector": "Food & Beverage", "exposure_score": 41.2, "dependencies": json.dumps(["Midwest Agro-Logistics", "Jalisco Agave & Produce"])},
        {"name": "BuildRight Infrastructures", "sector": "Construction", "exposure_score": 38.9, "dependencies": json.dumps(["Ruhr Steelworks"])}
    ]

    for data in companies_data:
        comp = Company(**data)
        db.add(comp)

    db.commit()
    db.close()
    print("Database seeded successfully with realistic Dummy Data!")

if __name__ == "__main__":
    seed_db()
