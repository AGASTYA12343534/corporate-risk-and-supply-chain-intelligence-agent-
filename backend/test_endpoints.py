from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def run_tests():
    print("--- Testing /api/suppliers ---")
    r = client.get("/api/suppliers")
    assert r.status_code == 200, f"Failed: {r.text}"
    print(f"Status 200, {len(r.json())} suppliers retrieved")

    print("\n--- Testing /api/suppliers/1 ---")
    r = client.get("/api/suppliers/1")
    assert r.status_code == 200, f"Failed: {r.text}"
    print(f"Status 200, Supplier Name: {r.json().get('name')}")

    print("\n--- Testing /api/risk-events ---")
    r = client.get("/api/risk-events")
    assert r.status_code == 200, f"Failed: {r.text}"
    print(f"Status 200, {len(r.json())} risk events retrieved")

    print("\n--- Testing /api/risk-events with severity=High ---")
    r = client.get("/api/risk-events?severity=High")
    assert r.status_code == 200, f"Failed: {r.text}"
    print(f"Status 200, {len(r.json())} High severity events retrieved")

    print("\n--- Testing /api/risk-events/1 ---")
    r = client.get("/api/risk-events/1")
    assert r.status_code == 200, f"Failed: {r.text}"
    print(f"Status 200, Event Type: {r.json().get('event_type')}")

    print("\n--- Testing /api/alerts ---")
    r = client.get("/api/alerts")
    assert r.status_code == 200, f"Failed: {r.text}"
    print(f"Status 200, {len(r.json())} alerts retrieved, first impact: {r.json()[0]['impact_level']}")

    print("\n--- Testing /api/dashboard/summary ---")
    r = client.get("/api/dashboard/summary")
    assert r.status_code == 200, f"Failed: {r.text}"
    print(f"Status 200, Summary Data: {r.json()}")

    print("\n--- Testing /api/risk-map ---")
    r = client.get("/api/risk-map")
    assert r.status_code == 200, f"Failed: {r.text}"
    print(f"Status 200, Map Data: {r.json()}")

    print("\n--- Testing POST /api/analyze ---")
    r = client.post("/api/analyze", json={"company_name": "Tech Corp"})
    assert r.status_code == 200, f"Failed: {r.text}"
    print(f"Status 200, Analysis: {r.json()}")

    print("\nAll tests passed successfully!")

if __name__ == "__main__":
    try:
        # Install httpx required for TestClient if not already installed
        import httpx
    except ImportError:
        import os
        os.system(".\\venv\\Scripts\\pip install httpx")
    run_tests()
