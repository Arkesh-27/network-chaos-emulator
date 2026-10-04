#include <iostream>
#include <cstdlib>
#include <string>
#include "packet_loss.h"

void setPacketLoss() {
    std::string interfaceName;
    double loss;

    std::cout << "\nEnter network interface: ";
    std::cin >> interfaceName;

    std::cout << "Enter packet loss percentage: ";
    std::cin >> loss;

    if (std::cin.fail()) {
        std::cin.clear();
        std::cin.ignore(10000, '\n');
        std::cout << "Invalid packet loss value.\n";
        return;
    }

    if (loss < 0 || loss > 100) {
        std::cout << "Packet loss must be between 0 and 100.\n";
        return;
    }

    std::string command =
        "sudo tc qdisc replace dev " +
        interfaceName +
        " root netem loss " +
        std::to_string(loss) +
        "%";

    int result = system(command.c_str());

    if (result == 0) {
        std::cout << "\nPacket loss of "
                  << loss
                  << "% applied to "
                  << interfaceName
                  << ".\n";
    } else {
        std::cout << "\nFailed to apply packet loss.\n";
    }
}