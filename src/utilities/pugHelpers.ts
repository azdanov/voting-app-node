import md5 from "md5";
import moment from "moment";

const dump = (obj: any) => JSON.stringify(obj, null, 2);

const capitalize = text => text.replace(/(?:^|\s)\S/g, a => a.toUpperCase());

const chooseClass = (warnings, values, field) => {
  if (/^password/.test(field)) {
    return warnings && (warnings["password"] || warnings["passwordRepeat"])
      ? "is-danger"
      : "";
  }

  return warnings && warnings[field]
    ? "is-danger"
    : values && values[field]
      ? "is-success"
      : "";
};

export const pugHelpers = {
  moment,
  md5,
  dump,
  capitalize,
  chooseClass
};
