export function createTableHeader(table: HTMLElement, headerName: string) {
  if (!table.querySelector(`thead th[data-header-name=${headerName}]`)) {
    const th = document.createElement('th');
    th.textContent = headerName;
    th.dataset.headerName = headerName;

    table.querySelector(`thead tr`).appendChild(th);
  }
}
export function removeTableHeader(table: HTMLElement, headerName: string) {
  if (table.querySelector(`thead th [title="${headerName}"]`)) {
    const elementHeader = table.querySelector(
      `thead th [title="${headerName}"]`
    ).parentNode.parentNode;

    elementHeader.parentNode.removeChild(elementHeader);
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

export function removeTableColumn(
  tableRow: HTMLTableRowElement,
  index: number
) {
  let existingColumn =
    tableRow.querySelectorAll<HTMLTableCellElement>(`td.pri-table-cell`)[index];

  if (!existingColumn) return;

  existingColumn.remove();
}

export const loadStylesheet = () => {
  const styleElement = document.createElement('style');
  styleElement.textContent = `
  .pri-table__inner{
    width: 100% !important;
  }
  
  .reports-availability-table .pri-table-header tr th:nth-child(3), .reports-availability-table tr td.pri-table-cell:nth-child(3){
    display: none;
  }  
  
  .reports-availability-table td {
    overflow: hidden;
    position: relative;
  }
  
  [data-header-name="Notes"] {
  width: 45%;
  line-height: 1;
  white-space: break-spaces;
  }
  
  [data-header-name="Edit"] {
  width: 5%;
  }
  
  .reports-availability-table td textarea {
  background: transparent; 
  color: inherit; 
  width: 100%;
  height: 200px;
  padding: 10px 10px;
  box-sizing: border-box;
  resize: none;
  }
  
  .reports-availability-table td textarea::-webkit-scrollbar {
    width: 1px;
    background-color: red;
}
  `;
  document.head.appendChild(styleElement);
};
