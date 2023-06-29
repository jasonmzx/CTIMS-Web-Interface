# Use Node.js image
FROM node:latest

# Create app directory
WORKDIR /opt/app

# Copy all files in the current directory to the WORKDIR in the Docker image
COPY . .

# Install app dependencies
RUN npm install

# Your app binds to port 3000 so you'll use the EXPOSE instruction to have it mapped by the docker daemon
EXPOSE 3000

CMD ["ls"]

# Define the command to run your app using CMD which defines your runtime
CMD [ "npm", "start" ]
