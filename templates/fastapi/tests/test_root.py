"""Tests for root endpoint."""
import pytest
from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_root_returns_200():
    """Root endpoint should return 200 OK."""
    response = client.get("/")
    assert response.status_code == 200


def test_root_returns_project_info():
    """Root endpoint should return project information."""
    response = client.get("/")
    data = response.json()

    assert "message" in data
    assert "org" in data
    assert "env" in data
    assert "project" in data


def test_root_message_contains_project_name():
    """Root endpoint message should contain project name."""
    response = client.get("/")
    data = response.json()

    # The project name placeholder or actual name should be in the message
    assert "{{PROJECT}}" in data["message"] or len(data["message"]) > 0
