#include <iostream>
#include <cstdlib>
#include <string>
#include "jitter.h"

void setJitter() {
    std::string interfaceName;
    int delay;
    int jitter;

    std::cout << "\nEnter network interface: ";
    std::cin >> interfaceName;

    std::cout << "Enter base delay in milliseconds: ";
    std::cin >> delay;

    std::cout << "Enter jitter in milliseconds: ";
    std::cin >> jitter;

    if (std::cin.fail()) {
        std::cin.clear();
        std::cin.ignore(10000, '\n');
        std::cout << "Invalid value.\n";
        return;
    }

    if (delay < 0 || jitter < 0) {
        std::cout << "Delay and jitter cannot be negative.\n";
        return;
    }

    std::string command =
        "sudo tc qdisc replace dev " +
        interfaceName +
        " root netem delay " +
        std::to_string(delay) +
        "ms " +
        std::to_string(jitter) +
        "ms";

    int result = system(command.c_str());

    if (result == 0) {
        std::cout << "\nJitter configuration applied.\n";
        std::cout << "Interface: " << interfaceName << "\n";
        std::cout << "Base delay: " << delay << " ms\n";
        std::cout << "Jitter: " << jitter << " ms\n";
    } else {
        std::cout << "\nFailed to apply jitter.\n";
    }
}