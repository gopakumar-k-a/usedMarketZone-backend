import { Server } from 'http';
import config from '../../config';

const serverConfig = (server: Server) => {
  return {
    startServer: () => {
      const PORT = config.PORT;
      server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    }
  };
};

export default serverConfig;
