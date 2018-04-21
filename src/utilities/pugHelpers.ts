import moment from 'moment';

const dump = (obj: any) => JSON.stringify(obj, null, 2);

export default {
  moment,
  dump,
};
