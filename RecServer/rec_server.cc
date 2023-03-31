#include "rec_server.h"
#include <iostream>
#include <sys/wait.h>
#include <sys/socket.h>
#include <stdlib.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include "unistd.h"

#define PORT 3030
#define MAXLINE 1024
using namespace std;
int main(int argc, char **argv)
{

    RecServer recServer;
    recServer.runEventLoop();
    // cout << "Parent program terminating" << endl;
    return 0;
}

RecServer::RecServer() : terminateEventLoop(false)
{
    socket_fd = createAndBindSocket(PORT);
}

RecServer::~RecServer()
{
    close(socket_fd);
}

int RecServer::createAndBindSocket(int port)
{
    // Creating socket file descriptor
    socket_fd = socket(AF_INET, SOCK_DGRAM, 0);
    if (socket_fd < 0)
    {
        perror("unable to open socket");
        exit(EXIT_FAILURE);
    }
    int option = 1;
    if (setsockopt(socket_fd, SOL_SOCKET, SO_REUSEPORT, &option, sizeof(option)) < 0)
    {
        fprintf(stderr, "Unable to set socket option\n");
        return -1;
    }

    struct sockaddr_in servaddr;
    bzero(&servaddr, sizeof(servaddr));
    servaddr.sin_family = AF_INET;
    servaddr.sin_port = htons(PORT);
    servaddr.sin_addr.s_addr = INADDR_ANY;

    if (::bind(socket_fd, (struct sockaddr *)&servaddr, sizeof(servaddr)) < 0)
    {
        perror("unable to bind to port");
        close(socket_fd);
        exit(EXIT_FAILURE);
    }

    return socket_fd;
}

void RecServer::runEventLoop()
{
    while (!terminateEventLoop)
    {
        processNextRequest();
        cleanUpChildren();
    }
}

void RecServer::processNextRequest()
{

    struct sockaddr_in client_addr;
    socklen_t client_size = sizeof(client_addr);
    memset(&client_addr, 0, sizeof(client_addr));
    char *buffer = new char[MAXLINE];
    // int client_fd = accept(socket_fd, (struct sockaddr *)&client_addr, &client_size);

    // get next message
    int chars  = recvfrom(socket_fd, (char *)buffer,
                                 MAXLINE,
                                 0,
                                 (struct sockaddr *)&client_addr,
                                 &client_size);

    if (chars < 0)
    {
        return;
    }


    char * token = strtok(buffer, " ");

    if(strcmp(token, "recs") != 0)
    {
        return;
    }
    char * user = strtok(NULL, " ");
    if(strlen(user)<1) {
        return;
    }

    if (active_children.size() >= 100)
    {
        if (waiting_requests.size() < 300)
        {
            cout << "Too many child processes. adding [" << buffer << "] to queue" << endl;
            waiting_requests.emplace(buffer);
            return;
        }
        else
        {
            cout << "Too many queued processes. Dropping [" << buffer << "]" << endl;
            return;
        }
    }

    pid_t pid = fork();
    if (pid == 0)
    {
        printf("running rec script for: %s\n", user);
        std::string python = "python3";
        std::string pythonArg = "test.py";
        const char *pythonArgs[] = {python.c_str(), pythonArg.c_str(), user, NULL};
        execvp(python.c_str(), (char *const *)pythonArgs);
    }
    else
    {
        // server child maintainance
        active_children.insert(pid);
    }
}

void RecServer::cleanUpChildren()
{
    int status;

    pid_t pid;
    do
    {
        pid = waitpid(-1, &status, WNOHANG);
        if (pid > 0)
        {
            cout << "pid " << pid << " exited with status " << status << endl;
            active_children.erase(pid);
            if (waiting_requests.size() > 0)
            {
                const char *buffer = waiting_requests.front().c_str();
                waiting_requests.pop();
                pid_t pid = fork();
                if (pid == 0)
                {
                    printf("[C]: %s", buffer);
                    std::string python = "python3";
                    std::string pythonArg = "test.py";
                    const char *pythonArgs[] = {python.c_str(), pythonArg.c_str(), NULL};
                    execvp(python.c_str(), (char *const *)pythonArgs);
                }
                else
                {
                    // server child maintainance
                    active_children.insert(pid);
                }
            }
        }
    } while (pid > 0);
}