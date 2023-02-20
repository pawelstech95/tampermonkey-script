import { marked } from 'marked';
import {
  findNoteForDeveloper,
  getFittedChart,
  getUserUuid,
  shouldShowOnlyBenchDevelopers,
} from './utils';
import { createOrUpdateTableColumn } from './table-ui';
import { PrimetricApiService } from './primetric-api-service';
import { createEditableColumn } from './data-table-edit';

export async function updateDataTableRows(host: string, table: HTMLElement) {
  const input = table.querySelector('.toggleElement-input') as HTMLInputElement;
  const developers = await PrimetricApiService.getInstance().getDevelopers(
    host
  );

  const initialLoader = table.querySelector(
    `[data-element-name="InitialLoader"]`
  );

  table
    .querySelectorAll<HTMLTableRowElement>('tbody tr')
    .forEach((tableRow) => {
      const uuid = getUserUuid(tableRow);
      const note = findNoteForDeveloper(uuid, developers);
      const splittedStringForAvailCol = note.split('\n')[0];

      const fittedChart = getFittedChart(splittedStringForAvailCol) || '-';

      const parsedNote = note.replace(`[${fittedChart}]`, '');

      createOrUpdateTableColumn(
        tableRow,
        'avail',
        uuid,
        fittedChart,
        fittedChart
      );
      createOrUpdateTableColumn(
        tableRow,
        'notes',
        uuid,
        marked.parse(parsedNote),
        parsedNote
      );
      createEditableColumn(host, table, tableRow, uuid, note, fittedChart);

      shouldShowOnlyBenchDevelopers(input, table, developers, tableRow, uuid);
    });
  initialLoader && initialLoader.remove();
}
