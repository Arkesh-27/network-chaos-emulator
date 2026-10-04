#include <iostream>
#include <cstdlib>
#include <string>
#include "latency.h"

void setLatency() {
    std::string interfaceName;
    int latency;

    std::cout << "\nEnter network interface: ";
    std::cin >> interfaceName;

    std::cout << "Enter latency in milliseconds: ";
    std::cin >> latency;

    if (std::cin.fail()) {
        std::cin.clear();
        std::cin.ignore(10000, '\n');
        std::cout << "Invalid latency value.\n";
        return;
    }

    if (latency < 0) {
        std::cout << "Latency cannot be negative.\n";
        return;
    }

    std::string command =
        "sudo tc qdisc replace dev " +
        interfaceName +
        " root netem delay " +
        std::to_string(latency) +
        "ms";

    int result = system(command.c_str());

    if (result == 0) {
        std::cout << "\nLatency of "
                  << latency
                  << " ms applied to "
                  << interfaceName
                  << ".\n";
    } else {
        std::cout << "\nFailed to apply latency.\n";
    }
}