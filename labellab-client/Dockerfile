FROM node:8

RUN mkdir -p /usr/labellab/labellab-client
WORKDIR /usr/labellab/labellab-client

ENV PATH /usr/app/node_modules/.bin:$PATH


COPY package.json /usr/labellab/labellab-client
RUN npm install --silent
COPY . /usr/labellab/labellab-client

EXPOSE 3000
CMD ["npm", "start"] 