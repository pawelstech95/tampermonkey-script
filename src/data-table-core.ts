import { marked } from 'marked';
import { getUserUuid } from './utils';
import { createOrUpdateTableColumn } from './table-ui';
import { Developer, PrimetricApiService } from './primetric-api-service';

export async function updateDataTableRows(host: string, table: HTMLElement) {
  const developers = await PrimetricApiService.getInstance().getDevelopers(
    host
  );

  table
    .querySelectorAll<HTMLTableRowElement>('tbody tr')
    .forEach((tableRow) => {
      const uuid = getUserUuid(tableRow);
      const note = findNoteForDeveloper(uuid, developers);

      // removeTableColumn(tableRow, 2);
      createOrUpdateTableColumn(
        tableRow,
        'notes',
        uuid,
        marked.parse(note),
        note
      );

      createEditableColumn(host, table, tableRow, uuid, note);
    });
}

function createEditableColumn(
  host: string,
  table: HTMLElement,
  tableRow: HTMLTableRowElement,
  uuid: string,
  note: string
) {
  const button = document.createElement('button');
  button.innerHTML = `<i class="pri-icon" style="font-size: 16px;"><svg data-v-273726f4="" height="1em" stroke="currentColor" viewBox="0 0 14 14" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M9.31276 2.96313L11.0372 4.68755L4.9201 10.8046L3.19568 9.08021L9.31276 2.96313Z"></path><path d="M3.19541 9.08008L2.33334 11.6667L4.91997 10.8046L3.19541 9.08008Z"></path><path d="M11.037 4.68717L9.31287 2.96302L9.60023 2.67566C9.8302 2.45355 10.1382 2.33064 10.4579 2.33342C10.7776 2.3362 11.0835 2.46444 11.3095 2.69051C11.5356 2.91659 11.6638 3.22242 11.6666 3.54212C11.6694 3.86183 11.5465 4.16984 11.3244 4.39981L11.037 4.68717Z"></path></svg></i>`;
  button.type = 'button';
  button.className =
    'p-button p-component p-button-icon-only p-button-primary p-button-text pri-button pri-button--lg';

  button.addEventListener('click', () => {
    handleEditButtonClick(host, table, tableRow, uuid, note);
  });

  createOrUpdateTableColumn(tableRow, 'edit', uuid, button);
}

function handleEditButtonClick(
  host: string,
  table: HTMLElement,
  tableRow: HTMLTableRowElement,
  uuid: string,
  note: string
) {
  const textarea = document.createElement('textarea');
  textarea.value = note;

  createOrUpdateTableColumn(tableRow, 'notes', uuid, textarea);

  textarea.focus();

  textarea.addEventListener('blur', async (event: any) => {
    createOrUpdateTableColumn(
      tableRow,
      'notes',
      uuid,
      marked.parse(event.target.value),
      event.target.value
    );

    if (note === event.target.value) {
      return;
    }

    await PrimetricApiService.getInstance().updateDeveloperNotes(
      host,
      uuid,
      event.target.value
    );

    await updateDataTableRows(host, table);
  });
}

function findNoteForDeveloper(uuid: string, developers: Developer[]): string {
  return (
    developers.find((developer) => developer.uuid === uuid)?.note ??
    'Developer not found, for some reason, they are not exist in the developer array'
  );
}
