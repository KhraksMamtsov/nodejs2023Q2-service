# Home Library Service

1. Task: https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/containerization-database-orm/assignment.md
2. --
3. --
4. Done: 11.08.2023 / deadline: 15.08.2023
5. Score: 360 / 360

## NOTES:
- You can set `PORT` in `.env` file (look at `.env.example`)
- You can visit swagger-page http://localhost:4000/doc
- And take always get actual OpenApi spec here http://localhost:4000/doc-yaml

## Setup
```bash
git clone https://github.com/KhraksMamtsov/nodejs2023Q2-service.git
```
```bash
cd nodejs2023Q2-service
```
```bash
git checkout -b orm
```
```bash
npm ci
```

## Running application

### Running in production mode with docker
```bash
docker-compose up production
```

### Running in development mode with hot-reload with docker
```bash
docker-compose up development
```

After starting the app on port (4000 as default) you can open in your browser OpenAPI documentation by typing http://localhost:4000/doc/.

For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Vulnerabilities scanning
```bash
npm run vulnerabilities:scan # alias for "docker scout cves"
```
```bash
npm run vulnerabilities:scan:private # usage example with image in private repo "khraksmamtsov/home-library-service:latest"
```

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```bash
npm run test
```

### Auto-fix and format

```bash
npm run lint
```

```bash
npm run format
```