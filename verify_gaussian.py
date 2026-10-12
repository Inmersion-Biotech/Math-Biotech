"""Optional visual smoke check for the local Math-Biotech development server."""

import os
from pathlib import Path

from playwright.sync_api import Page, expect, sync_playwright

APP_URL = os.environ.get("MATH_BIOTECH_URL", "http://localhost:5173/")
ARTIFACTS = Path(__file__).resolve().parent / "artifacts"


def verify_gaussian_view(page: Page) -> None:
    ARTIFACTS.mkdir(parents=True, exist_ok=True)
    page.goto(APP_URL, wait_until="domcontentloaded")
    page.get_by_text("Matrix", exact=True).first.click()
    page.get_by_role("button", name="Gaussian Elimination").click()
    expect(page.get_by_role("heading", name="Gaussian Elimination")).to_be_visible()
    page.screenshot(path=str(ARTIFACTS / "gaussian-view.png"), full_page=True)


if __name__ == "__main__":
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_gaussian_view(page)
        except Exception:
            ARTIFACTS.mkdir(parents=True, exist_ok=True)
            page.screenshot(path=str(ARTIFACTS / "gaussian-error.png"), full_page=True)
            raise
        finally:
            browser.close()