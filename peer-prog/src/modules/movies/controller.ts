import { Router } from 'express';
import { jsonRoute } from '@/utils/middleware';
import BadRequest from '@/utils/errors/BadRequest';
import NotFound from '@/utils/errors/NotFound';
import type { Database } from '@/database';
import buildRespository from './repository';

export default (db: Database) => {
  const messages = buildRespository(db);
  const router = Router();

  router.get(
    '/',
    jsonRoute(async req => {
      const stringIds = req.query.id;

      if (stringIds && typeof stringIds === 'string') {
        const ids = stringIds.split(',').map(id => {
          const parsedId = parseInt(id, 10); 
          if (!Number.isInteger(parsedId)) {
            throw new BadRequest('Movie ID must be of numeric type.');
          }
        
          return parsedId;
        });
        

        const movies = await messages.findByIds(ids);

        if (movies.length === 0)
          throw new NotFound('No movie can be found in the database');
        return movies;
      }
      throw new BadRequest('Movie ID is required.');
    })
  );

  return router;
};
