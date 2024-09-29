FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 8081 
COPY nginx.conf /etc/nginx/nginx.conf   
CMD ["nginx", "-g", "daemon off;"]