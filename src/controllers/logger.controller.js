import logger from '../services/logger.js';

export const getLoggerController = async (req, res) => {
  logger.debug('Debug');
  logger.http('Http');
  logger.info('Info');
  logger.warning('Warning');
  logger.error('Error');
  logger.fatal('Fatal');
  res.json({ status: 'success' });
};
