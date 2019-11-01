FROM node:10.15.3

WORKDIR /home/node/app
COPY package*.json /home/node/app/
RUN rm -rf node_modules
RUN npm install

CMD npm start
EXPOSE 9000
