export function removeColor(str: any) {
  try {
    if (typeof str === 'object') {
      str = JSON.stringify(str);
    }
  } catch (error) {}

  if (typeof str !== 'string') {
    str = String(str);
  }
  return str.replace(/\x1B\[([0-9]{1,2}(;[0-9]{1,2})?)?[m|K]/g, '');
}
