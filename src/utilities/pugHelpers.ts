import moment from 'moment';

const dump = (obj: any) => JSON.stringify(obj, null, 2);

const capitalize = text => text.replace(/(?:^|\s)\S/g, a => a.toUpperCase());

const chooseClass = (warnings, values, field) =>
  warnings && warnings[field]
    ? 'is-danger'
    : values && values[field]
      ? 'is-success'
      : '';

export const pugHelpers = {
  moment,
  dump,
  capitalize,
  chooseClass,
};
