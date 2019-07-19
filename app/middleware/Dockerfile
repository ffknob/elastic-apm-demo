FROM node:8-alpine
WORKDIR /home/node/app
COPY . .
ENV NODE_ENV production
ENV PORT 8080
RUN npm install
CMD ["npm", "start"]