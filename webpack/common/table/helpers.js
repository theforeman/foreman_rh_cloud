export const getPerPageOptions = (urlPerPage, appPerPage) => {
  const initialValues = new Set([5, 10, 15, 25, 50]);
  initialValues.add(appPerPage);
  urlPerPage && initialValues.add(urlPerPage);
  const options = [...initialValues].sort((a, b) => a - b);
  return options.map(value => ({ title: value.toString(), value }));
};
