from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import List

class SupplierBase(BaseModel):
    name: str
    country: str
    industry: str
    risk_score: float
    status: str
    last_updated: datetime

class SupplierOut(SupplierBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class RiskEventBase(BaseModel):
    event_type: str
    severity: str
    description: str
    date_detected: datetime
    is_active: bool

class RiskEventOut(RiskEventBase):
    id: int
    supplier_id: int
    model_config = ConfigDict(from_attributes=True)

class SupplyChainAlertBase(BaseModel):
    title: str
    category: str
    affected_region: str
    impact_level: str
    summary: str
    created_at: datetime

class SupplyChainAlertOut(SupplyChainAlertBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

from typing import List, Optional

class AnalyzeRequest(BaseModel):
    company_name: str
    supplier_ids: Optional[List[int]] = []

class SupplierDetailOut(SupplierOut):
    risk_events: List[RiskEventOut] = []
    
    model_config = ConfigDict(from_attributes=True)
