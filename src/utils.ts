export function getUserIdsFromTable(tableSelector: HTMLElement) {
  const tableUuid: string[] = [];
  tableSelector
    .querySelectorAll<HTMLTableRowElement>('tbody tr')
    .forEach((rowSelector) => {
      const uuid = getUserUuid(rowSelector);

      if (uuid) {
        tableUuid.push(uuid);
      }
    });

  return tableUuid;
}

export function getUserUuid(rowSelector: HTMLTableRowElement) {
  return rowSelector
    .querySelector('td:first-child a')
    ?.getAttribute('href')
    ?.split('/')[2];
}

export function getCookie(name: string): string {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}
