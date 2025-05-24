# Production Deployment

This document provides instructions for deploying the application in a production environment using Docker Compose.

## Prerequisites

- Docker and Docker Compose installed on your server
- Git to clone the repository

## Deployment Steps

1. Clone the repository:
   ```bash
   git clone <your-repository-url>
   cd <repository-directory>
   ```

2. Make sure you have the production configuration files:
   - `docker-compose.prod.yml`
   - `nginx.prod.conf`
   - `.env.production`

3. Build and start the production containers:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d --build
   ```

4. Verify the application is running:
   ```bash
   curl http://localhost:5000
   ```

## Configuration

The application is configured to run on HTTP port 5000. If you need to change this port, modify the `docker-compose.prod.yml` file:

```yaml
frontend:
  ports:
    - "YOUR_PORT:80"
```

## Environment Variables

Production environment variables are stored in `.env.production`. You can modify this file to change:

- API configuration
- Database settings
- Google Maps API key

## Database

The application uses SQLite with Prisma. The database file is stored in a Docker volume named `data` for persistence.

## Logs

To view logs from the running containers:

```bash
# All logs
docker-compose -f docker-compose.prod.yml logs

# Frontend logs only
docker-compose -f docker-compose.prod.yml logs frontend

# API logs only
docker-compose -f docker-compose.prod.yml logs api

# Follow logs in real-time
docker-compose -f docker-compose.prod.yml logs -f
```

## Stopping the Application

To stop the application:

```bash
docker-compose -f docker-compose.prod.yml down
```

To stop the application and remove volumes (this will delete the database):

```bash
docker-compose -f docker-compose.prod.yml down -v
```

## Updating the Application

To update the application with new code:

1. Pull the latest changes:
   ```bash
   git pull
   ```

2. Rebuild and restart the containers:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d --build
