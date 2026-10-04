# Testing and Results

## Environment

Operating System:
Ubuntu running through WSL

Compiler:
g++

Network Interface:
eth0

## Latency Test

Configuration:

100 ms latency

Command used for verification:

tc qdisc show dev eth0

Network test:

ping -c 4 8.8.8.8

## Packet Loss Test

Configuration:

10% packet loss

Network test:

ping -c 20 8.8.8.8

## Jitter Test

Configuration:

100 ms base delay
20 ms jitter

## Reset Test

After testing:

sudo tc qdisc del dev eth0 root

Expected result:

Custom NetEm configuration is removed.