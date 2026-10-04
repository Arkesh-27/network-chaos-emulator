# Test Plan

## Test 1: Network Interface

Input:
1

Expected:
Display available Linux network interfaces.

---

## Test 2: Latency

Input:
2
Interface: eth0
Latency: 100 ms

Expected:
100 ms latency is applied.

Verification:
tc qdisc show dev eth0

---

## Test 3: Packet Loss

Input:
3
Interface: eth0
Packet loss: 10%

Expected:
10% packet loss is configured.

Verification:
tc qdisc show dev eth0

---

## Test 4: Jitter

Input:
4
Interface: eth0
Delay: 100 ms
Jitter: 20 ms

Expected:
Variable network delay is configured.

---

## Test 5: Status

Input:
5
Interface: eth0

Expected:
Current qdisc configuration is displayed.

---

## Test 6: Reset

Input:
6
Interface: eth0

Expected:
Network configuration is removed.

Verification:
tc qdisc show dev eth0