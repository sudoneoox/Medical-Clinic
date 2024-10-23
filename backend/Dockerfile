FROM node:20-slim
WORKDIR /src
COPY package.json ./
RUN npm install
RUN npm install nodemon
COPY . .

ENV NODE_ENV=development
ENV DB_HOST=mariadb
ENV DB_USER=admin
ENV DB_PASSWORD=abc
ENV DB_NAME=medical_clinic
ENV DB_PORT=3306

CMD ["npm", "start"]
