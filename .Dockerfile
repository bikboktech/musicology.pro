FROM --platform=linux/amd64 node:18

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
# Bundle app source
COPY . .

ENV NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
RUN npm install
RUN npm run build
# If you are building your code for production
# RUN npm ci --omit=dev

EXPOSE 3000
CMD [ "npm", "run", "start" ]
