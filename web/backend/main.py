
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import re
import subprocess

app = FastAPI(title="Network Chaos Emulator API")

# Allow the local React frontend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


class NetworkConfig(BaseModel):
    interface: str = Field(min_length=1, max_length=15)
    latency: int = Field(default=0, ge=0, le=500)
    packet_loss: float = Field(default=0, ge=0, le=100)
    jitter: int = Field(default=0, ge=0, le=100)


def validate_interface(interface: str) -> str:
    # Linux interface names use a restricted character set.
    if not re.fullmatch(r"[A-Za-z0-9_.-]{1,15}", interface):
        raise HTTPException(
            status_code=400,
            detail="Invalid network interface name",
        )

    result = subprocess.run(
        ["ip", "-o", "link", "show", "dev", interface],
        capture_output=True,
        text=True,
        timeout=5,
    )

    if result.returncode != 0:
        raise HTTPException(
            status_code=404,
            detail=f"Network interface '{interface}' was not found",
        )

    return interface


@app.get("/")
def home():
    return {"message": "Network Chaos Emulator API is running"}


@app.get("/interfaces")
def get_interfaces():
    result = subprocess.run(
        ["ip", "-o", "link", "show"],
        capture_output=True,
        text=True,
        timeout=5,
    )

    if result.returncode != 0:
        raise HTTPException(
            status_code=500,
            detail="Could not read network interfaces",
        )

    interfaces = []

    for line in result.stdout.splitlines():
        parts = line.split(": ")

        if len(parts) >= 2:
            name = parts[1].split("@")[0]
            interfaces.append(name)

    return {"interfaces": interfaces}


@app.get("/status/{interface}")
def get_status(interface: str):
    validate_interface(interface)

    result = subprocess.run(
        ["tc", "qdisc", "show", "dev", interface],
        capture_output=True,
        text=True,
        timeout=5,
    )

    if result.returncode != 0:
        raise HTTPException(
            status_code=500,
            detail=result.stderr.strip() or "Could not read network status",
        )

    return {
        "interface": interface,
        "status": result.stdout,
    }


@app.post("/apply")
def apply_network_config(config: NetworkConfig):
    validate_interface(config.interface)

    # Validation is ready, but applying changes is intentionally disabled
    # until a restricted, non-interactive authorization mechanism is set up.
    raise HTTPException(
        status_code=501,
        detail=(
            "Network changes are not enabled yet. "
            "Configure restricted authorization for tc before applying settings."
        ),
    )
