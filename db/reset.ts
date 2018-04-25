import mongoose from 'mongoose';
import { promisify } from 'bluebird';
import { createUser } from '../src/models/User';

(async () => {
  await mongoose.connect('mongodb://localhost/voting-app-testing');

  createUser();
  const User = mongoose.model('User');

  const remove = promisify(User.remove, { context: User });
  await remove();

  console.log('User collection removed');
  await mongoose.connection.close();
})();
