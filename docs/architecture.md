# System Architecture

The application follows a modular architecture.

User
  |
  v
C++ Command Line Interface
  |
  +-- Network Interface Module
  |
  +-- Latency Module
  |
  +-- Packet Loss Module
  |
  +-- Jitter Module
  |
  +-- Network Status Module
  |
  v
Linux Traffic Control (tc)
  |
  v
NetEm
  |
  v
Network Interface