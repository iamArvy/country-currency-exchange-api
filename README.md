# Country Currency & Exchange API

A **RESTful API built with NestJS**, Prisma, and MySQL that fetches, caches, and manages country data — including their currencies, exchange rates, and estimated GDP.

This project was developed as part of the **HNG Internship 13 — Backend Task (Stage 2 Challenge)**, showcasing skills in **API design**, **data integration**, and **database caching**.

---

## Objective

The **Country Currency & Exchange API** is designed to:

* Fetch real-world country and currency data from external APIs.
* Combine and compute additional fields like `estimated_gdp`.
* Persist the data in a MySQL database.
* Serve endpoints for CRUD operations, filtering, sorting, and image generation.

---

## Tech Stack

| Technology     | Purpose                                    |
| -------------- | ------------------------------------------ |
| **NestJS**     | Backend framework                          |
| **Prisma ORM** | Database ORM for MySQL                     |
| **MySQL**      | Relational database for caching data       |
| **Axios**      | HTTP client for fetching external API data |
| **Sharp**      | Image generation and manipulation library  |
| **Node.js**    | Runtime environment                        |
| **TypeScript** | Type safety and modern JavaScript features |

---

## Setup & Installation

### Clone the Repository

```bash
git clone https://github.com/iamarvy/country-currency-exchange-api.git
cd country-currency-exchange-api
```

### Install Dependencies

```bash
pnpm install
```

### Set Up Environment Variables

Create a `.env` file in the root directory and define:

```bash
DATABASE_URL="mysql://user:password@localhost:3306/country_db"
PORT=3000
COUNTRIES_API_URL="https://restcountries.com/v2"
EXCHANGE_RATES_API_URL="https://open.er-api.com/v6/latest"
SUMMARY_IMAGE_PATH="cache/summary.png"
```

> Ensure your MySQL database is running and accessible.

### Run Migrations

```bash
npx prisma migrate dev
```

### Start the Development Server

```bash
pnpm start:dev
```

Once running, visit:
[http://localhost:3000](http://localhost:3000)

---

## API Endpoints

| Method     | Endpoint             | Description                                                |
| ---------- | -------------------- | ---------------------------------------------------------- |
| **POST**   | `/countries/refresh` | Fetch all countries, update exchange rates, and cache data |
| **GET**    | `/countries`         | Retrieve all countries (supports filters & sorting)        |
| **GET**    | `/countries/:name`   | Get one country by name                                    |
| **DELETE** | `/countries/:name`   | Delete a country record                                    |
| **GET**    | `/status`            | Show total countries and last refresh timestamp            |
| **GET**    | `/countries/image`   | Serve summary image showing top countries by GDP           |

---

## Example Responses

### **GET** `/countries?region=Africa`

```json
[
  {
    "id": 1,
    "name": "Nigeria",
    "capital": "Abuja",
    "region": "Africa",
    "population": 206139589,
    "currency_code": "NGN",
    "exchange_rate": 1600.23,
    "estimated_gdp": 25767448125.2,
    "flag_url": "https://flagcdn.com/ng.svg",
    "last_refreshed_at": "2025-10-22T18:00:00Z"
  },
  {
    "id": 2,
    "name": "Ghana",
    "capital": "Accra",
    "region": "Africa",
    "population": 31072940,
    "currency_code": "GHS",
    "exchange_rate": 15.34,
    "estimated_gdp": 3029834520.6,
    "flag_url": "https://flagcdn.com/gh.svg",
    "last_refreshed_at": "2025-10-22T18:00:00Z"
  }
]
```

### **GET** `/status`

```json
{
  "total_countries": 250,
  "last_refreshed_at": "2025-10-22T18:00:00Z"
}
```

---

## Image Generation

After every successful `/countries/refresh` operation:

* The API generates an image (`cache/summary.png`) summarizing:

  * Total number of countries
  * Top 5 countries by estimated GDP
  * Timestamp of last refresh
* The image is served via `/countries/image`.

If no image is found:

```json
{
  "error": "Summary image not found"
}
```

## External APIs Used

| Source                 | Endpoint                                                                                 | Description                            |
| ---------------------- | ---------------------------------------------------------------------------------------- | -------------------------------------- |
| **Countries API**      | `https://restcountries.com/v2/all?fields=name,capital,region,population,flag,currencies` | Fetches base country data              |
| **Exchange Rates API** | `https://open.er-api.com/v6/latest/USD`                                                  | Fetches exchange rates relative to USD |

---

## Author

**Oluwaseyi Oke**
🌐 [GitHub](https://github.com/iamarvy)
📧 [iamarvytech@gmail.com](mailto:iamarvytech@gmail.com)

<!-- https://nonvasculose-brittney-supersagaciously.ngrok-free.dev/ -->