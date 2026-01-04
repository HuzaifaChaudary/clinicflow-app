"""
Custom Exceptions

Application-specific exceptions for error handling.
"""

from typing import Any, Optional, Dict


class ClinicFlowException(Exception):
    """Base exception for ClinicFlow."""
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        self.message = message
        self.details = details or {}
        super().__init__(self.message)


class NotFoundError(ClinicFlowException):
    """Resource not found."""
    pass


class ValidationError(ClinicFlowException):
    """Validation error."""
    pass


class AuthenticationError(ClinicFlowException):
    """Authentication failed."""
    pass


class AuthorizationError(ClinicFlowException):
    """Authorization/permission denied."""
    pass


class TokenError(ClinicFlowException):
    """Token-related error."""
    pass


class TokenNotFoundError(TokenError):
    """Token not found."""
    def __init__(self):
        super().__init__("Token not found")


class TokenExpiredError(TokenError):
    """Token has expired."""
    def __init__(self):
        super().__init__("Token has expired")


class TokenAlreadyUsedError(TokenError):
    """Token has already been used."""
    def __init__(self):
        super().__init__("Token has already been used")


class ConflictError(ClinicFlowException):
    """Resource conflict (e.g., duplicate)."""
    pass


class SchedulingConflictError(ConflictError):
    """Scheduling conflict."""
    pass


class ExternalServiceError(ClinicFlowException):
    """Error from external service (e.g., OpenAI)."""
    pass
