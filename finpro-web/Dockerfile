# __FOR DEVELOPMENT PURPOSES__ 

# Base Image: Where our app will running
FROM node:20

# Set Working Directory: Where our app will be placed
WORKDIR /app

# Copy `package.json` into Working Directory
COPY package.json ./

# Install Dependencies
RUN npm install

# Copy All File(s) into Working Directory
COPY . .

# Following Port for Next.js
EXPOSE 3000

# Command to Run the App in Development Mode
CMD ["npm", "run", "dev"]