FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --omit=dev

FROM nginx:alpine
# Copy the build files
COPY --from=build /app/build /usr/share/nginx/html
# Create nginx config file
RUN echo $'\n\
server {\n\
    listen 80;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    \n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
    \n\
    location /images/ {\n\
        alias /usr/share/nginx/html/images/;\n\
        autoindex off;\n\
        try_files $uri $uri/ =404;\n\
    }\n\
}\n'\
> /etc/nginx/conf.d/default.conf

RUN mkdir -p /usr/share/nginx/html/images && \
    chmod -R 755 /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
