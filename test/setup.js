// Export modules to global scope as necessary (only for testing)
if (typeof process !== 'undefined' && process.title === 'node') {
  isBrowser = false;
} else {
  isBrowser = true;
}
