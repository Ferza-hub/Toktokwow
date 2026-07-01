FROM node:20-bookworm

# Install Python, pip, Firefox, and wget (for Geckodriver)
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    firefox-esr \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Install Geckodriver
RUN wget -q "https://github.com/mozilla/geckodriver/releases/download/v0.34.0/geckodriver-v0.34.0-linux64.tar.gz" -O /tmp/geckodriver.tar.gz \
    && tar -C /usr/local/bin -zxf /tmp/geckodriver.tar.gz \
    && rm /tmp/geckodriver.tar.gz \
    && chmod +x /usr/local/bin/geckodriver

WORKDIR /app

# Setup Python virtual environment and install selenium
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip3 install selenium

# Copy package files and install Node dependencies
COPY package*.json ./
RUN npm install

# Copy application source code
COPY . .

# Build the application
RUN npm run build

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
