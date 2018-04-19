FROM kkarczmarczyk/node-yarn:latest

# Create app folder
RUN mkdir -p /app
WORKDIR /app

# Cache npm dependencies
COPY package.json /app/
COPY yarn.lock /app/
RUN yarn

# Copy application files
COPY . /app/

# Precompile javascript
RUN yarn build

# Expose port and start application
EXPOSE 3000
CMD ["yarn", "start"]