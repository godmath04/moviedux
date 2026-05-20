#Definimos la imagen y directorio de trabajo
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
# API escucha puerto 5000
EXPOSE 5000

CMD ["node", "server.js"]
