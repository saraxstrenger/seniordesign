#include <queue>
#include <set>
#include <netinet/in.h>
#include <string>
using namespace std;
class RecServer
{

private:
    queue<string> waiting_requests; // capacity = 200
    set<pid_t> active_children;      // capacity = 100
    int socket_fd;
    bool terminateEventLoop;
    struct sockaddr_in server_addr;

public:
    RecServer();
    ~RecServer();
    void runEventLoop();
private:
    int createAndBindSocket(int port);
    void processNextRequest();
    void cleanUpChildren();
    void runScript(const char * user);
};
