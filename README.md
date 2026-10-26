# Network Chaos Emulator

A Linux-based network testing tool for simulating adverse network conditions such as **latency, packet loss, and jitter** using Linux Traffic Control (`tc`) and NetEm.

The project provides a web dashboard built with **React and Vite**, a **FastAPI REST backend**, and a restricted privileged helper that safely applies NetEm configurations to a Linux network interface.

> **Educational project:** Designed for learning Linux networking, traffic control, REST APIs, frontend/backend integration, and network testing.

---

## Overview

Applications often need to operate reliably under poor or unstable network conditions. Testing these situations manually can be difficult.

Network Chaos Emulator allows developers to intentionally introduce network impairments and observe how applications behave.

The emulator currently supports:

- Network latency
- Packet loss
- Network jitter
- Network interface discovery
- Real-time Traffic Control (`tc`) status
- Applying network configurations from a web dashboard
- Resetting network configuration
- Activity history in the dashboard
- Linux NetEm integration
- Restricted privileged access for network changes

---

## Architecture

```text
                    Web Browser
                         |
                         v
              React + Vite Dashboard
                         |
                    REST / HTTP
                         |
                         v
                  FastAPI Backend
                         |
                 Input Validation
                         |
                         v
             Restricted sudo helper
                         |
                         v
                Linux tc / NetEm
                         |
                         v
                  Network Interface
                         |
                         v
                       eth0
```

### Components

| Component | Purpose |
|---|---|
| React | Web dashboard |
| Vite | Frontend development server |
| FastAPI | REST API backend |
| Pydantic | Request validation |
| Linux `tc` | Traffic-control configuration |
| NetEm | Network impairment simulation |
| `ip` | Network interface discovery |
| C++ | Original CLI component / learning implementation |
| Git / GitHub | Version control |

---

## Features

### 1. Network Interface Discovery

The backend automatically discovers available Linux network interfaces using:

```bash
ip -o link show
```

The dashboard then allows the user to select an available interface.

---

### 2. Latency Simulation

Artificial network delay can be applied using NetEm.

Example:

```bash
sudo tc qdisc replace dev eth0 root netem delay 50ms
```

The dashboard supports latency values from:

```text
0–500 ms
```

---

### 3. Packet Loss Simulation

Packet loss can be introduced using NetEm.

Example:

```bash
sudo tc qdisc replace dev eth0 root netem loss 5%
```

The dashboard supports packet-loss values from:

```text
0–100%
```

---

### 4. Jitter Simulation

Jitter introduces variation in network delay.

Example:

```bash
sudo tc qdisc replace dev eth0 root netem delay 50ms 10ms
```

The dashboard supports jitter values from:

```text
0–100 ms
```

---

### 5. Combined Network Impairments

Latency, packet loss, and jitter can be applied together.

For example:

```text
Latency:     50 ms
Packet loss: 5%
Jitter:      10 ms
```

This results in a NetEm configuration similar to:

```text
qdisc netem ... delay 50ms 10ms loss 5%
```

---

### 6. Network Status

The dashboard retrieves the current Linux Traffic Control configuration using:

```bash
tc qdisc show dev eth0
```

For example, when NetEm is active:

```text
qdisc netem ... delay 50ms 10ms loss 5%
```

When the network has been reset, the normal queue discipline is displayed.

---

### 7. Network Reset

The dashboard provides a **Reset Network** button.

The reset operation removes the active NetEm configuration:

```bash
tc qdisc del dev eth0 root
```

This should be performed after testing to return the interface to its normal configuration.

---

### 8. Activity History

The dashboard records successful actions during the current browser session, including:

- Applied network configuration
- Reset network configuration
- Configuration values
- Timestamp

The activity history is currently stored in frontend memory and is cleared when the page is refreshed.

---

## Web Dashboard

The dashboard provides three main sections:

### Dashboard

Displays:

- Selected network interface
- Current latency
- Packet loss
- Jitter
- Current `tc` configuration
- API connection status

### Network Controls

Provides controls for:

- Network interface
- Latency
- Packet loss
- Jitter
- Apply configuration
- Refresh status
- Reset network

### Activity

Displays successful actions performed during the current browser session.

---

## Project Structure

```text
network-chaos-emulator/
│
├── src/
│   ├── main.cpp
│   ├── network_interface.h
│   ├── network_interface.cpp
│   ├── latency.h
│   ├── latency.cpp
│   ├── packet_loss.h
│   ├── packet_loss.cpp
│   ├── jitter.h
│   ├── jitter.cpp
│   ├── network_status.h
│   └── network_status.cpp
│
├── web/
│   │
│   ├── backend/
│   │   ├── main.py
│   │   └── venv/
│   │
│   └── frontend/
│       ├── src/
│       │   ├── App.jsx
│       │   ├── App.css
│       │   └── main.jsx
│       │
│       ├── package.json
│       └── vite.config.js
│
├── docs/
│   ├── requirements.md
│   ├── architecture.md
│   ├── uml.md
│   └── testing.md
│
├── tests/
│   └── test_plan.md
│
├── Makefile
├── README.md
└── .gitignore
```

> The exact contents of `src/` and `docs/` may vary depending on the current version of the project.

---

# Requirements

## Operating System

The project is designed for:

- Ubuntu
- Ubuntu on WSL
- Linux systems with `tc` and NetEm support

The current development environment uses **Ubuntu on WSL**.

---

## Required Software

### Linux tools

```bash
ip
tc
sudo
```

### C++ development

```bash
g++
make
```

### Frontend

```bash
Node.js
npm
```

### Backend

```text
Python 3
pip
FastAPI
Uvicorn
Pydantic
```

---

# Installation

## 1. Clone the Repository

```bash
git clone https://github.com/Arkesh-27/network-chaos-emulator.git
cd network-chaos-emulator
```

---

## 2. Verify Linux Networking Tools

Check available interfaces:

```bash
ip link
```

Check Traffic Control:

```bash
which tc
```

Expected output should resemble:

```text
/usr/sbin/tc
```

Check the current configuration:

```bash
tc qdisc show dev eth0
```

---

# Backend Setup

Navigate to the backend:

```bash
cd web/backend
```

Create a Python virtual environment:

```bash
python3 -m venv venv
```

Activate it:

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install fastapi uvicorn pydantic
```

---

## Start the Backend

From:

```bash
cd ~/network-chaos-emulator/web/backend
```

run:

```bash
source venv/bin/activate
uvicorn main:app --reload
```

The API will be available at:

```text
http://127.0.0.1:8000
```

FastAPI documentation is available at:

```text
http://127.0.0.1:8000/docs
```

---

# Frontend Setup

Open another terminal.

Navigate to:

```bash
cd ~/network-chaos-emulator/web/frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The dashboard will normally be available at:

```text
http://localhost:5173
```

---

# Privileged NetEm Helper

Changing Linux network traffic-control settings requires elevated privileges.

Instead of giving the FastAPI application unrestricted `sudo` access, this project uses a **root-owned helper script**:

```text
/usr/local/sbin/network-chaos-netem
```

The helper provides restricted operations:

```text
status
apply
reset
```

It currently allows network emulation only on:

```text
eth0
```

The helper also validates latency, packet-loss, and jitter values before calling `tc`.

---

## Install the Helper

Create the helper at:

```bash
sudo nano /usr/local/sbin/network-chaos-netem
```

The helper should be owned by root:

```bash
sudo chown root:root /usr/local/sbin/network-chaos-netem
```

Set executable permissions:

```bash
sudo chmod 755 /usr/local/sbin/network-chaos-netem
```

Verify:

```bash
ls -l /usr/local/sbin/network-chaos-netem
```

The file should be owned by:

```text
root root
```

---

# Restricted sudo Configuration

The backend uses:

```bash
sudo -n
```

to execute the helper without interactive password prompts.

Create a sudoers configuration:

```bash
sudo visudo -f /etc/sudoers.d/network-chaos-netem
```

Add:

```text
student ALL=(root) NOPASSWD: /usr/local/sbin/network-chaos-netem
```

Replace `student` with the appropriate Linux username if necessary.

This grants passwordless sudo access **only to the specific NetEm helper**, rather than granting the application unrestricted root access.

Verify the configuration:

```bash
sudo -n /usr/local/sbin/network-chaos-netem status eth0
```

It should execute without asking for a password.

---

# Testing the Helper

Check the current status:

```bash
sudo -n /usr/local/sbin/network-chaos-netem status eth0
```

Apply a test configuration:

```bash
sudo -n /usr/local/sbin/network-chaos-netem apply eth0 50 5 10
```

Verify:

```bash
sudo -n /usr/local/sbin/network-chaos-netem status eth0
```

Expected output should contain something similar to:

```text
qdisc netem ... delay 50ms 10ms ... loss 5%
```

Reset:

```bash
sudo -n /usr/local/sbin/network-chaos-netem reset eth0
```

Verify again:

```bash
sudo -n /usr/local/sbin/network-chaos-netem status eth0
```

---

# Using the Web Dashboard

Start the backend:

```bash
cd ~/network-chaos-emulator/web/backend
source venv/bin/activate
uvicorn main:app --reload
```

Start the frontend in another terminal:

```bash
cd ~/network-chaos-emulator/web/frontend
npm run dev
```

Open:

```text
http://localhost:5173
```

---

## Example Test

Select:

```text
Interface: eth0
Latency: 50 ms
Packet loss: 5%
Jitter: 10 ms
```

Click:

```text
Apply configuration
```

The dashboard should report:

```text
Network configuration applied successfully
```

The status panel should show a NetEm qdisc similar to:

```text
qdisc netem ... delay 50ms 10ms loss 5%
```

After testing, click:

```text
Reset network
```

The status should return to the normal Linux queue discipline.

---

# REST API

The FastAPI backend provides the following main endpoints.

## Health Check

```http
GET /
```

Example response:

```json
{
  "message": "Network Chaos Emulator API is running"
}
```

---

## Get Interfaces

```http
GET /interfaces
```

Example:

```json
{
  "interfaces": [
    "lo",
    "eth0"
  ]
}
```

---

## Get Network Status

```http
GET /status/{interface}
```

Example:

```text
GET /status/eth0
```

---

## Apply Configuration

```http
POST /apply
```

Example request:

```json
{
  "interface": "eth0",
  "latency": 50,
  "packet_loss": 5,
  "jitter": 10
}
```

Example successful response:

```json
{
  "message": "Network configuration applied successfully",
  "interface": "eth0",
  "latency": 50,
  "packet_loss": 5,
  "jitter": 10,
  "output": ""
}
```

---

## Reset Configuration

```http
POST /reset?interface=eth0
```

Example response:

```json
{
  "message": "Network configuration reset successfully",
  "interface": "eth0"
}
```

---

# Validation and Security

The backend validates incoming network configuration values.

Current limits are:

| Parameter | Range |
|---|---:|
| Latency | 0–500 ms |
| Packet loss | 0–100% |
| Jitter | 0–100 ms |

Network interface names are also validated before being used.

The privileged helper adds another security boundary by:

- Using a fixed executable path
- Being owned by `root`
- Restricting the interface to `eth0`
- Restricting supported operations
- Validating numeric parameters
- Calling `/usr/sbin/tc` directly
- Avoiding unrestricted shell execution from the FastAPI application

---

# C++ CLI Component

The project also contains the original C++ command-line implementation.

Build it using:

```bash
make
```

or compile manually:

```bash
g++ -Wall -Wextra -std=c++17 \
src/main.cpp \
src/network_interface.cpp \
src/latency.cpp \
src/packet_loss.cpp \
src/jitter.cpp \
src/network_status.cpp \
-o chaos
```

Run:

```bash
./chaos
```

The CLI component provides a learning-oriented implementation for working with Linux networking commands.

---

# C++ CLI Menu

The original CLI provides functionality such as:

```text
=================================
     Network Chaos Emulator
=================================
1. Show Network Interfaces
2. Set Latency
3. Set Packet Loss
4. Set Jitter
5. Show Status
6. Reset Network
7. Exit
```

---

# Testing

Basic Linux tests can be performed with:

```bash
ip link
```

```bash
tc qdisc show dev eth0
```

```bash
ping -c 4 8.8.8.8
```

For controlled testing, apply a small impairment:

```text
Latency: 20 ms
Packet loss: 0%
Jitter: 5 ms
```

Verify:

```bash
tc qdisc show dev eth0
```

Then reset the interface:

```bash
sudo tc qdisc del dev eth0 root
```

---

# Test Scenarios

| Test | Expected Result |
|---|---|
| Discover interfaces | Available Linux interfaces are returned |
| Apply latency | NetEm reports configured delay |
| Apply packet loss | NetEm reports configured loss |
| Apply jitter | NetEm reports configured jitter |
| Apply combined configuration | All requested impairments are active |
| Read status | Current qdisc is returned |
| Reset network | NetEm configuration is removed |
| Invalid latency | Request is rejected |
| Invalid packet loss | Request is rejected |
| Invalid jitter | Request is rejected |
| Invalid interface | Request is rejected |
| Backend unavailable | Dashboard reports API connection failure |

---

# Learning Outcomes

## C++

- Functions
- Header/source separation
- Conditional statements
- Loops
- Switch statements
- String handling
- Input validation
- Modular programming
- System command execution

## Linux

- Linux network interfaces
- `ip`
- `tc`
- NetEm
- `ping`
- `sudo`
- Linux permissions
- Traffic control

## Networking

- Network latency
- Packet loss
- Jitter
- Network interfaces
- Traffic control
- Network emulation
- Network testing

## Web Development

- React
- Vite
- FastAPI
- REST APIs
- HTTP requests
- CORS
- API validation
- Frontend/backend integration

## Software Engineering

- Modular architecture
- Input validation
- Privilege separation
- Error handling
- Git
- GitHub
- Linux development
- WSL development

---

# Limitations

- The current privileged helper is restricted to `eth0`.
- Network configuration requires Linux/WSL support for `tc` and NetEm.
- The activity history is stored only in browser memory.
- The project currently targets a local development environment.
- Resetting the root qdisc removes the current root qdisc and may not preserve a custom pre-existing qdisc configuration.
- The current web dashboard is primarily intended for local network testing.
- The project has not been designed as a production network-management service.

---

# Future Improvements

Potential improvements include:

- Support additional network interfaces
- Combine multiple network profiles
- Add bandwidth throttling
- Add network configuration presets
- Add persistent activity history
- Add automated backend tests
- Add frontend tests
- Add real-time network statistics
- Add configuration import/export
- Add Docker-based development setup
- Improve qdisc restoration
- Add authentication and authorization
- Add audit logging
- Improve cross-platform support
- Expand the C++ CLI implementation
- Add automated CI/CD with GitHub Actions

---

# Safety

This project modifies network traffic-control settings on a Linux network interface.

Use it only on systems and network interfaces that you are authorized to modify.

Network impairments can affect connectivity and running applications.

Always reset the network configuration after testing:

```bash
sudo -n /usr/local/sbin/network-chaos-netem reset eth0
```

or, when appropriate:

```bash
sudo tc qdisc del dev eth0 root
```

---

# GitHub

Repository:

[github.com/Arkesh-27/network-chaos-emulator](https://github.com/Arkesh-27/network-chaos-emulator?utm_source=chatgpt.com)

---

# Author

**Arkesh**

---

# License

This project is created for educational and learning purposes.
