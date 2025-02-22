# Book Management API

A robust NestJS-based API for managing books and users with authentication, caching, and advanced features.

## Features

- **Book Management**
  - CRUD operations for books
  - Advanced filtering and sorting
  - Pagination support
  - Status tracking (Available/Borrowed)

- **User Management**
  - Secure registration/login
  - JWT authentication
  - Role-based access control

- **Caching Layer**
  - KeyDB (Redis-compatible) caching
  - Automatic cache invalidation
  - Per-request and collection caching
  - 5-minute TTL for cached data

- **API Documentation**
  - Swagger UI integration
  - Detailed request/response examples
  - Authentication documentation

- **Validation**
  - Class-validator integration
  - Custom validation pipes
  - Type-safe DTOs

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL
- **Cache**: KeyDB (Redis-compatible)
- **ORM**: TypeORM
- **Auth**: JWT
- **API Docs**: Swagger/OpenAPI
- **Testing**: Jest (E2E tests)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/book-management-api.git
cd book-management-api
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Start services with Docker:
```bash
docker-compose up -d
```

5. Run the application:
```bash
npm run start:dev
```

## API Documentation

Access Swagger UI at `http://localhost:3000/api` after starting the application.

**Authentication**:
1. Get token from `/auth/login`
2. Click "Authorize" button in Swagger UI
3. Enter: `Bearer <your-token>`

**Example Requests**:
```http
GET /books?author=J.K.+Rowling&sort=title:ASC
POST /books
{
  "title": "Harry Potter",
  "author": "J.K. Rowling",
  "publishedYear": 1997
}
```

## Testing

Run end-to-end tests:
```bash
npm run test:e2e
```

Test configuration:
- Dedicated test database
- Automatic test cleanup
- Mocked authentication
- Cache isolation

## Caching Strategy

**Cache Layers**:
1. Full books collection cache
2. Individual book cache

**Cache Invalidation**:
- Automatic on write operations
- Time-based expiration (TTL)
- Atomic cache key management

**Cache Monitoring**:
```bash
docker exec -it book-management-api-keydb-1 keydb-cli
> KEYS *
```

## Deployment

1. Production build:
```bash
npm run build
```

2. Docker production setup:
```bash
docker-compose up --build
```
