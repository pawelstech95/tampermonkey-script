import { Developer } from './primetric-api-service';

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

export function getFittedChart(initialString: string) {
  return (
    initialString.lastIndexOf(']') !== -1 &&
    initialString.substring(
      initialString.indexOf('[') + 1,
      initialString.lastIndexOf(']')
    )
  );
}

function getOnlyBenchDevelopers(developers: Developer[]) {
  const tableOnlyBenchDevelopers: Developer[] = [];

  developers.filter((developer) => {
    const splitedNoteWithFittedChart = developer.note.split('\n')[0];
    const fittedChart = getFittedChart(splitedNoteWithFittedChart);

    if (!!fittedChart) tableOnlyBenchDevelopers.push(developer);
  });
  return tableOnlyBenchDevelopers;
}

export const shouldShowOnlyBenchDevelopers = (
  input: HTMLInputElement,
  table: HTMLElement,
  developers: Developer[],
  tableRow: HTMLTableRowElement,
  uuid: string
) => {
  const onlyBenchDevelopers = getOnlyBenchDevelopers(developers);
  const foundDeveloper = onlyBenchDevelopers.find(
    (developerOnBench) => developerOnBench.uuid === uuid
  );

  const isChecked = input.checked;
  const shouldShowRow =
    !isChecked ||
    (foundDeveloper && uuid && tableRow && uuid === foundDeveloper.uuid);
  tableRow.classList.toggle('developers-to-hidden', !shouldShowRow);
};

export function getCookie(name: string): string {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

export function findNoteForDeveloper(
  uuid: string,
  developers: Developer[]
): string {
  return (
    developers.find((developer) => developer.uuid === uuid)?.note ??
    'Developer not found, for some reason, they are not exist in the developer array'
  );
}
