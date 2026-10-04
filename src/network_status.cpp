#include <iostream>
#include <cstdlib>
#include <string>
#include "network_status.h"

void showStatus() {
    std::string interfaceName;

    std::cout << "\nEnter network interface: ";
    std::cin >> interfaceName;

    std::cout << "\nCurrent configuration for "
              << interfaceName
              << ":\n\n";

    std::string command =
        "tc qdisc show dev " + interfaceName;

    int result = system(command.c_str());

    if (result != 0) {
        std::cout << "Failed to retrieve network status.\n";
    }
}