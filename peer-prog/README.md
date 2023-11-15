
# Movie ticket booking system.

## Requirements


* [movie] get a list of movies with their id, title and year by providing a list of their IDs (e.g., /movies?id=133093,816692 should return 2 movies with these IDs, if they exist)
* [screening] get a list of screenings available for booking. Screenings should include session information (timestamp, number of tickets, number of tickets left) and movies: (title and year).
* [tickets] get a list of bookings (tickets) they have booked
* [screening] create a booking (ticket) for movie screening that has some tickets left

In production mode:

```bash
npm run start
```

## Updating types

If you make changes to the database schema, you will need to update the types. You can do this by running the following command:

```bash
npm run generate-types
```
