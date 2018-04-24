import moment from 'moment';

const dump = (obj: any) => JSON.stringify(obj, null, 2);

const capitalize = text => text.replace(/(?:^|\s)\S/g, a => a.toUpperCase());

export const pugHelpers = {
  moment,
  dump,
  capitalize,
};
