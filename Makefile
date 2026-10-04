CXX = g++
CXXFLAGS = -Wall -Wextra -std=c++17

TARGET = chaos

SOURCES = \
	src/main.cpp \
	src/network_interface.cpp \
	src/latency.cpp \
	src/packet_loss.cpp \
	src/jitter.cpp \
	src/network_status.cpp \
	src/reset.cpp

all:
	$(CXX) $(CXXFLAGS) $(SOURCES) -o $(TARGET)

clean:
	rm -f $(TARGET)

run: all
	./$(TARGET)
