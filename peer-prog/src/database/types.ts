import type { ColumnType } from "kysely";
import { Insertable, Selectable, Updateable } from 'kysely';

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export interface Bookings {
  screeningId: number;
  userId: number;
  row: string;
  seat: number;
  booked: string;
}

export interface Directors {
  movieId: number;
  personId: number;
}

export interface Movies {
  id: number | null;
  title: string;
  year: number | null;
}

export interface People {
  id: number | null;
  name: string;
  birth: number | null;
}

export interface Ratings {
  movieId: number;
  rating: number;
  votes: number;
}

export interface Screenings {
  id: Generated<number>;
  timestamp: string;
  movieId: number;
  created: string | null;
  updated: string | null;
}

export interface Stars {
  movieId: number;
  personId: number;
}

export interface Users {
  id: Generated<number>;
  username: string;
  created: string | null;
  updated: string | null;
}

export interface DB {
  bookings: Bookings;
  directors: Directors;
  movies: Movies;
  people: People;
  ratings: Ratings;
  screenings: Screenings;
  stars: Stars;
  users: Users;
}

export type UserRow = Users;
export type UserRowWithoutId = Omit<UserRow, 'id'>;
export type UserRowInsert = Insertable<UserRowWithoutId>;
export type UserRowUpdate = Updateable<UserRowWithoutId>;
export type UserRowSelect = Selectable<UserRow>;

export interface Ticket {
  username: string;
  screeningId: number;
  timestamp: string;
  movieTitle: string;
  row: string;
  seat: number;
  booked: string;
}

export interface Seats {
  row: string;
  seat: number;
  booked: string;
}

export interface Booking {
  screeningId: number;
  movieTitle: string;
  timestamp: string;
  tickets: {
  total: number;
  seats: Seats[];
  };
}

export interface BookingList {
  username: string;
  bookings: Booking[];
}
