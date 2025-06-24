# Digital Library API Documentation

This document provides an overview of the available API endpoints for the Digital Library project. The API allows users to manage books, collections, and reviews, as well as perform searches and get personalized recommendations.

## Base URL

All endpoints are relative to the base URL of the API, e.g., `http://localhost:8000/`.

## Authentication

Some endpoints require authentication using token-based authentication provided by Djoser. To authenticate:
1. Obtain a token via the `/auth/token/login/` endpoint.
2. Include it in the `Authorization` header of requests as `Token <token>`.

Endpoints requiring authentication are marked accordingly. If no authentication is specified, the endpoint is accessible without a token (defaulting to `AllowAny` in Django REST framework).

## Data Format

- The API uses JSON for request and response bodies.
- File uploads (e.g., book files and images) are supported via multipart form data.
- Standard HTTP status codes are used:
  - `200 OK`: Successful GET request.
  - `201 Created`: Successful POST request.
  - `400 Bad Request`: Invalid input.
  - `404 Not Found`: Resource not found.
  - `500 Internal Server Error`: Server error.

## Endpoints

### Books

#### List and Create Books

- **Endpoint**: `/books/`
- **Methods**:
  - **GET**: Retrieve a list of all books.
  - **POST**: Create a new book.
- **Description**:
  - GET: Returns a list of all books in the library.
  - POST: Creates a new book with the provided details.
- **Parameters**: None for GET.
- **Request Body (POST)**:
  ```json
  {
    "title": "string",
    "description": "string",
    "author": "string",
    "publisher": "string",
    "image": "file",
    "publishedAt": "integer",
    "bookFile": "file"
  }
  ```
  Note: `createdAt` and `updatedAt` are automatically set by the server.
- **Response**:
  - GET: List of books in JSON format:
    ```json
    [
      {
        "id": "integer",
        "title": "string",
        "description": "string",
        "author": "string",
        "publisher": "string",
        "image": "string (URL)",
        "createdAt": "datetime",
        "updatedAt": "datetime",
        "publishedAt": "integer",
        "bookFile": "string (URL)"
      }
    ]
    ```
  - POST: Details of the created book (same structure as above).
- **Authentication**: Not required.

#### Get Book by ID

- **Endpoint**: `/books/<int:book_id>/`
- **Method**: GET
- **Description**: Retrieve details of a specific book by its ID.
- **Parameters**:
  - `book_id`: Integer, the ID of the book (path parameter).
- **Response**: JSON object with book details (same structure as above).
- **Authentication**: Not required.

#### Search Books by Author

- **Endpoint**: `/bookByAuthor/<str:book_author>/`
- **Method**: GET
- **Description**: Search for books by author name using fuzzy matching.
- **Parameters**:
  - `book_author`: String, the author's name or part of it (path parameter).
- **Response**: List of matching books (same structure as the GET `/books/` response).
- **Authentication**: Not required.

#### Search Books by Title

- **Endpoint**: `/bookByTitle/<str:book_title>/`
- **Method**: GET
- **Description**: Search for books by title using fuzzy matching.
- **Parameters**:
  - `book_title`: String, the title or part of it (path parameter).
- **Response**: List of matching books (same structure as the GET `/books/` response).
- **Authentication**: Not required.

#### Search Books by Excerpt

- **Endpoint**: `/bookByExcerpt/<str:excerpt>/`
- **Method**: GET
- **Description**: Search for books containing a specific excerpt in their chapters.
- **Parameters**:
  - `excerpt`: String, the excerpt to search for (path parameter).
- **Response**: List of matching books (same structure as the GET `/books/` response), limited to 10 results.
- **Authentication**: Not required.

#### Search Books by Theme

- **Endpoint**: `/bookByTheme/<str:theme>/`
- **Method**: GET
- **Description**: Perform a semantic search for books related to a specific theme using embeddings.
- **Parameters**:
  - `theme`: String, the theme to search for (path parameter).
- **Response**: List of matching books (same structure as the GET `/books/` response).
- **Authentication**: Not required.

### Collections

#### List and Create Collections

- **Endpoint**: `/collections/`
- **Methods**:
  - **GET**: Retrieve a list of all collections.
  - **POST**: Create a new collection.
- **Description**:
  - GET: Returns a list of all collections.
  - POST: Creates a new collection with the provided details.
- **Parameters**: None for GET.
- **Request Body (POST)**:
  ```json
  {
    "title": "string",
    "description": "string",
    "books": ["integer"] // list of book IDs
  }
  ```
- **Response**:
  - GET: List of collections in JSON format:
    ```json
    [
      {
        "id": "integer",
        "title": "string",
        "description": "string",
        "books": ["integer"]
      }
    ]
    ```
  - POST: Details of the created collection (same structure as above).
- **Authentication**: Not required.

#### Get Collection by ID

- **Endpoint**: `/collections/<int:collection_id>/`
- **Method**: GET
- **Description**: Retrieve details of a specific collection by its ID.
- **Parameters**:
  - `collection_id`: Integer, the ID of the collection (path parameter).
- **Response**: JSON object with collection details:
  ```json
  {
    "id": "integer",
    "title": "string",
    "description": "string",
    "books": [
      {
        "id": "integer",
        "title": "string",
        "description": "string",
        "author": "string",
        "publisher": "string",
        "image": "string (URL)",
        "createdAt": "datetime",
        "updatedAt": "datetime",
        "publishedAt": "integer",
        "bookFile": "string (URL)"
      }
    ]
  }
  ```
- **Authentication**: Not required.

#### Get Book Suggestions for Collection

- **Endpoint**: `/collections/<int:collection_id>/suggestions/`
- **Method**: GET
- **Description**: Get book suggestions for a specific collection based on semantic similarity of embeddings.
- **Parameters**:
  - `collection_id`: Integer, the ID of the collection (path parameter).
- **Response**: List of suggested books (same structure as the GET `/books/` response), limited to 10 results.
- **Authentication**: Not required.

### Reviews

#### Create Review

- **Endpoint**: `/reviews/create/`
- **Method**: POST
- **Description**: Create a new review for a book.
- **Request Body**:
  ```json
  {
    "title": "string",
    "body": "string",
    "rate": "integer (0-5)",
    "book": "integer" // book ID
  }
  ```
- **Response**: Details of the created review:
  ```json
  {
    "title": "string",
    "body": "string",
    "rate": "integer",
    "book": "integer"
  }
  ```
- **Authentication**: Required.

#### Get Reviews for a Book

- **Endpoint**: `/reviews/<int:book_id>/`
- **Method**: GET
- **Description**: Retrieve all reviews for a specific book.
- **Parameters**:
  - `book_id`: Integer, the ID of the book (path parameter).
- **Response**: List of reviews:
  ```json
  [
    {
      "title": "string",
      "body": "string",
      "rate": "integer",
      "username": "string"
    }
  ]
  ```
- **Authentication**: Not required.

#### Get Reviews by User

- **Endpoint**: `/reviews/byUser/`
- **Method**: GET
 وجود- **Description**: Retrieve all reviews made by the authenticated user.
- **Response**: List of reviews:
  ```json
  [
    {
      "book": "integer",
      "title": "string",
      "body": "string",
      "rate": "integer",
      "username": "string"
    }
  ]
  ```
- **Authentication**: Required.

### Recommendations

#### Get Book Recommendations for User

- **Endpoint**: `/books/recommendations/`
- **Method**: GET
- **Description**: Get book recommendations for the authenticated user based on their positive reviews (rate ≥ 3), using semantic similarity of embeddings.
- **Response**: List of recommended books (same structure as the GET `/books/` response), limited to 10 results.
- **Authentication**: Required.

### Authentication

The API uses Djoser for user authentication and management. Common endpoints include:

- **Register User**: `/auth/users/`
  - Method: POST
  - Request Body:
    ```json
    {
      "email": "string",
      "username": "string",
      "password": "string"
    }
    ```
- **Login**: `/auth/token/login/`
  - Method: POST
  - Request Body:
    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```
  - Response: `{ "auth_token": "string" }`
- **Logout**: `/auth/token/logout/`
  - Method: POST
  - Authentication: Required

For a complete list of authentication endpoints, refer to the [Djoser documentation](https://djoser.readthedocs.io/en/latest/).

## API Documentation Endpoints

Interactive documentation is available at:

- **OpenAPI Schema**: `/schema/`
- **Swagger UI**: `/docs/swagger/`
- **ReDoc**: `/docs/redoc/`

These endpoints provide a detailed, interactive view of all API endpoints, including request and response schemas.

## Additional Notes

- **Search Functionality**: The API uses Elasticsearch for advanced search capabilities (e.g., fuzzy matching for author/title, phrase matching for excerpts, and semantic search for themes).
- **Embeddings**: Books and collections are indexed with embeddings generated by the `sentence-transformers/all-MiniLM-L6-v2` model, enabling semantic similarity searches and recommendations.
- **File Handling**: When creating books, EPUB files are processed to extract metadata and generate embeddings, which are stored in Elasticsearch.
- **Dynamic Suggestions**: Collection suggestions for books and book suggestions for collections are based on cosine similarity of embeddings, with configurable thresholds.
- **Updates**: This documentation reflects the current codebase. For the most up-to-date information, consult the interactive Swagger or ReDoc documentation.

For further assistance or inquiries, please contact the development team.