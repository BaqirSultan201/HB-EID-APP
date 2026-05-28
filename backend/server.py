from fastapi import FastAPI, APIRouter, HTTPException, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List, Optional
from datetime import datetime, timezone
import requests

from content_data import (
    SUNNAH_ITEMS,
    QURBANI_GUIDE,
    TAKBEER,
    DUA_CATEGORIES,
    DUAS_BY_CATEGORY,
    DAILY_HADITHS,
    EID_INFO,
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

# MongoDB (optional for MVP — used for favorites/tasbeeh in future)
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

app = FastAPI(title="HB Eid ul Adha API")
api_router = APIRouter(prefix="/api")


@api_router.get("/")
async def root():
    return {"message": "HB Eid ul Adha API", "status": "ok"}


# ---------------------- Content Endpoints ----------------------

@api_router.get("/content/sunnah")
async def get_sunnah_items():
    return {"items": SUNNAH_ITEMS}


@api_router.get("/content/sunnah/{item_id}")
async def get_sunnah_item(item_id: str):
    for item in SUNNAH_ITEMS:
        if item["id"] == item_id:
            return item
    raise HTTPException(status_code=404, detail="Sunnah item not found")


@api_router.get("/content/qurbani")
async def get_qurbani_guide():
    return QURBANI_GUIDE


@api_router.get("/content/takbeer")
async def get_takbeer():
    return TAKBEER


@api_router.get("/content/duas/categories")
async def get_dua_categories():
    return {"categories": DUA_CATEGORIES}


@api_router.get("/content/duas")
async def get_duas(category: Optional[str] = None):
    if category:
        duas = DUAS_BY_CATEGORY.get(category)
        if duas is None:
            raise HTTPException(status_code=404, detail="Category not found")
        return {"category": category, "duas": duas}
    # Return all
    flat: List[dict] = []
    for cat, duas in DUAS_BY_CATEGORY.items():
        for d in duas:
            flat.append({**d, "category": cat})
    return {"duas": flat}


@api_router.get("/content/daily-hadith")
async def get_daily_hadith():
    # Rotate based on day of year
    day = datetime.now(timezone.utc).timetuple().tm_yday
    idx = day % len(DAILY_HADITHS)
    return DAILY_HADITHS[idx]


@api_router.get("/content/eid-info")
async def get_eid_info():
    # Compute days until next Eid ul Adha (10 Dhul-Hijjah).
    # Use approximate Gregorian dates list configured in EID_INFO.
    today = datetime.now(timezone.utc).date()
    next_eid_iso = None
    for iso in EID_INFO["upcoming_dates"]:
        d = datetime.fromisoformat(iso).date()
        if d >= today:
            next_eid_iso = iso
            break
    days_left = None
    if next_eid_iso:
        d = datetime.fromisoformat(next_eid_iso).date()
        days_left = (d - today).days
    return {
        "next_eid_date": next_eid_iso,
        "days_left": days_left,
        "name": EID_INFO["name"],
        "tagline": EID_INFO["tagline"],
    }


# ---------------------- Aladhan API proxies ----------------------

@api_router.get("/prayer-times")
async def prayer_times(
    lat: float = Query(...),
    lng: float = Query(...),
    method: int = Query(2, description="Calculation method (default 2: ISNA)"),
):
    try:
        date_str = datetime.now(timezone.utc).strftime("%d-%m-%Y")
        url = f"https://api.aladhan.com/v1/timings/{date_str}"
        resp = requests.get(
            url,
            params={"latitude": lat, "longitude": lng, "method": method},
            timeout=10,
        )
        resp.raise_for_status()
        data = resp.json()
        timings = data.get("data", {}).get("timings", {})
        meta = data.get("data", {}).get("meta", {})
        hijri = data.get("data", {}).get("date", {}).get("hijri", {})
        return {
            "timings": {
                "Fajr": timings.get("Fajr"),
                "Sunrise": timings.get("Sunrise"),
                "Dhuhr": timings.get("Dhuhr"),
                "Asr": timings.get("Asr"),
                "Maghrib": timings.get("Maghrib"),
                "Isha": timings.get("Isha"),
            },
            "timezone": meta.get("timezone"),
            "hijri": {
                "date": hijri.get("date"),
                "day": hijri.get("day"),
                "month": (hijri.get("month") or {}).get("en"),
                "year": hijri.get("year"),
            },
        }
    except requests.RequestException as e:
        logger.error(f"Prayer times error: {e}")
        raise HTTPException(status_code=502, detail="Prayer times service unavailable")


@api_router.get("/qibla")
async def qibla(lat: float = Query(...), lng: float = Query(...)):
    try:
        url = f"https://api.aladhan.com/v1/qibla/{lat}/{lng}"
        resp = requests.get(url, timeout=10)
        resp.raise_for_status()
        data = resp.json()
        direction = data.get("data", {}).get("direction")
        return {"direction": direction, "lat": lat, "lng": lng}
    except requests.RequestException as e:
        logger.error(f"Qibla error: {e}")
        raise HTTPException(status_code=502, detail="Qibla service unavailable")


# ---------------------- App ----------------------

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
