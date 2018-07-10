# Docker basics


## Container vs VM
A container runs natively on Linux and shares the kernel of the host machine with other containers. It runs a discrete process, taking no more memory than any other executable, making it lightweight.
By contrast, a virtual machine (VM) runs a full-blown “guest” operating system with virtual access to host resources through a hypervisor. In general, VMs provide an environment with more resources than most applications need.

![containers] (https://i.stack.imgur.com/exIhw.png)

## Using Docker Containers

Containers are built from images. You can create containers from preexisting images hosted on the docker hub.

#### Images
* Public repo: https://hub.docker.com
* Build you own images with Dockerfile

Command | Description 
--------------|--------------
```docker images``` | list local images
```docker search ubuntu``` | searches the repo for images
```docker pull alpine``` | download image from https://hub.docker.com
```docker pull centos:6``` | use tag
```docker rmi <image_id>``` | remove image


#### Quickly  run a container
Command | Description 
--------------|--------------
```docker run -it alpine bash```	| run container interactive mode
```docker run -it centos:7 bash``` |	use tag
```docker run -d --name my-httpd -p 8080:80 httpd:2.4``` | run an apache server


#### Work with running containers
Command | Description 
--------------|--------------
```docker ps```	| see running containers
```docker port <container_id>```	| see port mapping for a container
```docker exec -it <container_id> bash``` | enter running container
```docker inspect <container_id>``` | container info, get ip address
```docker rm <container_id>``` | remove container
```crtl+p crtl+q``` | detach current container
```docker attach <container_id>``` | attach container  
```docker kill <container_id>``` | kill a running container


#### Using volumes 
Command | Description 
--------------|--------------
```docker run -it -v /tmp:/container_mount centos:7 bash``` | mount volume from host to container
```docker volume ls``` | show a list of volumes
```docker run -d --name my-httpd -p 8080:80 -v "$PWD":/usr/local/apache2/htdocs/ httpd:2.4``` | run an apache and serve files from current directory 


#### Linking containers
Command | Description 
--------------|--------------
```docker run -it -d --rm --name server1 ubuntu:14.04 bash -c "nc -lp 4444"``` | run a tcp server on port 4444 in a container
```docker run -it --rm --link server1 --name server2 ubuntu:14.04 bash``` | run a 2nd container and link it to the first. run 'nc server1 4444' on server2 to send data. use docker logs to see server1 output 


#### Cleanup containers/images/volumes

* Docker container files are located here: /var/lib/docker/containers. For every container there is a folder named like the container id, ex: c92aa805eb0127f4ef0f63bba3e10b6988ad3f2e2488ce14664778c2820d1558
* Image files are here: /var/lib/docker/image
* Volumes are here: /var/lib/docker/volumes

Command | Description 
--------------|--------------
```docker run -it --rm centos:7 bash``` | automatically remove container after exit. Check with: docker ps -a
```docker rm $(docker ps -a -q)``` | remove all stoppped containers
```docker rmi $(docker images -q)``` | remove all unsused images

#### Building Docker Images

* Use **container** folder from this repo for the below examples 

Command | Description 
--------------|--------------
```docker build -t node-app .``` | run this in the Dockerfile location to build a new img
```docker images``` | show all images
```docker images -a``` | show intermidiate images
```docker run -p 80:8080 node-app``` | run a container and map a host port to a container port. 8080 will be in the contaner, 80 will be on the host
```docker run -d -p 80:8080 node-app``` | run in detached mode

#### Dockerfile 

* Dockerfile is used to build a custom image
* Docker image is built up from a series of layers. Each layer represents an instruction in the image’s Dockerfile
* Every command in Dockerfile creates a intermediary image
* Docker skips the lines that have not changed since the last build

Command | Description 
--------------|--------------
FROM | Select base image
MAINTAINER | details about the author
RUN | Run commands at build time. ex: RUN unzip install.zip /tmp/
ADD | Adds files from host to container. Can be used to copy files from URL to container
COPY | Copies new files or directories from src to dest on the container
VOLUME | Adds a volume to the container. You can’t specify the host folder to be munted in a Dockerfile
ENV | Set a environment variable do beused during build time or in the final container
WORKDIR | Sets the working directory for the remainder of the Dockerfile and the final container. If the WORKDIR doesn’t exist, it will be created.
LABEL | Used to set metadata on an image. version,description,etc.. LABEL key=value
ARG | Defines a variable that users can pass at build-time to the builder with: docker build –-build-arg varname=value. Use it in Dokerfile with USER command like this: USER ${user:-some_user}
EXPOSE | It informs Docker that the container listens on the specified network ports at runtime.
USER | Sets the user name or UID when running command in the container
CMD | Command to be run in the container. It will be replaced by the command specified in docker build ... 
ENTRYPOINT | Like CMD, with 2 differences. You can’t overwrite it when running the conainer. Averything that is passed at the end of a docker run command will be used as an argument for the ENTRYPOINT command


Note: 
* Each entry of the above types in a Dockerfile will be an intermediate docker image. Use as few entries as possible with “&& " between commands. 
    * Example: RUN apt-get update && apt-get install -y apache2 
    * Example: RUN rm -rf /opt/node.json && rm -rf /opt/solo.rb && rm -rf /opt/environments/ &&  rm -rf /opt/roles/ && rm -rf /opt/cookbooks/

* find [here](https://docs.docker.com/engine/reference/builder/) the full reference for Dockerfile


Example:
```from node
WORKDIR /usr/src/app
ADD package*.json ./
ADD server.js ./
ADD chinook.db ./
RUN npm install
EXPOSE 8080
CMD [ "npm", "start" ]```


## Composer

* Compose is a tool for defining and running multi-container Docker applications
* steps
    * create docker-composer.yml
    * docker-composer up
* https://docs.docker.com/compose/compose-file/
* Use **compose** folder from this repo for the below examples 

Command | Description 
--------------|--------------
```docker-compose up``` | run stack defined in docker-compose.yml
```docker-compose up -d``` | run stack in detached mode
```docker-compose up -d node-app``` | run just node-app service
```docker-compose down``` | stop the stack




## Swarm [IN PROGRESS]

docker swarm init
docker stack deploy -c docker-compose.yml getstartedlab		run the stack
docker service ls											show running service stack
docker service ps getstartedlab_web
docker stack rm getstartedlab
docker swarm leave --force




