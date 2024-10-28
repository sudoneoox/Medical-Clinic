FROM node:20-slim as builder
WORKDIR /src
COPY package.json ./
RUN npm install
RUN npm install nodemon
COPY . .

CMD ["npm", "start"]
