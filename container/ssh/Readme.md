https://docs.docker.com/engine/examples/running_ssh_service/

### usage instructions

* ```docker build -t ssh_img .```
* ```docker run -d -P ssh_img```
* ```docker ps``` to check the status
* ```ssh 127.0.0.1 -p <port> -l root``` .pass: screencast
* ```env| grep VISIBLE``` to check that the variable is set
