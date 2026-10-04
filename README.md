# Network Latency & Packet-Loss Chaos Emulator

A Linux-based C++ command-line application for simulating network conditions such as latency, packet loss, and jitter using Linux Traffic Control (`tc`) and NetEm.

## Project Overview

Network applications normally operate under changing network conditions. To test application behavior under poor network conditions, this project intentionally introduces network problems such as:

- High latency
- Packet loss
- Network jitter

The application provides a command-line interface that allows users to apply, monitor, and reset network conditions on a Linux network interface.

## Objectives

- Understand Linux network interfaces
- Understand Linux Traffic Control (`tc`)
- Learn how NetEm simulates network conditions
- Implement a C++ command-line application
- Simulate network latency, packet loss, and jitter
- Monitor network configuration
- Reset network configuration after testing
- Practice modular C++ programming
- Use Git and GitHub for version control

## Features

### 1. Show Network Interfaces

Displays available Linux network interfaces using the `ip link` command.

### 2. Set Network Latency

Allows the user to introduce artificial network delay using Linux NetEm.

Example command:

    sudo tc qdisc replace dev eth0 root netem delay 100ms

### 3. Set Packet Loss

Allows the user to simulate packet loss.

Example command:

    sudo tc qdisc replace dev eth0 root netem loss 10%

### 4. Set Network Jitter

Allows the user to introduce variation in network delay.

Example command:

    sudo tc qdisc replace dev eth0 root netem delay 100ms 20ms

### 5. Show Network Status

Displays the current Traffic Control configuration.

    tc qdisc show dev eth0

### 6. Reset Network

Removes the custom Traffic Control configuration.

    sudo tc qdisc del dev eth0 root

## Application Menu

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

## Technology Stack

- C++
- Linux / Ubuntu
- WSL
- Linux Traffic Control (`tc`)
- NetEm
- Git
- GitHub
- VS Code

## Project Structure

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
    ├── tests/
    │   └── test_plan.md
    │
    ├── docs/
    │   ├── requirements.md
    │   ├── architecture.md
    │   ├── uml.md
    │   └── testing.md
    │
    ├── README.md
    ├── Makefile
    └── .gitignore

## System Architecture

    User
      |
      v
    C++ Command Line Application
      |
      +-------------------------+
      |            |            |
      v            v            v
    Latency    Packet Loss     Jitter
      |            |            |
      +------------+------------+
                   |
                   v
          Linux Traffic Control
                   |
                   v
                 NetEm
                   |
                   v
          Network Interface

## Requirements

The following software is required:

- Ubuntu / WSL
- g++
- Git
- Linux `ip` command
- Linux `tc` command

Check the compiler:

    g++ --version

Check Git:

    git --version

Check network interfaces:

    ip link

Check Traffic Control:

    tc --version

## Build the Project

Navigate to the project directory:

    cd ~/network-chaos-emulator

Build using the Makefile:

    make

Alternatively, compile manually:

    g++ -Wall -Wextra -std=c++17 \
    src/main.cpp \
    src/network_interface.cpp \
    src/latency.cpp \
    src/packet_loss.cpp \
    src/jitter.cpp \
    src/network_status.cpp \
    -o chaos

## Run the Project

    ./chaos

## Example Usage

### Set Latency

Select option:

    2

Enter the interface:

    eth0

Enter latency:

    100

The application applies 100 ms latency.

Verify the configuration:

    tc qdisc show dev eth0

### Set Packet Loss

Select option:

    3

Enter:

    eth0
    10

This configures 10% packet loss.

Test the network:

    ping -c 20 8.8.8.8

### Set Jitter

Select option:

    4

Enter:

    eth0
    100
    20

This configures:

- Base delay: 100 ms
- Jitter: 20 ms

### Show Status

Select option:

    5

The application displays the current Traffic Control configuration.

### Reset Network

Select option:

    6

Enter:

    eth0

The custom network configuration is removed.

You can also reset manually:

    sudo tc qdisc del dev eth0 root

## Testing

The project can be tested using the following Linux commands:

    ip link

    tc qdisc show dev eth0

    ping -c 4 8.8.8.8

Testing covers:

- Network interface detection
- Latency configuration
- Packet loss configuration
- Jitter configuration
- Network status
- Network reset

## Learning Outcomes

### C++ Concepts

- Functions
- Header files
- Source files
- Conditional statements
- Loops
- Switch statements
- String handling
- Input validation
- Modular programming
- System command execution

### Linux Concepts

- Linux terminal
- Network interfaces
- Linux commands
- `ip`
- `tc`
- `ping`
- `sudo`
- File and directory management

### Networking Concepts

- Network latency
- Packet loss
- Jitter
- Network interfaces
- Traffic control
- Network testing

### Software Development

- Modular project structure
- Requirements documentation
- System architecture
- Testing
- Git version control
- GitHub repository management

## Limitations

- The current version is a command-line application.
- It uses Linux system commands to configure network conditions.
- The project is primarily designed for Linux and WSL environments.
- A new root NetEm configuration can replace an existing configuration.

## Future Improvements

- Combine latency, packet loss, and jitter in one configuration
- Add bandwidth throttling
- Add network configuration profiles
- Add configuration history
- Improve input validation
- Add automated unit tests
- Add a graphical user interface
- Add real-time network statistics
- Add configuration export and import
- Improve security by avoiding direct shell command execution

## Safety Note

This project modifies network traffic-control settings on a Linux network interface.

Use it only on systems and network interfaces that you are authorized to modify.

After testing, reset the network configuration:

    sudo tc qdisc del dev eth0 root

## Author

**Arkesh**

GitHub Repository:

https://github.com/Arkesh-27/network-chaos-emulator

## License

This project is created for educational and learning purposes.
