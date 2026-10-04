# Network Latency & Packet-Loss Chaos Emulator

A Linux-based C++ command-line application for simulating network
conditions such as latency, packet loss, and jitter.

## Objective

The project is designed to demonstrate how network conditions can
be intentionally modified for testing and experimentation.

## Features

- Show network interfaces
- Set latency
- Set packet loss
- Set jitter
- Show network status
- Reset network configuration

## Technology Stack

- C++
- Linux / Ubuntu
- Linux Traffic Control (tc)
- NetEm
- Git
- VS Code

## Architecture

C++ Application
        |
        v
Linux tc
        |
        v
NetEm
        |
        v
Network Interface

## Build

```bash
make