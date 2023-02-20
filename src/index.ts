import { watchIfTableIsMounted } from './main-table-observer';
import { cleanup, createDataTableObserver } from './data-table-observer';
import {
  createInitialLoaderElement,
  createToggleInputElement,
  createTableHeader,
} from './table-ui';
import { updateDataTableRows } from './data-table-core';
import { loadStylesheet } from './loadStylesheet';

(function () {
  console.log('-> The Tampermonkey script has been loaded');
  const host = window.location.host;
  watchIfTableIsMounted((table) => {
    loadStylesheet();

    createInitialLoaderElement(table);
    createToggleInputElement(host, table);

    createTableHeader(table, 'Avail');
    createTableHeader(table, 'Notes');
    createTableHeader(table, 'Edit');

    createDataTableObserver(table, () => updateDataTableRows(host, table));

    return () => {
      cleanup();
    };
  });
})();
