## Endpoints 
### 1. Get Books By Collection
**Endpoint:** `GET /collections/${collectionId}?populate=*` 
**Description:** Retrieves a list of all books in the catalog. 
**Types:** 
	Collection info :
		`id: collection.id //number
		`documentId: collection.documentId //string
		`name: collection.name //string
		`description: collection.description //string
	and list of books:
		`id: book.id,  //number`
		`documentId: book.documentId, //string
		`name: book.name,  //string
		`image: book.image //url
		`description: book.description || '',  //string
		`author: book.author || '', //string` 
**Example:**
{
  "data": {
    "id": 2,
    "documentId": "hnal0zl75gposu3ebokqigoo",
    "name": "Russian Classics",
    "description": "A collection of masterpieces from Russian classical literature. Discover timeless works by authors such as Leo Tolstoy, Fyodor Dostoevsky, and Anton Chekhov, offering deep insights into the Russian soul and culture, filled with profound meaning and psychological depth",
    "createdAt": "2024-10-16T08:20:39.584Z",
    "updatedAt": "2024-10-16T08:20:39.584Z",
    "publishedAt": "2024-10-16T08:20:39.592Z",
    "locale": null,
    "books": [
      {
        "id": 6,
        "documentId": "a25elzivpksywcrbtz2lcxxc",
        "name": "War and Peace",
        "description": "A historical epic set during the Napoleonic wars, exploring Russian society, love, and personal growth against the backdrop of major historical events.",
        "createdAt": "2024-10-19T08:28:25.380Z",
        "updatedAt": "2024-10-19T08:28:25.380Z",
        "publishedAt": "2024-10-19T08:28:25.395Z",
        "locale": null,
        "author": "Leo Tolstoy"
      },
      ...
      ]
	}
}


### 2. Get Books By Title/Author
**Endpoint:** `GET /books?filters[author][$eq]=Leo%20Tolstoy&populate=*
**Description:** Get list of all books by title. 
**Types:**
	id: book.id,  
	documentId: book.documentId,  
	name: book.name,  
	description: book.description || '',  
	author: book.author || '',  
	image: book.image?.[0]?.url ? `http://localhost:1337${book.image[0].url}` : '',
**Example:**
{
  "data": [
    {
      "id": 6,
      "documentId": "a25elzivpksywcrbtz2lcxxc",
      "name": "War and Peace",
      "description": "A historical epic set during the Napoleonic wars, exploring Russian society, love, and personal growth against the backdrop of major historical events.",
      "createdAt": "2024-10-19T08:28:25.380Z",
      "updatedAt": "2024-10-19T08:28:25.380Z",
      "publishedAt": "2024-10-19T08:28:25.395Z",
      "locale": null,
      "author": "Leo Tolstoy",
      "image": null,
      "collections": [
        {
          "id": 2,
          "documentId": "hnal0zl75gposu3ebokqigoo",
          "name": "Russian Classics",
          "description": "A collection of masterpieces from Russian classical literature. Discover timeless works by authors such as Leo Tolstoy, Fyodor Dostoevsky, and Anton Chekhov, offering deep insights into the Russian soul and culture, filled with profound meaning and psychological depth",
          "createdAt": "2024-10-16T08:20:39.584Z",
          "updatedAt": "2024-10-16T08:20:39.584Z",
          "publishedAt": "2024-10-16T08:20:39.592Z",
          "locale": null
        }
      ],
      "localizations": []
    },
    {
      "id": 62,
      "documentId": "yvf94wcmtbaung543mu70yf2",
      "name": "Anna Karenina",
      "description": "A tragic love story about a married woman who has an affair with a count, which leads to her downfall.",
      "createdAt": "2024-10-19T08:29:25.102Z",
      "updatedAt": "2024-10-21T09:41:06.332Z",
      "publishedAt": "2024-10-21T09:41:06.346Z",
      "locale": null,
      "author": "Leo Tolstoy",
      "image": [
        {
          "id": 3,
          "documentId": "bdfih4fnj2ywqj9qqwtjz9i0",
          "name": "изображение_2024-10-21_164020949.png",
          "alternativeText": null,
          "caption": null,
          "width": 1359,
          "height": 2126,
          "formats": {
            "thumbnail": {
              "name": "thumbnail_изображение_2024-10-21_164020949.png",
              "hash": "thumbnail_izobrazhenie_2024_10_21_164020949_bd696baa66",
              "ext": ".png",
              "mime": "image/png",
              "path": null,
              "width": 100,
              "height": 156,
              "size": 27.18,
              "sizeInBytes": 27183,
              "url": "/uploads/thumbnail_izobrazhenie_2024_10_21_164020949_bd696baa66.png"
            },
            "small": {
              "name": "small_изображение_2024-10-21_164020949.png",
              "hash": "small_izobrazhenie_2024_10_21_164020949_bd696baa66",
              "ext": ".png",
              "mime": "image/png",
              "path": null,
              "width": 320,
              "height": 500,
              "size": 198.74,
              "sizeInBytes": 198743,
              "url": "/uploads/small_izobrazhenie_2024_10_21_164020949_bd696baa66.png"
            },
            "medium": {
              "name": "medium_изображение_2024-10-21_164020949.png",
              "hash": "medium_izobrazhenie_2024_10_21_164020949_bd696baa66",
              "ext": ".png",
              "mime": "image/png",
              "path": null,
              "width": 479,
              "height": 750,
              "size": 422.68,
              "sizeInBytes": 422678,
              "url": "/uploads/medium_izobrazhenie_2024_10_21_164020949_bd696baa66.png"
            },
            "large": {
              "name": "large_изображение_2024-10-21_164020949.png",
              "hash": "large_izobrazhenie_2024_10_21_164020949_bd696baa66",
              "ext": ".png",
              "mime": "image/png",
              "path": null,
              "width": 639,
              "height": 1000,
              "size": 728.62,
              "sizeInBytes": 728620,
              "url": "/uploads/large_izobrazhenie_2024_10_21_164020949_bd696baa66.png"
            }
          },
          "hash": "izobrazhenie_2024_10_21_164020949_bd696baa66",
          "ext": ".png",
          "mime": "image/png",
          "size": 670.25,
          "url": "/uploads/izobrazhenie_2024_10_21_164020949_bd696baa66.png",
          "previewUrl": null,
          "provider": "local",
          "provider_metadata": null,
          "createdAt": "2024-10-21T09:40:24.723Z",
          "updatedAt": "2024-10-21T09:40:24.723Z",
          "publishedAt": "2024-10-21T09:40:24.725Z",
          "locale": null
        }
      ],
      "collections": [
        {
          "id": 2,
          "documentId": "hnal0zl75gposu3ebokqigoo",
          "name": "Russian Classics",
          "description": "A collection of masterpieces from Russian classical literature. Discover timeless works by authors such as Leo Tolstoy, Fyodor Dostoevsky, and Anton Chekhov, offering deep insights into the Russian soul and culture, filled with profound meaning and psychological depth",
          "createdAt": "2024-10-16T08:20:39.584Z",
          "updatedAt": "2024-10-16T08:20:39.584Z",
          "publishedAt": "2024-10-16T08:20:39.592Z",
          "locale": null
        }
      ],
      "localizations": []
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 2
    }
  }
}
## 3. Get Books by Topic/Content

## 4. Get Collections
**Endpoint:** `GET /collections
**Description:** Get list of all books by title. 
**Types:**
	`id: category.id,  \\number
	`documentId: category.documentId,  \\string
	`name: category.name,  \\string
	`description: category.description || '', \\string

{
  "data": [
    {
      "id": 2,
      "documentId": "hnal0zl75gposu3ebokqigoo",
      "name": "Russian Classics",
      "description": "A collection of masterpieces from Russian classical literature. Discover timeless works by authors such as Leo Tolstoy, Fyodor Dostoevsky, and Anton Chekhov, offering deep insights into the Russian soul and culture, filled with profound meaning and psychological depth",
      "createdAt": "2024-10-16T08:20:39.584Z",
      "updatedAt": "2024-10-16T08:20:39.584Z",
      "publishedAt": "2024-10-16T08:20:39.592Z",
      "locale": null
    },
    ...
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 5
    }
  }
}


## 5. Get book by id
**Endpoint:** `GET /books/${bookId}?populate=*
**Description:** Get list of all books by title. 
**Types:**
	id: book.id,  
	documentId: book.documentId,  
	name: book.name,  
	description: book.description || '',  
	author: book.author || '',  
	image: book.image?.[0]?.url ? `http://localhost:1337${book.image[0].url}` : '',
**Example:**
{
  "data": {
    "id": 62,
    "documentId": "yvf94wcmtbaung543mu70yf2",
    "name": "Anna Karenina",
    "description": "A tragic love story about a married woman who has an affair with a count, which leads to her downfall.",
    "createdAt": "2024-10-19T08:29:25.102Z",
    "updatedAt": "2024-10-21T09:41:06.332Z",
    "publishedAt": "2024-10-21T09:41:06.346Z",
    "locale": null,
    "author": "Leo Tolstoy",
    "image": [
      {
        "id": 3,
        "documentId": "bdfih4fnj2ywqj9qqwtjz9i0",
        "name": "изображение_2024-10-21_164020949.png",
        "alternativeText": null,
        "caption": null,
        "width": 1359,
        "height": 2126,
        "formats": {
          "thumbnail": {
            "name": "thumbnail_изображение_2024-10-21_164020949.png",
            "hash": "thumbnail_izobrazhenie_2024_10_21_164020949_bd696baa66",
            "ext": ".png",
            "mime": "image/png",
            "path": null,
            "width": 100,
            "height": 156,
            "size": 27.18,
            "sizeInBytes": 27183,
            "url": "/uploads/thumbnail_izobrazhenie_2024_10_21_164020949_bd696baa66.png"
          },
          "small": {
            "name": "small_изображение_2024-10-21_164020949.png",
            "hash": "small_izobrazhenie_2024_10_21_164020949_bd696baa66",
            "ext": ".png",
            "mime": "image/png",
            "path": null,
            "width": 320,
            "height": 500,
            "size": 198.74,
            "sizeInBytes": 198743,
            "url": "/uploads/small_izobrazhenie_2024_10_21_164020949_bd696baa66.png"
          },
          "medium": {
            "name": "medium_изображение_2024-10-21_164020949.png",
            "hash": "medium_izobrazhenie_2024_10_21_164020949_bd696baa66",
            "ext": ".png",
            "mime": "image/png",
            "path": null,
            "width": 479,
            "height": 750,
            "size": 422.68,
            "sizeInBytes": 422678,
            "url": "/uploads/medium_izobrazhenie_2024_10_21_164020949_bd696baa66.png"
          },
          "large": {
            "name": "large_изображение_2024-10-21_164020949.png",
            "hash": "large_izobrazhenie_2024_10_21_164020949_bd696baa66",
            "ext": ".png",
            "mime": "image/png",
            "path": null,
            "width": 639,
            "height": 1000,
            "size": 728.62,
            "sizeInBytes": 728620,
            "url": "/uploads/large_izobrazhenie_2024_10_21_164020949_bd696baa66.png"
          }
        },
        "hash": "izobrazhenie_2024_10_21_164020949_bd696baa66",
        "ext": ".png",
        "mime": "image/png",
        "size": 670.25,
        "url": "/uploads/izobrazhenie_2024_10_21_164020949_bd696baa66.png",
        "previewUrl": null,
        "provider": "local",
        "provider_metadata": null,
        "createdAt": "2024-10-21T09:40:24.723Z",
        "updatedAt": "2024-10-21T09:40:24.723Z",
        "publishedAt": "2024-10-21T09:40:24.725Z",
        "locale": null
      }
    ],
    "collections": [
      {
        "id": 2,
        "documentId": "hnal0zl75gposu3ebokqigoo",
        "name": "Russian Classics",
        "description": "A collection of masterpieces from Russian classical literature. Discover timeless works by authors such as Leo Tolstoy, Fyodor Dostoevsky, and Anton Chekhov, offering deep insights into the Russian soul and culture, filled with profound meaning and psychological depth",
        "createdAt": "2024-10-16T08:20:39.584Z",
        "updatedAt": "2024-10-16T08:20:39.584Z",
        "publishedAt": "2024-10-16T08:20:39.592Z",
        "locale": null
      }
    ],
    "localizations": []
  },
  "meta": {

  }
}