# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the rest of the application code
COPY . .

# Set environment variables directly in the Dockerfile
ARG PORT
ARG REACT_APP_NOT_SECRET_CODE
ENV REACT_APP_NOT_SECRET_CODE=${REACT_APP_NOT_SECRET_CODE}
ENV PORT=${PORT}

# RUN npm install -g yarn

# Create the .env file during the build process
RUN echo "REACT_APP_NOT_SECRET_CODE=$REACT_APP_NOT_SECRET_CODE" >> .env
RUN echo "PORT=$PORT" >> .env

# Install the application dependencies
RUN npm install --legacy-peer-deps

# RUN npm run lint:fix
RUN ls -la
# Build the application
RUN npm run build


## Create a new image and copy build and server.js folder to it
FROM node:18-alpine
WORKDIR /app
COPY --from=0 /app/build /app/build
COPY --from=0 /app/server.js /app/server.js

# Install the production dependencies
RUN npm install express http-proxy

# Expose the specified port
EXPOSE ${PORT}

# Start the application
CMD ["node", "server.js"]
