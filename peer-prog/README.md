
# Movie ticket booking system.

## Requirements

### User:
* [movie] get a list of movies with their id, title and year by providing a list of their IDs (e.g., /movies?id=133093,816692 should return 2 movies with these IDs, if they exist)

Example GET request:  /movies?id=133093,816692

* [screening] get a list of screenings available for booking. Screenings should include session information (timestamp, number of tickets, number of tickets left) and movies: (title and year).

Example GET request: /screenings

* [tickets] get a list of bookings (tickets) they have booked

Example GET request: /tickets

* [screening] create a booking (ticket) for movie screening that has some tickets left

Example POST request:
/tickets
{
  "userId": 3,
  "movieId": 133094,
  "screeningId": 2,
  "total": 2
}

### Admin:
* [screening] create new viewing screenings for watching a movie that has a timestamp and a provided allocation of tickets

In production mode:

```bash
npm run start
```

## Updating types

If you make changes to the database schema, you will need to update the types. You can do this by running the following command:

```bash
npm run generate-types
```
