FROM node:14.17-alpine
WORKDIR /app

# Install app dependencies
COPY ./backend ./backend
COPY ./frontend/build ./frontend/build
COPY ./index.js ./index.js
COPY package*.json ./
COPY backend/package*.json ./backend/
RUN yarn install-backend

# Bundle app source
ENV NODE_ENV=production
ARG MONGO_URL
ENV MONGO_URL="mongodb+srv://trix_831:Joseph831@cluster4trix.kfhexca.mongodb.net/?retryWrites=true&w=majority&appName=Cluster4trix"
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL="https://cktfgsc-bank-z3zpvj7vba-de.a.run.app/api"

EXPOSE 2022
CMD [ "node", "index.js" ]

# FROM node:16-alpine

# EXPOSE 2023

# COPY . /app
# WORKDIR /app

# RUN corepack enable
# RUN yarn install:prod
# RUN yarn build-frontend

# CMD ["yarn", "deploy"]