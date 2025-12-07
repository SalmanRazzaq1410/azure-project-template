"""Pytest configuration and fixtures."""
import os

import pytest


@pytest.fixture(autouse=True)
def set_test_environment():
    """Set test environment variables."""
    os.environ["ENVIRONMENT"] = "test"
    yield
    # Cleanup if needed
