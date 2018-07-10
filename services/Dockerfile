from node
WORKDIR /usr/src/app
ADD package*.json ./
ADD server.js ./
ADD chinook.db ./
RUN npm install
EXPOSE 8080
CMD [ "npm", "start" ]
