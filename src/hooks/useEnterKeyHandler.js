export default function useEnterKeyHandler(callback) {
  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      callback();
    }
  }

  return handleKeyDown;
}
