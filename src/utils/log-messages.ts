export const messageLog = (message: string, type?: 'warning' | 'success' | 'info' | 'error') => {
  switch (type) {
    case 'success':
      console.info('\x1b[32m%s\x1b[0m', message);
      return;
    case 'info':
      console.info('\x1b[34m%s\x1b[0m', message);
      return;
    case 'warning':
      console.warn('\x1b[33m%s\x1b[0m', message);
      return;
    case 'error':
      console.error('\x1b[31m%s\x1b[0m', message);
      return;
    default:
      console.info(message);
  }
};
