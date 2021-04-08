export const modifyRows = hits => {
  if (hits.length === 0) return [];

  return hits
    .asMutable()
    .map(({ id, hostname, title, resolutions, reboot }) => ({
      cells: [hostname, title, resolutions[0].description, reboot],
      id,
    }));
};
