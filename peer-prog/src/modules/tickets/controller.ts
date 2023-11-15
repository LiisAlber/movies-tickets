import { Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import type { Database } from '@/database'
import { jsonRoute } from '@/utils/middleware'
import buildRespository from './repository'
import buildScreeningsRepository from '@/modules/screenings/repository'

export default (db: Database) => {
  const tickets = buildRespository(db)
  const screenings = buildScreeningsRepository(db)
  const router = Router()

  router
    .route('/')
    .get(
      jsonRoute(async (req, res) => {
        try {
          const allTicketsData = await tickets.findAll()

          if (!allTicketsData) {
            return res
              .status(StatusCodes.NOT_FOUND)
              .json({ error: 'No tickets found.' })
          }

          return res.status(StatusCodes.OK).json(allTicketsData)
        } catch (error) {
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error })
        }
      })
    )
    .post(
      jsonRoute(async (req, res) => {
        try {
          const { userId, movieId, screeningId, numTickets } = req.body

          // check available tickets
          const [screeningsData] = await screenings.findAll()

          if (
            !screeningsData ||
            screeningsData.numberOfTicketsLeft < numTickets
          ) {
            return res.status(StatusCodes.NOT_FOUND).json({
              message: 'Booking is SOLD OUT',
            })
          }

          const updateScreeningsTicketNum: number =
            screeningsData.numberOfTicketsLeft - numTickets

          await screenings.update(screeningId, {
            numberOfTicketsLeft: updateScreeningsTicketNum,
          })

          const currentDate = new Date()
          const bookingTimestamp = currentDate.toISOString()

          await tickets.create({
            userId,
            movieId,
            screeningId,
            numTickets,
            bookingTimestamp,
          })

          // successfull message
          return res
            .status(StatusCodes.CREATED)
            .json({ message: 'Booked successfully!' })
        } catch (error) {
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error })
        }
      })
    )

  return router
}