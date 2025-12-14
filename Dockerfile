# --- Stage 1: Build the React Application ---

# Use the official Node 20 Alpine image for a small build environment
FROM node:20-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json (or yarn.lock) first
# This allows Docker to cache the dependencies layer if they haven't changed
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# --- IMPORTANT: Inject the API Key before building ---
# This command takes the build argument GEMINI_API_KEY and writes it
# to a .env.local file, which Vite will then read during the build process.
# This makes the key available at build time (e.g., in a fetch request URL).
ARG GEMINI_API_KEY
RUN echo "VITE_GEMINI_API_KEY=$GEMINI_API_KEY" >> .env.local

# Build the React application
# 'npm run build' generates the static files in the 'dist' folder
RUN npm run build

# --- Stage 2: Serve the Application with Nginx ---

# Use a lightweight Nginx Alpine image for the final, production image
FROM nginx:alpine

# Set the port that the container will listen on. Cloud Run requires us
# to listen on the port specified by the PORT environment variable,
# but we expose 8080 here as requested for consistency.
EXPOSE 8080

# Remove the default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom nginx configuration file into the container
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built React app (from the 'builder' stage) to the Nginx static folder
COPY --from=builder /app/dist /usr/share/nginx/html

# The default Nginx command runs Nginx in the foreground, which is
# what is required for Cloud Run to know the container is running.
CMD ["nginx", "-g", "daemon off;"]
