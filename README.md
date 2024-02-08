# Home Library Service

1. Task: https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/rest-service/assignment.md
2. --
3. --
4. Done: 29.07.2023 / deadline: 01.08.2023
5. Score: 760 / 760

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
git checkout -b develop
```
```bash
npm ci
```

## Running application

```bash
npm start
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```bash
npm run test
```

To run only one of all test suites

```bash
npm run test -- <path to suite>
```

To run all test with authorization

```bash
npm run test:auth
```

To run only specific test suite with authorization

```bash
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```bash
npm run lint
```

```bash
npm run format
```