import { Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import type { Database } from '@/database'
import { jsonRoute } from '@/utils/middleware'
import buildRespository from './repository'
import buildScreeningsRepository from '@/modules/screenings/repository'

export default (db: Database) => {
  const tickets = buildRespository(db);
  const screenings = buildScreeningsRepository(db);
  const router = Router();

  router.get('/', jsonRoute(async (req, res, next) => {
    try {
      const allTicketsData = await tickets.findAll();
      if (allTicketsData.length === 0) {
        res.status(StatusCodes.NOT_FOUND).json({ message: 'No tickets found.' });
      } else {
        res.status(StatusCodes.OK).json(allTicketsData);
      }
    } catch (error) {
      next(error);
    }
  }));

  router.post('/', jsonRoute(async (req, res, next) => {
    try {
      const { userId, movieId, screeningId, total } = req.body;
      const screeningData = await screenings.findById(screeningId);

      if (!screeningData || screeningData.numberOfTicketsLeft < total) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: 'Not enough tickets available.' });
      } else {
        const updateScreeningsTicketNum = screeningData.numberOfTicketsLeft - total;
        await screenings.update(screeningId, { numberOfTicketsLeft: updateScreeningsTicketNum });

        const currentDate = new Date();
        const bookingTimestamp = currentDate.toISOString();

        await tickets.create({ userId, movieId, screeningId, total, bookingTimestamp });
        res.status(StatusCodes.CREATED).json({ message: 'Booked successfully!' });
      }
    } catch (error) {
      next(error);
    }
  }));

  return router;
}