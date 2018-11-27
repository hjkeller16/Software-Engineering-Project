FROM node:8

WORKDIR /app


COPY angular/package*.json ./angular/
COPY package*.json ./

RUN npm install --unsafe-perm

COPY . .

RUN npm run build

EXPOSE 3000
CMD [ "npm", "run", "start-prod" ]
