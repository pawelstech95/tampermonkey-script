import { getUserIdsFromTable } from './utils';

let userUuids: string[] = [];

export const createDataTableObserver = async (
  tableSelector: HTMLElement,
  callback?: () => void
) => {
  const observer = await new MutationObserver(() => {
    const existingUuids = getUserIdsFromTable(tableSelector);

    if (JSON.stringify(existingUuids) !== JSON.stringify(userUuids)) {
      userUuids = existingUuids;

      callback();
    }
  });
  if (!userUuids.length) {
    await callback();
  }

  await observer.observe(tableSelector, {
    childList: true,
    subtree: true,
    attributes: true,
  });
};

export function cleanup() {
  userUuids = [];
}
