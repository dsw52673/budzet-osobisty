# System Zarządzania Budżetem Osobistym

Aplikacja webowa służąca do monitorowania finansów osobistych. Pozwala na planowanie wydatków, analizę statystyczną oraz kontrolę limitów budżetowych w czasie rzeczywistym.

Autorzy: 
* Marcin Frąckowiak 52673
* Mateusz Grzegorowski 52683

---

## Spis treści

1. [Ogólne założenia projektu](#-ogólne-założenia-projektu)
2. [Zastosowane technologie](#-zastosowane-technologie)
3. [Uruchomienie projektu](#-uruchomienie-projektu)
4. [Schemat bazy danych](#-schemat-bazy-danych)
6. [Dokumentacja API](#-dokumentacja-api)

---

## Ogólne założenia projektu

System Zarządzania Budżetem Osobistym to aplikacja webowa umożliwiająca użytkownikom pełną kontrolę nad swoimi finansami. Projekt realizuje wymagania wdrożenia systemu składającego się z serwera REST API, relacyjnej bazy danych PostgreSQL oraz aplikacji webowej opartej na Next.js.

### Kluczowe funkcjonalności

**Zarządzanie użytkownikiem**
- Rejestracja i logowanie z uwierzytelnianiem JWT
- Zarządzanie profilem (imię, nazwisko, preferowana waluta, zmiana hasła)
- Szyfrowanie haseł po stronie serwera (bcrypt)

**Zarządzanie wydatkami**
- Pełny zestaw operacji CRUD na transakcjach
- Przypisywanie wydatków do kategorii
- Określanie kwoty, daty oraz opcjonalnego opisu
- Obsługa wielu walut (PLN, EUR, USD, GBP, CHF, NOK) z automatycznym przeliczaniem kursów (zewnętrzne API NBP)
- Kopiowanie cyklicznych wydatków do kolejnego miesiąca

**Kategorie i personalizacja**
- Predefiniowane kategorie systemowe: Jedzenie, Transport, Mieszkanie i rachunki, Rozrywka i wolny czas, Zdrowie, Edukacja, Odzież, Inne
- Możliwość tworzenia własnych kategorii przez użytkownika

**Moduł budżetowy i analityczny**
- Definiowanie miesięcznych limitów budżetowych
- Wizualne alerty przy przekroczeniu 80% i 100% limitu
- Podsumowanie miesięczne: suma wydatków vs. limit
- Statystyki procentowe wydatków per kategoria
- Filtrowanie historii transakcji po datach, kategoriach i kwotach

---

## Zastosowane technologie

### Stack technologiczny

| Warstwa | Technologia | Wersja |
|---|---|---|
| Framework webowy | [Next.js](https://nextjs.org/) | 16 |
| Język | TypeScript | 5 |
| UI Library | React | 19 |
| Stylowanie | Tailwind CSS | 4 |
| Baza danych | PostgreSQL (Supabase) | — |
| ORM | Prisma | 7 |
| Uwierzytelnianie | JWT (jose) | — |
| Haszowanie haseł | bcryptjs | — |
| Kursy walut | NBP Web API (publiczne) | — |


### Architektura systemu

Aplikacja bazuje na **bezserwerowej (serverless)** architekturze Next.js. Backend i frontend hostowane są w obrębie jednego projektu. Logika serwerowa wykorzystuje **Next.js API Routes** udostępniające architekturę RESTful. Middleware Next.js weryfikuje token JWT przy każdym żądaniu do chronionych zasobów.

```
┌─────────────────────────────────────────┐
│              Przeglądarka               │
│          (Next.js Frontend)             │
└──────────────┬──────────────────────────┘
               │ HTTP / REST
┌──────────────▼──────────────────────────┐
│         Next.js API Routes              │
│    (Middleware JWT → Route Handlers)    │
└──────────────┬──────────────────────────┘
               │ Prisma ORM
┌──────────────▼──────────────────────────┐
│       PostgreSQL (Supabase)             │
└─────────────────────────────────────────┘
               │ HTTP
┌──────────────▼──────────────────────────┐
│        NBP Web API                      │
│     (kursy walut obcych)                │
└─────────────────────────────────────────┘
```

---

## Uruchomienie projektu

### Wymagania

- Node.js >= 18
- Konto [Supabase](https://supabase.com/) z bazą danych PostgreSQL

### Konfiguracja zmiennych środowiskowych

Utwórz plik `.env` w katalogu głównym projektu:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="klucz-jwt"
```

### Instalacja i uruchomienie

```bash
# Instalacja zależności
npm install

# Generowanie klienta Prisma
npx prisma generate

# Migracja bazy danych
npx prisma migrate deploy

# Uruchomienie serwera deweloperskiego
npm run dev
```

Aplikacja dostępna pod adresem: [http://localhost:3000](http://localhost:3000)

---

## Schemat bazy danych

Baza danych składa się z 4 tabel. Wszystkie relacje obsługują kaskadowe usuwanie powiązanych rekordów.

```
┌──────────────────────────────────────────────────────────────────┐
│  User                                                            │
│  ─────────────────────────────────────────────────────────────   │
│  id         String   @id @default(cuid())                        │
│  email      String   @unique                                     │
│  password   String                                               │
│  firstName  String?                                              │
│  lastName   String?                                              │
│  currency   String   @default("PLN")                             │
│  createdAt  DateTime @default(now())                             │
│  updatedAt  DateTime @updatedAt                                  │
└──────────────┬───────────────────────────────────────────────────┘
               │ 1:N          │ 1:N          │ 1:N
               ▼              ▼              ▼
┌──────────────────┐  ┌────────────────────────────────────────────┐
│  Category        │  │  Expense                                   │
│  ──────────────  │  │  ─────────────────────────────────────     │
│  id       String │  │  id           String  @id @default(cuid()) │
│  name     String │  │  amount       Decimal @db.Decimal(10, 2)   │
│  isSystem Bool   │  │  currency     String  @default("PLN")      │
│  userId   String?│  │  amountInBase Decimal @db.Decimal(10, 2)   │
└──────────┬───────┘  │  exchangeRate Decimal @db.Decimal(12, 6)   │
           │ 1:N      │  date         DateTime                     │
           │          │  description  String?                      │
           ▼          │  userId       String                       │
┌──────────────────┐  │  categoryId   String                       │
│  Budget          │  │  createdAt    DateTime @default(now())     │
│  ──────────────  │  │  updatedAt    DateTime @updatedAt          │
│  id          Str │  └────────────────────────────────────────────┘
│  month       Int │
│  year        Int │
│  limitAmount Dec │
│  userId      Str │
│  categoryId  Str?│
│  createdAt   DT  │
│  updatedAt   DT  │
└──────────────────┘
```

### Opis encji

#### `User` — Użytkownik
| Pole | Typ | Opis |
|---|---|---|
| `id` | String (CUID) | Unikalny identyfikator |
| `email` | String | Adres e-mail (unikalny) |
| `password` | String | Hash hasła (bcrypt) |
| `firstName` | String? | Imię (opcjonalne) |
| `lastName` | String? | Nazwisko (opcjonalne) |
| `currency` | String | Preferowana waluta (domyślnie PLN) |

#### `Category` — Kategoria wydatku
| Pole | Typ | Opis |
|---|---|---|
| `id` | String (CUID) | Unikalny identyfikator |
| `name` | String | Nazwa kategorii |
| `isSystem` | Boolean | Czy jest kategorią systemową |
| `userId` | String? | Właściciel (null dla systemowych) |

#### `Expense` — Wydatek
| Pole | Typ | Opis |
|---|---|---|
| `id` | String (CUID) | Unikalny identyfikator |
| `amount` | Decimal(10,2) | Kwota w oryginalnej walucie |
| `currency` | String | Waluta transakcji |
| `amountInBase` | Decimal(10,2) | Kwota przeliczona na PLN |
| `exchangeRate` | Decimal(12,6) | Kurs wymiany użyty do przeliczenia |
| `date` | DateTime | Data transakcji |
| `description` | String? | Opis (opcjonalny) |
| `userId` | String | Właściciel wydatku |
| `categoryId` | String | Przypisana kategoria |

#### `Budget` — Limit budżetowy
| Pole | Typ | Opis |
|---|---|---|
| `id` | String (CUID) | Unikalny identyfikator |
| `month` | Int | Miesiąc (1–12) |
| `year` | Int | Rok |
| `limitAmount` | Decimal(10,2) | Kwota limitu w PLN |
| `userId` | String | Właściciel budżetu |

---

## Dokumentacja API

### Uwierzytelnianie

Wszystkie endpointy (z wyjątkiem `/api/auth/*`) wymagają tokenu JWT.  
Token przekazywany jest automatycznie w cookie `token` przez middleware Next.js, który wstrzykuje `x-user-id` do nagłówków żądania.

**Kody błędów autoryzacji:**
- `401 Unauthorized` — brak lub nieprawidłowy token
- `403 Forbidden` — brak uprawnień do zasobu

---

### Autentykacja

#### `POST /api/auth/register` — Rejestracja użytkownika

**Body:**
```json
{
  "email": "jan.kowalski@example.com",
  "password": "haslo1234"
}
```

**Odpowiedź `201 Created`:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clx1abc123",
    "email": "jan.kowalski@example.com"
  }
}
```

**Błędy:**
| Kod | Komunikat |
|---|---|
| `400` | `"Pola email i hasło są wymagane"` |
| `400` | `"Hasło musi mieć co najmniej 8 znaków"` |
| `409` | `"Użytkownik z tym adresem email już istnieje"` |

---

#### `POST /api/auth/login` — Logowanie użytkownika

**Body:**
```json
{
  "email": "jan.kowalski@example.com",
  "password": "haslo1234"
}
```

**Odpowiedź `200 OK`:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clx1abc123",
    "email": "jan.kowalski@example.com"
  }
}
```

**Błędy:**
| Kod | Komunikat |
|---|---|
| `400` | `"Pola email i hasło są wymagane"` |
| `401` | `"Nieprawidłowy email lub hasło"` |

---

### Profil użytkownika

#### `GET /api/user/profile` — Pobierz dane profilu

**Odpowiedź `200 OK`:**
```json
{
  "email": "jan.kowalski@example.com",
  "firstName": "Jan",
  "lastName": "Kowalski",
  "currency": "PLN",
  "createdAt": "2025-01-15T10:00:00.000Z",
  "updatedAt": "2025-06-01T12:30:00.000Z"
}
```

---

#### `PUT /api/user/profile` — Aktualizuj profil użytkownika

**Body (wszystkie pola opcjonalne):**
```json
{
  "firstName": "Jan",
  "lastName": "Kowalski",
  "currency": "EUR",
  "currentPassword": "stareHaslo123",
  "newPassword": "noweHaslo456"
}
```

**Odpowiedź `200 OK`:**
```json
{
  "email": "jan.kowalski@example.com",
  "firstName": "Jan",
  "lastName": "Kowalski",
  "currency": "EUR",
  "createdAt": "2025-01-15T10:00:00.000Z",
  "updatedAt": "2025-06-12T19:00:00.000Z"
}
```

**Błędy:**
| Kod | Komunikat |
|---|---|
| `400` | `"Kod waluty musi składać się z dokładnie 3 znaków"` |
| `400` | `"Aktualne hasło jest wymagane do ustawienia nowego hasła"` |
| `400` | `"Nowe hasło musi mieć co najmniej 8 znaków"` |
| `401` | `"Aktualne hasło jest niepoprawne"` |

---

### Wydatki

#### `GET /api/expenses` — Pobierz listę wydatków

**Parametry zapytania (opcjonalne):**
| Parametr | Typ | Opis |
|---|---|---|
| `categoryId` | String | Filtruj po kategorii |
| `startDate` | String (ISO 8601) | Data początkowa zakresu |
| `endDate` | String (ISO 8601) | Data końcowa zakresu |
| `minAmount` | Number | Minimalna kwota |
| `maxAmount` | Number | Maksymalna kwota |

**Przykładowe zapytanie:**
```
GET /api/expenses?categoryId=clx1cat1&startDate=2025-06-01&endDate=2025-06-30&minAmount=10
```

**Odpowiedź `200 OK`:**
```json
[
  {
    "id": "clx1exp123",
    "amount": "49.99",
    "currency": "PLN",
    "amountInBase": "49.99",
    "exchangeRate": "1.000000",
    "date": "2025-06-10T00:00:00.000Z",
    "description": "Zakupy spożywcze",
    "userId": "clx1abc123",
    "categoryId": "clx1cat1",
    "createdAt": "2025-06-10T12:00:00.000Z",
    "updatedAt": "2025-06-10T12:00:00.000Z",
    "category": {
      "id": "clx1cat1",
      "name": "Jedzenie",
      "isSystem": true,
      "userId": null
    }
  }
]
```

---

#### `POST /api/expenses` — Utwórz wydatek

**Body:**
```json
{
  "amount": 49.99,
  "date": "2025-06-10",
  "categoryId": "clx1cat1",
  "description": "Zakupy spożywcze",
  "currency": "PLN"
}
```

> Obsługiwane waluty: `PLN`, `EUR`, `USD`, `GBP`, `CHF`, `NOK`.  
> Dla walut innych niż PLN kurs pobierany jest automatycznie z API NBP.

**Odpowiedź `201 Created`:**
```json
{
  "id": "clx1exp123",
  "amount": "49.99",
  "currency": "PLN",
  "amountInBase": "49.99",
  "exchangeRate": "1.000000",
  "date": "2025-06-10T00:00:00.000Z",
  "description": "Zakupy spożywcze",
  "userId": "clx1abc123",
  "categoryId": "clx1cat1",
  "createdAt": "2025-06-10T12:00:00.000Z",
  "updatedAt": "2025-06-10T12:00:00.000Z",
  "category": { "id": "clx1cat1", "name": "Jedzenie", "isSystem": true, "userId": null }
}
```

**Błędy:**
| Kod | Komunikat |
|---|---|
| `400` | `"Kwota musi być liczbą większą od zera"` |
| `400` | `"Nieprawidłowa data"` |
| `400` | `"Kategoria jest wymagana"` |
| `400` | `"Nieobsługiwana waluta"` |
| `400` | `"Wybrana kategoria nie istnieje"` |
| `400` | `"Nie udało się pobrać kursu waluty"` |

---

#### `GET /api/expenses/:id` — Pobierz pojedynczy wydatek

**Odpowiedź `200 OK`:** — obiekt wydatku (jak wyżej)

**Błędy:** `401`, `403 Forbidden`, `404 Not Found`

---

#### `PUT /api/expenses/:id` — Zaktualizuj wydatek

**Body (wszystkie pola opcjonalne):**
```json
{
  "amount": 55.00,
  "date": "2025-06-11",
  "categoryId": "clx1cat2",
  "description": "Zaktualizowany opis",
  "currency": "EUR"
}
```

**Odpowiedź `200 OK`:** — zaktualizowany obiekt wydatku

**Błędy:** `400`, `401`, `403`, `404`

---

#### `DELETE /api/expenses/:id` — Usuń wydatek

**Odpowiedź `200 OK`:**
```json
{ "success": true }
```

**Błędy:** `401`, `403`, `404`

---

### Kategorie

#### `GET /api/categories` — Pobierz listę kategorii

Zwraca kategorie systemowe oraz kategorie własne zalogowanego użytkownika.

**Odpowiedź `200 OK`:**
```json
[
  { "id": "clx1cat1", "name": "Jedzenie", "isSystem": true, "userId": null },
  { "id": "clx1cat2", "name": "Transport", "isSystem": true, "userId": null },
  { "id": "clx1cat9", "name": "Moje hobby", "isSystem": false, "userId": "clx1abc123" }
]
```

---

#### `POST /api/categories` — Utwórz własną kategorię

**Body:**
```json
{ "name": "Moje hobby" }
```

**Odpowiedź `201 Created`:**
```json
{ "id": "clx1cat9", "name": "Moje hobby", "isSystem": false, "userId": "clx1abc123" }
```

**Błędy:**
| Kod | Komunikat |
|---|---|
| `400` | `"Nazwa kategorii jest wymagana"` |
| `400` | `"Kategoria o podanej nazwie już istnieje"` |

---

#### `DELETE /api/categories/:id` — Usuń własną kategorię

Nie można usunąć kategorii systemowych ani kategorii z przypisanymi wydatkami.

**Odpowiedź `200 OK`:**
```json
{ "success": true }
```

**Błędy:**
| Kod | Komunikat |
|---|---|
| `400` | `"Nie można usunąć kategorii systemowej"` |
| `400` | `"Nie można usunąć kategorii, ponieważ zawiera przypisane wydatki"` |
| `403` | `"Brak uprawnień do usunięcia tej kategorii"` |
| `404` | `"Kategoria nie istnieje"` |

---

### Budżety i limity

#### `GET /api/budgets` — Pobierz listę budżetów

**Parametry zapytania (opcjonalne):**
| Parametr | Typ | Opis |
|---|---|---|
| `month` | Int (1–12) | Filtruj po miesiącu |
| `year` | Int | Filtruj po roku |

**Odpowiedź `200 OK`:**
```json
[
  {
    "id": "clx1bud1",
    "month": 6,
    "year": 2025,
    "limitAmount": "3000.00",
    "userId": "clx1abc123",
    "categoryId": null,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "updatedAt": "2025-06-01T00:00:00.000Z",
    "category": null
  }
]
```

---

#### `POST /api/budgets` — Utwórz lub zaktualizuj limit budżetowy

Jeśli limit dla danego miesiąca/roku/kategorii już istnieje, zostaje zaktualizowany.

**Body:**
```json
{
  "month": 6,
  "year": 2025,
  "limitAmount": 3000.00,
  "categoryId": null
}
```

> `categoryId: null` — limit ogólny dla całego miesiąca.  

**Odpowiedź `201 Created` (lub `200 OK` przy aktualizacji):**
```json
{
  "id": "clx1bud1",
  "month": 6,
  "year": 2025,
  "limitAmount": "3000.00",
  "userId": "clx1abc123",
  "categoryId": null,
  "category": null
}
```

**Błędy:**
| Kod | Komunikat |
|---|---|
| `400` | `"Miesiąc musi być liczbą od 1 do 12"` |
| `400` | `"Rok musi być liczbą"` |
| `400` | `"Kwota limitu musi być liczbą większą od zera"` |
| `400` | `"Wybrana kategoria nie istnieje"` |

---

#### `GET /api/budgets/:id` — Pobierz pojedynczy budżet

**Odpowiedź `200 OK`:** — obiekt budżetu (jak wyżej)

**Błędy:** `401`, `403`, `404`

---

#### `PUT /api/budgets/:id` — Zaktualizuj limit budżetowy

**Body:**
```json
{ "limitAmount": 3500.00 }
```

**Odpowiedź `200 OK`:** — zaktualizowany obiekt budżetu

---

#### `DELETE /api/budgets/:id` — Usuń limit budżetowy

**Odpowiedź `200 OK`:**
```json
{ "success": true }
```

---

### Statystyki budżetowe

#### `GET /api/budgets/stats` — Pobierz statystyki miesięczne

Zwraca zestawienie wydatków względem budżetu dla danego miesiąca, z podziałem na kategorie.

**Parametry zapytania (opcjonalne):**
| Parametr | Typ | Opis |
|---|---|---|
| `month` | Int (1–12) | Miesiąc (domyślnie: bieżący) |
| `year` | Int | Rok (domyślnie: bieżący) |

**Przykładowe zapytanie:**
```
GET /api/budgets/stats?month=6&year=2025
```

**Odpowiedź `200 OK`:**
```json
{
  "month": 6,
  "year": 2025,
  "totalSpent": 1850.50,
  "totalBudget": 3000.00,
  "percentage": 61.68,
  "categories": [
    {
      "categoryId": "clx1cat1",
      "categoryName": "Jedzenie",
      "spent": 650.00,
      "budget": 800.00,
      "percentageOfCategoryBudget": 81.25,
      "percentageOfTotalSpent": 35.12
    },
    {
      "categoryId": "clx1cat2",
      "categoryName": "Transport",
      "spent": 300.00,
      "budget": null,
      "percentageOfCategoryBudget": null,
      "percentageOfTotalSpent": 16.21
    }
  ]
}
```

**Opis pól odpowiedzi:**
| Pole | Opis |
|---|---|
| `totalSpent` | Suma wszystkich wydatków miesiąca (w PLN) |
| `totalBudget` | Ogólny limit miesięczny (null jeśli nie ustawiony) |
| `percentage` | Procent wykorzystania ogólnego budżetu |
| `categories[].spent` | Suma wydatków w danej kategorii (w PLN) |
| `categories[].budget` | Limit kategorii (null jeśli nie ustawiony) |
| `categories[].percentageOfCategoryBudget` | % wykorzystania limitu kategorii |
| `categories[].percentageOfTotalSpent` | Udział kategorii w łącznych wydatkach |

---

## Bezpieczeństwo

- **Haszowanie haseł** — algorytm bcrypt (salt rounds = 10)
- **JWT** — tokeny podpisane tajnym kluczem, weryfikowane przez Next.js Middleware przed każdym żądaniem
- **Izolacja danych** — każdy użytkownik ma dostęp wyłącznie do swoich zasobów (weryfikacja `userId` na poziomie API)
- **Walidacja danych wejściowych** — każdy endpoint waliduje typy i zakresy parametrów przed przetworzeniem

---