from fastapi import FastAPI
from pydantic import BaseModel
import subprocess

app = FastAPI(title="Network Chaos Emulator API")


class NetworkConfig(BaseModel):
    interface: str
    latency: int = 0
    packet_loss: float = 0
    jitter: int = 0


@app.get("/")
def home():
    return {
        "message": "Network Chaos Emulator API is running"
    }


@app.get("/interfaces")
def get_interfaces():

    result = subprocess.run(
        ["ip", "-o", "link", "show"],
        capture_output=True,
        text=True
    )

    interfaces = []

    for line in result.stdout.splitlines():

        parts = line.split(": ")

        if len(parts) >= 2:
            interface = parts[1].split("@")[0]
            interfaces.append(interface)

    return {
        "interfaces": interfaces
    }


@app.get("/status/{interface}")
def get_status(interface: str):

    result = subprocess.run(
        ["tc", "qdisc", "show", "dev", interface],
        capture_output=True,
        text=True
    )

    return {
        "interface": interface,
        "status": result.stdout
    }


@app.post("/apply")
def apply_network_config(config: NetworkConfig):

    command = [
        "sudo",
        "tc",
        "qdisc",
        "replace",
        "dev",
        config.interface,
        "root",
        "netem"
    ]

    if config.latency > 0:
        command += ["delay", f"{config.latency}ms"]

        if config.jitter > 0:
            command += [f"{config.jitter}ms"]

    if config.packet_loss > 0:
        command += ["loss", f"{config.packet_loss}%"]

    result = subprocess.run(
        command,
        capture_output=True,
        text=True
    )

    return {
        "success": result.returncode == 0,
        "message": "Network configuration applied",
        "command": " ".join(command),
        "error": result.stderr
    }