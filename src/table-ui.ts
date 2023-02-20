import { updateDataTableRows } from './data-table-core';

export function createInitialLoaderElement(table: HTMLElement) {
  if (!table.querySelector('[data-element-name="InitialLoader"]')) {
    const initialLoader = document.createElement('div');
    initialLoader.dataset.elementName = 'InitialLoader';

    initialLoader.innerHTML = `<div data-v-a96eea42="" data-v-cba7217e="" class="loader__wrapper" data-v-b871a41c=""><div data-v-a96eea42="" class="loader__inner" style="top: 0px;"><div data-v-a96eea42="" class="loader__icon" style="margin-top: 0px;"><i data-v-6b0c4438="" data-v-a96eea42="" class="pri-icon animation--rotate pri-refresh" style="font-size: 60px;"><svg data-v-6b0c4438="" height="1em" stroke="currentColor" viewBox="0 0 14 11" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M10.3766 8.96934C11.2743 8.13044 11.8267 6.98685 11.926 5.76222C12.0252 4.53759 11.664 3.31999 10.9131 2.34752C10.1622 1.37506 9.07552 0.717667 7.86561 0.503906" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
<path d="M3.62335 4.07057V1.73291H1.28569" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
<path d="M10.3766 6.66797V9.00563H12.7143" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
<path d="M3.62338 1.77075C2.72447 2.61192 2.17242 3.75869 2.07558 4.98597C1.97874 6.21325 2.34411 7.43241 3.09997 8.40415C3.85582 9.37589 4.94758 10.03 6.16095 10.2382" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
</svg></i></div><div data-v-a96eea42="" class="loader__content"></div></div></div>`;

    table.appendChild(initialLoader);
  }
}

export function createToggleInputElement(host: string, table: HTMLElement) {
  if (!table.querySelector('[data-element-name="ToggleOnlyBench"]')) {
    const inputToggleElement = document.createElement('div');
    inputToggleElement.dataset.elementName = 'ToggleOnlyBench';

    const priPaginator = table.querySelector('.pri-paginator');

    if (priPaginator) {
      priPaginator.parentNode.insertBefore(inputToggleElement, priPaginator);
      inputToggleElement.innerHTML = `<label class="toggleElement-label"><input class="toggleElement-input"  type="checkbox" ><span class="checkmark"></span><span class='toggleContent-span'> Only Bench </span></label>`;
    }

    inputToggleElement.addEventListener('click', () =>
      updateDataTableRows(host, table)
    );
  }
}

export function createTableHeader(table: HTMLElement, headerName: string) {
  if (!table.querySelector(`thead th[data-header-name=${headerName}]`)) {
    const th = document.createElement('th');
    th.textContent = headerName;
    th.dataset.headerName = headerName;

    table.querySelector(`thead tr`).appendChild(th);
  }
}

export function createOrUpdateTableColumn(
  tableRow: HTMLTableRowElement,
  columnName: string,
  userUuid: string,
  content: string | HTMLElement,
  title?: string
) {
  let existingColumn = tableRow.querySelector<HTMLTableCellElement>(
    `td[data-column-name=${columnName}]`
  );

  if (!existingColumn) {
    existingColumn = document.createElement('td');
    existingColumn.dataset.columnName = columnName;

    tableRow.appendChild(existingColumn);
  }

  existingColumn.dataset.userUuid = userUuid;

  if (typeof content === 'string') {
    existingColumn.innerHTML = content;
  } else {
    existingColumn.replaceChildren(content);
  }

  if (title) {
    existingColumn.setAttribute('title', title);
  } else {
    existingColumn.removeAttribute('title');
  }
}
