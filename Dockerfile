FROM node:16-alpine3.12

# create root application folder
WORKDIR /app

# copy configs to /app folder
COPY package*.json ./
COPY tsconfig.json ./
# copy source code to /app/src folder
COPY src /app/src

RUN mkdir -p node_modules/.cache && chmod -R 777 node_modules/.cache

# check files list
RUN ls -a
RUN npm install -g typescript
RUN npm run clean
RUN npm install
RUN npm run build

EXPOSE 7777

CMD [ "node", "./src/app.js" ]