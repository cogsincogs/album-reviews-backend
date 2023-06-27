FROM node:20

# Create app directory
WORKDIR /usr/src/app

ENV NODE_ENV development

# Install app dependencies
COPY ./app/package*.json ./

RUN npm install
# For production replace above with below
# RUN npm ci --omit=dev

# Bundle app source
COPY . .

# Expose port
EXPOSE 8080

# Start server
CMD [ "node", "server.js" ]