const availabilityTableSelector = '.reports-availability-table';

export function watchIfTableIsMounted(
  callback: (table: HTMLElement) => () => void
) {
  let tableExists = false;
  let unmount: () => void;

  function mountTableIfNotExists() {
    if (!tableExists) {
      unmount = callback(document.querySelector(availabilityTableSelector));
      tableExists = true;
    }
  }

  function unmountTableIfExists() {
    if (tableExists) {
      unmount?.();
      tableExists = false;
    }
  }

  if (document.querySelector(availabilityTableSelector)) {
    mountTableIfNotExists();
  } else {
    unmountTableIfExists();
  }

  const observer = new MutationObserver(() => {
    if (document.querySelector(availabilityTableSelector)) {
      mountTableIfNotExists();
    } else {
      unmountTableIfExists();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}
