import { Database, Booking, BookingList, Ticket } from '@/database';
import buildRepository from './repository';
import NotFound from '@/utils/errors/NotFound';
import BadRequest from '@/utils/errors/BadRequest';

const validateId = (userId: number): number => {
  if (!Number.isInteger(userId)) {
    throw new BadRequest('Please provide a numeric user ID.');
  }

  return userId;
};

const addScreenings = (bookings: Booking[], tickets: Ticket[]): void => {
  tickets.filter(ticket => {
    if (!bookings.some(el => el.movieTitle === ticket.movieTitle)) {
      bookings.push({
        screeningId: ticket.screeningId,
        movieTitle: ticket.movieTitle,
        timestamp: ticket.timestamp,
        tickets: {
          total: 0,
          seats: [],
        },
      });
    }
    return true;
  });
};

const addSeats = (bookings: Booking[], tickets: Ticket[]): void => {
  bookings.forEach(booking => {
    tickets.forEach(ticket => {
      if (ticket.screeningId === booking.screeningId) {
        const updatedBooking = { ...booking };

        updatedBooking.tickets.total += 1;

        updatedBooking.tickets.seats.push({
          row: ticket.row,
          seat: ticket.seat,
          booked: ticket.booked,
        });

        Object.assign(booking, updatedBooking);
      }
    });
  });
};

export default (db: Database) => ({
  repository: buildRepository(db),

  async getTicketsByUserId(userId: number): Promise<BookingList> {
    const id = validateId(userId);

    const user = await this.repository.getUserById(id);
    if (!user) {
      throw new NotFound(`User with id ${userId} does not exist.`);
    }
    const tickets = await this.repository.getTicketsByUserId(id);

    const bookings: Booking[] = [];

    addScreenings(bookings, tickets);

    addSeats(bookings, tickets);

    return {
      username: user.username,
      bookings,
    };
    
  },
});
