import { watchIfTableIsMounted } from './main-table-observer';
import { cleanup, createDataTableObserver } from './data-table-observer';
import { createTableHeader, loadStylesheet } from './table-ui';
import { updateDataTableRows } from './data-table-core';

(function () {
  console.log('-> The Tampermonkey script has been loaded');
  const host = window.location.host;

  watchIfTableIsMounted((table) => {
    loadStylesheet();
    // removeTableHeader(table, 'Department');
    createTableHeader(table, 'Notes');
    createTableHeader(table, 'Edit');

    createDataTableObserver(table, () => updateDataTableRows(host, table));

    return () => {
      cleanup();
    };
  });
})();
