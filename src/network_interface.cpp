#include <iostream>
#include <cstdlib>
#include "network_interface.h"

void showInterfaces() {
    std::cout << "\nAvailable Network Interfaces:\n\n";

    int result = system("ip link");

    if (result != 0) {
        std::cout << "Failed to retrieve network interfaces.\n";
    }
}