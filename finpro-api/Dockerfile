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

# Prisma Generate
RUN npx prisma generate

# Following Port on `index.ts` File
EXPOSE 8000

# Install Nodemon for Hot-Reloading during Development Phase
RUN npm install -g nodemon

# Command to Run the App using Nodemon
CMD ["npm", "run", "dev"]