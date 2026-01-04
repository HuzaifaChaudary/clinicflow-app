"""
WebSocket API

Real-time communication for live updates.
"""

import json
from typing import Dict, Set
from uuid import UUID
from datetime import datetime

from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.core.security import verify_access_token
from app.core.exceptions import AuthenticationError


router = APIRouter(tags=["WebSocket"])


class ConnectionManager:
    """
    Manages WebSocket connections.
    
    Organizes connections by clinic_id to broadcast
    updates only to relevant users.
    """
    
    def __init__(self):
        # clinic_id -> set of websocket connections
        self.active_connections: Dict[str, Set[WebSocket]] = {}
        # websocket -> user info
        self.connection_info: Dict[WebSocket, dict] = {}
    
    async def connect(self, websocket: WebSocket, clinic_id: str, user_id: str, role: str):
        """Accept and register a new connection."""
        await websocket.accept()
        
        if clinic_id not in self.active_connections:
            self.active_connections[clinic_id] = set()
        
        self.active_connections[clinic_id].add(websocket)
        self.connection_info[websocket] = {
            "clinic_id": clinic_id,
            "user_id": user_id,
            "role": role,
            "connected_at": datetime.utcnow().isoformat(),
        }
    
    def disconnect(self, websocket: WebSocket):
        """Remove a connection."""
        if websocket in self.connection_info:
            clinic_id = self.connection_info[websocket]["clinic_id"]
            if clinic_id in self.active_connections:
                self.active_connections[clinic_id].discard(websocket)
                if not self.active_connections[clinic_id]:
                    del self.active_connections[clinic_id]
            del self.connection_info[websocket]
    
    async def broadcast_to_clinic(self, clinic_id: str, message: dict):
        """Broadcast a message to all connections in a clinic."""
        if clinic_id in self.active_connections:
            disconnected = []
            for connection in self.active_connections[clinic_id]:
                try:
                    await connection.send_json(message)
                except Exception:
                    disconnected.append(connection)
            
            # Clean up disconnected
            for conn in disconnected:
                self.disconnect(conn)
    
    async def send_to_user(self, user_id: str, message: dict):
        """Send a message to a specific user."""
        for websocket, info in self.connection_info.items():
            if info["user_id"] == user_id:
                try:
                    await websocket.send_json(message)
                except Exception:
                    self.disconnect(websocket)
    
    async def send_to_role(self, clinic_id: str, role: str, message: dict):
        """Send a message to all users with a specific role in a clinic."""
        if clinic_id in self.active_connections:
            for websocket in self.active_connections[clinic_id]:
                if self.connection_info[websocket]["role"] == role:
                    try:
                        await websocket.send_json(message)
                    except Exception:
                        pass
    
    def get_connection_count(self, clinic_id: str = None) -> int:
        """Get the number of active connections."""
        if clinic_id:
            return len(self.active_connections.get(clinic_id, set()))
        return sum(len(conns) for conns in self.active_connections.values())


# Global connection manager
manager = ConnectionManager()


@router.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket,
    token: str = Query(..., description="JWT access token"),
):
    """
    WebSocket endpoint for real-time updates.
    
    Connect with: ws://host/ws?token=<jwt_token>
    
    Message types received:
    - appointment_created: New appointment created
    - appointment_updated: Appointment status changed
    - appointment_cancelled: Appointment cancelled
    - patient_checked_in: Patient checked in
    - intake_submitted: Intake form submitted
    - needs_attention: New item needs attention
    
    Message format:
    {
        "type": "appointment_updated",
        "data": {...},
        "timestamp": "2024-01-01T12:00:00Z"
    }
    """
    # Verify token
    try:
        payload = verify_access_token(token)
        user_id = payload.get("sub")
        clinic_id = payload.get("clinic_id")
        role = payload.get("role")
        
        if not all([user_id, clinic_id, role]):
            await websocket.close(code=4001, reason="Invalid token payload")
            return
        
    except AuthenticationError as e:
        await websocket.close(code=4001, reason=str(e))
        return
    
    # Connect
    await manager.connect(websocket, clinic_id, user_id, role)
    
    try:
        # Send connection confirmation
        await websocket.send_json({
            "type": "connected",
            "data": {
                "user_id": user_id,
                "clinic_id": clinic_id,
                "role": role,
            },
            "timestamp": datetime.utcnow().isoformat(),
        })
        
        # Keep connection alive and handle incoming messages
        while True:
            try:
                data = await websocket.receive_text()
                message = json.loads(data)
                
                # Handle ping/pong for keepalive
                if message.get("type") == "ping":
                    await websocket.send_json({
                        "type": "pong",
                        "timestamp": datetime.utcnow().isoformat(),
                    })
                
                # Handle subscription to specific events
                elif message.get("type") == "subscribe":
                    # Could implement topic-based subscriptions here
                    await websocket.send_json({
                        "type": "subscribed",
                        "data": message.get("topics", []),
                        "timestamp": datetime.utcnow().isoformat(),
                    })
                
            except json.JSONDecodeError:
                await websocket.send_json({
                    "type": "error",
                    "data": {"message": "Invalid JSON"},
                    "timestamp": datetime.utcnow().isoformat(),
                })
    
    except WebSocketDisconnect:
        manager.disconnect(websocket)


# Helper functions for broadcasting events


async def broadcast_appointment_created(clinic_id: str, appointment_data: dict):
    """Broadcast when a new appointment is created."""
    await manager.broadcast_to_clinic(clinic_id, {
        "type": "appointment_created",
        "data": appointment_data,
        "timestamp": datetime.utcnow().isoformat(),
    })


async def broadcast_appointment_updated(clinic_id: str, appointment_data: dict):
    """Broadcast when an appointment is updated."""
    await manager.broadcast_to_clinic(clinic_id, {
        "type": "appointment_updated",
        "data": appointment_data,
        "timestamp": datetime.utcnow().isoformat(),
    })


async def broadcast_appointment_cancelled(clinic_id: str, appointment_data: dict):
    """Broadcast when an appointment is cancelled."""
    await manager.broadcast_to_clinic(clinic_id, {
        "type": "appointment_cancelled",
        "data": appointment_data,
        "timestamp": datetime.utcnow().isoformat(),
    })


async def broadcast_patient_checked_in(clinic_id: str, checkin_data: dict):
    """Broadcast when a patient checks in."""
    await manager.broadcast_to_clinic(clinic_id, {
        "type": "patient_checked_in",
        "data": checkin_data,
        "timestamp": datetime.utcnow().isoformat(),
    })


async def broadcast_intake_submitted(clinic_id: str, intake_data: dict):
    """Broadcast when an intake form is submitted."""
    await manager.broadcast_to_clinic(clinic_id, {
        "type": "intake_submitted",
        "data": intake_data,
        "timestamp": datetime.utcnow().isoformat(),
    })


async def notify_needs_attention(clinic_id: str, attention_data: dict, roles: list = None):
    """Notify about items needing attention."""
    message = {
        "type": "needs_attention",
        "data": attention_data,
        "timestamp": datetime.utcnow().isoformat(),
    }
    
    if roles:
        for role in roles:
            await manager.send_to_role(clinic_id, role, message)
    else:
        await manager.broadcast_to_clinic(clinic_id, message)


# Export manager for use in other modules
def get_ws_manager() -> ConnectionManager:
    """Get the WebSocket connection manager."""
    return manager
