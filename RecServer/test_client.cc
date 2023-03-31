// #include <iostream>
#include <fstream>
#include <string.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <iostream>
using namespace std;

#define PORT 3030

int main(int argc, char **argv)
{
    int socket_fd, readStatus;
    struct sockaddr_in server_addr;
    socklen_t server_len;
    char msg[] = "Hello!!!\n";
    char buff[1024] = {0};

    // create a socket
    if ((socket_fd = socket(AF_INET, SOCK_DGRAM, 0)) < 0)
    {
        perror("socket creation error...\n");
        exit(-1);
    }

    // server socket address
    server_addr.sin_family = AF_INET;
    server_addr.sin_port = htons(PORT);
    server_addr.sin_addr.s_addr = inet_addr("127.0.0.1");

    if (sendto(socket_fd, msg, strlen(msg), 0, (struct sockaddr *)&server_addr, sizeof(server_addr)) < 0)
    {
        perror("sending error...\n");
        close(socket_fd);
        exit(-1);
    }

    server_len = sizeof(server_addr);
    readStatus = recvfrom(socket_fd, buff, 1024, 0, (struct sockaddr *)&server_addr, &server_len);
    if (readStatus < 0)
    {
        perror("reading error...\n");
        close(socket_fd);
        exit(-1);
    }

    cout << buff << endl
         << readStatus;
    cout << endl;

    close(socket_fd);
    return 0;
}

