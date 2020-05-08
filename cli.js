import { argv } from 'yargs';

import { generateQuote, generateQuotes } from './generators'

const {
  filename,
  text,
  caption,
  src,
  dist,
  opts,
} = argv;

export const start = () =>
  filename
    ? generateQuote(filename, text, caption, src, dist, opts)
    : generateQuotes(src, dist, opts);

start();
