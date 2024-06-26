FROM node:18

WORKDIR /sorsagan/synitecht

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD ["node", "."]