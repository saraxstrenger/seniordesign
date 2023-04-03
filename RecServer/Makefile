TARGETS = bin/rec_server bin/test_client

SERVER = rec_server.o
CLIENT = test_client.o

OBJS = $(SERVER) $(CLIENT)
all: $(TARGETS)

%.o: %.cc
	g++ $^ --std=c++11 -g -c -o $@

rec_server: $(SERVER) 
	g++ $^ --std=c++11 -lresolv -lpthread -g -o bin/$@

test_client: $(CLIENT)
	g++ $^ --std=c++11 -lresolv -lpthread -g -o bin/$@

clean::
	rm -fv $(TARGETS) *~ $(OBJS)
