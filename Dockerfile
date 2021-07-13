FROM node:12

WORKDIR /usr/app-src1/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "start"]