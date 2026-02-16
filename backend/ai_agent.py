import os
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))

def call_openai_or_fallback(prompt, fallback_func, *args, **kwargs):
    """
    Attempts to call OpenAI. If the API key is missing or the call fails,
    uses the provided smart fallback function.
    """
    if not client.api_key:
        return fallback_func(*args, **kwargs)
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a corporate risk and supply chain intelligence agent. Provide concise, executive-level summaries."},
                {"role": "user", "content": prompt}
            ],
            timeout=10.0 # Prevents long hanging requests if API is slow
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"OpenAI API call failed: {e}. Using fallback mechanism.")
        return fallback_func(*args, **kwargs)

# -----------------
# 1. Analyze Supplier Risk
# -----------------
def fallback_analyze_supplier_risk(supplier_data):
    name = supplier_data.get("name", "Unknown Supplier")
    country = supplier_data.get("country", "Unknown Location")
    industry = supplier_data.get("industry", "Unknown Industry")
    risk_score = supplier_data.get("risk_score", 0.0)
    
    status = "severe" if risk_score >= 60 else "moderate" if risk_score >= 30 else "low"
    return (f"Risk Assessment for {name}: Operating in the {industry} sector within {country}, "
            f"this supplier presents a {status} risk profile with a quantitative score of {risk_score}. "
            f"Given regional dynamics, monitoring geopolitical developments and local logistic resiliency is advised.")

def analyze_supplier_risk(supplier_data):
    prompt = (f"Write a brief executive risk narrative for a supplier named {supplier_data.get('name')} "
              f"in {supplier_data.get('country')} operating in the {supplier_data.get('industry')} sector. "
              f"Their risk score is {supplier_data.get('risk_score', 0)} out of 100.")
    return call_openai_or_fallback(prompt, fallback_analyze_supplier_risk, supplier_data)

# -----------------
# 2. Generate Alert Summary
# -----------------
def fallback_generate_alert_summary(alert_data):
    title = alert_data.get("title", "Unknown Alert")
    region = alert_data.get("affected_region", "Unknown Region")
    impact = alert_data.get("impact_level", "Unknown")
    cat = alert_data.get("category", "General")
    summary = alert_data.get("summary", "")
    
    return (f"EXECUTIVE ALERT: {title} ({region})\n"
            f"Impact Level: {impact.upper()} | Category: {cat}\n"
            f"Details: {summary}\n"
            f"Recommendation: Verify alternative sourcing immediately and assess transit routes.")

def generate_alert_summary(alert_data):
    prompt = (f"Create a 2-sentence executive summary for this supply chain alert:\n"
              f"Title: {alert_data.get('title')}\n"
              f"Region: {alert_data.get('affected_region')}\n"
              f"Category: {alert_data.get('category')}\n"
              f"Impact: {alert_data.get('impact_level')}\n"
              f"Original Notes: {alert_data.get('summary')}")
    return call_openai_or_fallback(prompt, fallback_generate_alert_summary, alert_data)

# -----------------
# 3. Recommend Mitigation
# -----------------
def fallback_recommend_mitigation(risk_event):
    ev_type = str(risk_event.get('event_type', '')).lower()
    desc = risk_event.get('description', '')
    
    if "cyber" in ev_type:
        return "Cyber Mitigation: Mandate immediate rotation of access keys, initiate network segmentation for vendor portals, and request an external audit report from the supplier."
    elif "natural disaster" in ev_type:
        return "Disaster Mitigation: Activate dual-sourcing strategies from unaffected geographical regions. Assess port and freight rerouting options locally."
    elif "geopolitical" in ev_type or "regulatory" in ev_type:
        return "Geopolitical Mitigation: Consult legal on trade compliance. Increase localized buffer inventory by 15% to absorb incoming transit hurdles."
    elif "financial" in ev_type:
        return "Financial Mitigation: Request updated financials, review contract penalty clauses, and establish parallel vendor onboarding."
    
    return ("General Mitigation: Conduct an immediate supplier health audit, review minimum safety stock thresholds, "
            "and establish active communication channels with the supplier's crisis team.")

def recommend_mitigation(risk_event):
    prompt = (f"Suggest 3 concrete, professional mitigation steps for this supply chain risk event:\n"
              f"Type: {risk_event.get('event_type')}\n"
              f"Severity: {risk_event.get('severity')}\n"
              f"Incident Description: {risk_event.get('description')}")
    return call_openai_or_fallback(prompt, fallback_recommend_mitigation, risk_event)

# -----------------
# 4. Score Supply Chain Exposure
# -----------------
def fallback_score_supply_chain_exposure(company_name, suppliers):
    if not suppliers:
        return f"{company_name} has an Unknown exposure level due to lack of supplier data."
        
    avg_score = sum(s.get('risk_score', 0) for s in suppliers) / len(suppliers)
    exposure = "High" if avg_score > 50 else "Medium" if avg_score > 25 else "Low"
    
    countries = list(set([s.get('country') for s in suppliers if s.get('country')]))
    country_str = ", ".join(countries) if countries else "various regions"
    
    return (f"{company_name} Overview:\n"
            f"- Aggregate Exposure Level: {exposure}\n"
            f"- Average Vendor Risk Score: {avg_score:.1f}/100\n"
            f"- Key Dependencies: {len(suppliers)} tier-1 suppliers across {country_str}.\n"
            f"Rationale: This rating is driven by the structural distribution of dependencies and the baseline risk metrics of connected vendors.")

def score_supply_chain_exposure(company_name, suppliers):
    sup_text = ", ".join([f"{s.get('name')} in {s.get('country')} (Score: {s.get('risk_score')})" for s in suppliers])
    prompt = (f"Provide a brief supply chain exposure analysis and an overall exposure severity (Low/Medium/High) for the company '{company_name}'. "
              f"They heavily rely on these suppliers: {sup_text}. "
              f"Consider the geographic mix and the provided risk scores.")
    return call_openai_or_fallback(prompt, fallback_score_supply_chain_exposure, company_name, suppliers)
