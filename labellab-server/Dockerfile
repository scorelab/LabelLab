FROM node

RUN mkdir -p /usr/labellab/labellab-server
WORKDIR /usr/labellab/labellab-server

COPY package.json /usr/labellab/labellab-server
RUN npm install
COPY . /usr/labellab/labellab-server
EXPOSE 4000
CMD ["npm", "start"] 