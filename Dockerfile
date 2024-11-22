# Step 1: Use an official Node.js base image
FROM node:lts

# Step 2: Set the working directory
WORKDIR /usr/src/app

# Step 3: Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application code
COPY . .

# Step 6: Build the TypeScript code
RUN npm run build

# Step 7: Expose the port that the app runs on (예: 3000)
EXPOSE 80

# Step 8: Start the server
CMD ["npm", "run", "dev-ts"]
