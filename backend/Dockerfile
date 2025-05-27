FROM node:18

# Install Python and venv
RUN apt-get update && \
    apt-get install -y python3 python3-pip python3-venv

WORKDIR /app

COPY . .

# Create virtual environment and install Python packages inside it
RUN python3 -m venv /opt/venv && \
    /opt/venv/bin/pip install --upgrade pip && \
    /opt/venv/bin/pip install -r requirements.txt

# Install Node dependencies
RUN npm install

EXPOSE 3000

# Use the Node command as usual; if you want to run python scripts, use /opt/venv/bin/python
CMD ["node", "server.js"]
