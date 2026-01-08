from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from database import Base

class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    country = Column(String, index=True)
    industry = Column(String, index=True)
    risk_score = Column(Float, default=0.0)
    status = Column(String)  # Active, Under Review, Suspended
    last_updated = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    risk_events = relationship("RiskEvent", back_populates="supplier")

class RiskEvent(Base):
    __tablename__ = "risk_events"

    id = Column(Integer, primary_key=True, index=True)
    supplier_id = Column(Integer, ForeignKey("suppliers.id"))
    event_type = Column(String, index=True)
    severity = Column(String)  # Low, Medium, High, Critical
    description = Column(Text)
    date_detected = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    is_active = Column(Boolean, default=True)

    supplier = relationship("Supplier", back_populates="risk_events")

class SupplyChainAlert(Base):
    __tablename__ = "supply_chain_alerts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    category = Column(String)
    affected_region = Column(String)
    impact_level = Column(String)  # Minor, Moderate, Major, Severe
    summary = Column(Text)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    sector = Column(String, index=True)
    exposure_score = Column(Float, default=0.0)
    dependencies = Column(Text)  # Storing as JSON string
