import { query } from 'express-validator';

export const getMoviesValidation = [
  query('id')
    .isString().withMessage('Movie ID must be a string of comma-separated values.')
    .custom((value) => {
      // Split the ID string by comma and ensure each ID is a number
      const ids: string[] = value.split(',');
      return ids.every((id) => !Number.isNaN(Number(id)));
    }).withMessage('Each movie ID must be a number.'),
];


