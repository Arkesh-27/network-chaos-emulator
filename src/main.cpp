#include <iostream>
#include <cstdlib>
#include <string>

#include "network_interface.h"
#include "latency.h"
#include "packet_loss.h"
#include "jitter.h"
#include "network_status.h"

// Reset network configuration
void resetNetwork() {
    std::string interfaceName;

    std::cout << "\nEnter network interface to reset: ";
    std::cin >> interfaceName;

    std::string command =
        "sudo tc qdisc del dev " +
        interfaceName +
        " root";

    int result = system(command.c_str());

    if (result == 0) {
        std::cout << "\nNetwork configuration reset successfully for "
                  << interfaceName << ".\n";
    } else {
        std::cout << "\nReset failed or no custom configuration exists.\n";
    }
}

int main() {

    int choice;

    do {
        std::cout << "\n================================\n";
        std::cout << "     Network Chaos Emulator\n";
        std::cout << "================================\n";

        std::cout << "1. Show Network Interfaces\n";
        std::cout << "2. Set Latency\n";
        std::cout << "3. Set Packet Loss\n";
        std::cout << "4. Set Jitter\n";
        std::cout << "5. Show Status\n";
        std::cout << "6. Reset Network\n";
        std::cout << "7. Exit\n";

        std::cout << "\nEnter your choice: ";
        std::cin >> choice;

        if (std::cin.fail()) {
            std::cin.clear();
            std::cin.ignore(10000, '\n');

            std::cout << "\nInvalid input. Enter a number from 1 to 7.\n";
            continue;
        }

        switch (choice) {

            case 1:
                showInterfaces();
                break;

            case 2:
                setLatency();
                break;

            case 3:
                setPacketLoss();
                break;

            case 4:
                setJitter();
                break;

            case 5:
                showStatus();
                break;

            case 6:
                resetNetwork();
                break;

            case 7:
                std::cout << "\nExiting Network Chaos Emulator...\n";
                break;

            default:
                std::cout << "\nInvalid choice. Please try again.\n";
        }

    } while (choice != 7);

    return 0;
}