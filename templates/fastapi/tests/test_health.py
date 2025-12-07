"""Tests for health check endpoints."""
import pytest
from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_health_returns_200():
    """Health endpoint should return 200 OK."""
    response = client.get("/health")
    assert response.status_code == 200


def test_health_returns_healthy_status():
    """Health endpoint should return healthy status."""
    response = client.get("/health")
    data = response.json()
    assert data["status"] == "healthy"


def test_health_includes_environment():
    """Health endpoint should include environment."""
    response = client.get("/health")
    data = response.json()
    assert "environment" in data


def test_ready_returns_200():
    """Ready endpoint should return 200 OK."""
    response = client.get("/ready")
    assert response.status_code == 200


def test_ready_returns_ready_status():
    """Ready endpoint should return ready status."""
    response = client.get("/ready")
    data = response.json()
    assert data["status"] == "ready"
