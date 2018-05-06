// Catch async/await errors instead of using a try block
export const catchAsyncErrors = fn => {
  return function(req, res, next) {
    return fn(req, res, next).catch(next);
  };
};
