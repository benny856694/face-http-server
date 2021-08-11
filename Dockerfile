FROM node:10.24
WORKDIR /app
COPY . .
RUN yarn install
#RUN ["npm", "run", "build:prod"]
CMD ["node", "src/index.js"]