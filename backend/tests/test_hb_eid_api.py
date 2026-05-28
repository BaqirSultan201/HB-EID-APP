"""Backend API tests for HB Eid ul Adha app."""
import os
import pytest
import requests

BASE_URL = "http://localhost:8000"

@pytest.fixture(scope="module")
def s():
    sess = requests.Session()
    sess.headers.update({"Accept": "application/json"})
    return sess


# ---------------- Content: Sunnah ----------------
def test_sunnah_list(s):
    r = s.get(f"{BASE_URL}/api/content/sunnah", timeout=15)
    assert r.status_code == 200
    body = r.json()
    assert "items" in body
    items = body["items"]
    assert len(items) == 9, f"Expected 9 sunnah items, got {len(items)}"
    required = {"arabic", "urdu", "english", "reference"}
    for it in items:
        assert required.issubset(it.keys()), f"Missing fields in {it.get('id')}"


# ---------------- Content: Qurbani ----------------
def test_qurbani_guide(s):
    r = s.get(f"{BASE_URL}/api/content/qurbani", timeout=15)
    assert r.status_code == 200
    body = r.json()
    for key in ("rules", "animal_conditions", "method"):
        assert key in body and isinstance(body[key], list) and len(body[key]) > 0


# ---------------- Content: Takbeer ----------------
def test_takbeer(s):
    r = s.get(f"{BASE_URL}/api/content/takbeer", timeout=15)
    assert r.status_code == 200
    body = r.json()
    for key in ("arabic", "transliteration", "urdu", "english", "reference"):
        assert key in body and body[key], f"Missing/empty {key}"


# ---------------- Content: Dua categories ----------------
def test_dua_categories(s):
    r = s.get(f"{BASE_URL}/api/content/duas/categories", timeout=15)
    assert r.status_code == 200
    body = r.json()
    cats = body.get("categories", [])
    ids = {c["id"] for c in cats}
    expected = {"eid", "qurbani", "morning", "evening", "eating", "traveling"}
    assert expected.issubset(ids), f"Missing categories: {expected - ids}"
    assert len(cats) == 6


# ---------------- Content: Duas by valid category ----------------
def test_duas_eid_category(s):
    r = s.get(f"{BASE_URL}/api/content/duas", params={"category": "eid"}, timeout=15)
    assert r.status_code == 200
    body = r.json()
    assert body.get("category") == "eid"
    assert isinstance(body.get("duas"), list) and len(body["duas"]) > 0
    d = body["duas"][0]
    for key in ("arabic", "english", "urdu", "reference"):
        assert key in d


# ---------------- Content: Duas with invalid category ----------------
def test_duas_invalid_category(s):
    r = s.get(f"{BASE_URL}/api/content/duas", params={"category": "invalid"}, timeout=15)
    assert r.status_code == 404


# ---------------- Content: Daily hadith ----------------
def test_daily_hadith(s):
    r = s.get(f"{BASE_URL}/api/content/daily-hadith", timeout=15)
    assert r.status_code == 200
    body = r.json()
    for key in ("arabic", "english", "urdu", "reference"):
        assert key in body and body[key]


# ---------------- Content: Eid info ----------------
def test_eid_info(s):
    r = s.get(f"{BASE_URL}/api/content/eid-info", timeout=15)
    assert r.status_code == 200
    body = r.json()
    assert "next_eid_date" in body
    assert "days_left" in body
    assert body["next_eid_date"] is not None
    assert isinstance(body["days_left"], int)
    assert body["days_left"] >= 0


# ---------------- Prayer times ----------------
def test_prayer_times(s):
    r = s.get(f"{BASE_URL}/api/prayer-times",
              params={"lat": 24.4539, "lng": 54.3773}, timeout=20)
    assert r.status_code == 200, r.text
    body = r.json()
    timings = body.get("timings", {})
    for k in ("Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"):
        assert timings.get(k), f"Missing prayer timing {k}"
    hijri = body.get("hijri", {})
    assert hijri.get("date") and hijri.get("month") and hijri.get("year")


# ---------------- Qibla ----------------
def test_qibla(s):
    r = s.get(f"{BASE_URL}/api/qibla",
              params={"lat": 24.4539, "lng": 54.3773}, timeout=20)
    assert r.status_code == 200, r.text
    body = r.json()
    assert isinstance(body.get("direction"), (int, float))
    assert 0 <= body["direction"] <= 360
