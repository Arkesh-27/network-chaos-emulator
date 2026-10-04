#include <iostream>
#include <cstdlib>
#include <string>
#include "reset.h"

void resetNetwork() {
    std::string interfaceName;

    std::cout << "\nEnter network interface: ";
    std::cin >> interfaceName;

    std::string command =
        "sudo tc qdisc del dev " +
        interfaceName +
        " root";

    int result = system(command.c_str());

    if (result == 0) {
        std::cout << "\nNetwork configuration reset successfully on "
                  << interfaceName << ".\n";
    } else {
        std::cout << "\nFailed to reset network configuration.\n";
        std::cout << "The interface may already be using its default configuration.\n";
    }
}
