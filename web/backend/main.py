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


HELPER = "/usr/local/sbin/network-chaos-netem"


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
        [HELPER, "status", interface],
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

    # The privileged helper currently allows only eth0.
    if config.interface != "eth0":
        raise HTTPException(
            status_code=400,
            detail="Only eth0 is currently supported for network emulation",
        )

    result = subprocess.run(
        [
            "sudo",
            "-n",
            HELPER,
            "apply",
            config.interface,
            str(config.latency),
            str(config.packet_loss),
            str(config.jitter),
        ],
        capture_output=True,
        text=True,
        timeout=10,
    )

    if result.returncode != 0:
        detail = result.stderr.strip() or "Failed to apply network configuration"

        if "interactive authentication" in detail.lower():
            detail = (
                "Privileged network authorization is not configured yet. "
                "Configure restricted sudo access for the NetEm helper."
            )

        raise HTTPException(
            status_code=500,
            detail=detail,
        )

    return {
        "message": "Network configuration applied successfully",
        "interface": config.interface,
        "latency": config.latency,
        "packet_loss": config.packet_loss,
        "jitter": config.jitter,
        "output": result.stdout.strip(),
    }


@app.post("/reset")
def reset_network(interface: str = "eth0"):
    validate_interface(interface)

    if interface != "eth0":
        raise HTTPException(
            status_code=400,
            detail="Only eth0 is currently supported for network emulation",
        )

    result = subprocess.run(
        [
            "sudo",
            "-n",
            HELPER,
            "reset",
            interface,
        ],
        capture_output=True,
        text=True,
        timeout=10,
    )

    if result.returncode != 0:
        detail = result.stderr.strip() or "Failed to reset network configuration"

        if "interactive authentication" in detail.lower():
            detail = (
                "Privileged network authorization is not configured yet. "
                "Configure restricted sudo access for the NetEm helper."
            )

        raise HTTPException(
            status_code=500,
            detail=detail,
        )

    return {
        "message": "Network configuration reset successfully",
        "interface": interface,
    }