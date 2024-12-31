export const normalizeString = (str: string) => {
  const transliteratedStr = transliterate(str);
  return transliteratedStr
    .toLowerCase() // Convert to lowercase
    .normalize('NFD') // Normalize to decompose special characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters
    .replace(/\s+and\s+/g, ' ') // Replace "and" with a single space
    .replace(/\s+/g, ' ') // Normalize multiple spaces to a single space
    .trim();
}

export const transliterate = (str: string): string => {
  const cyrillicToLatinMap: Record<string, string> = {
    А: 'A', Б: 'B', В: 'V', Г: 'G', Д: 'D', Е: 'E', Ё: 'Yo', Ж: 'Zh',
    З: 'Z', И: 'I', Й: 'Y', К: 'K', Л: 'L', М: 'M', Н: 'N', О: 'O',
    П: 'P', Р: 'R', С: 'S', Т: 'T', У: 'U', Ф: 'F', Х: 'Kh', Ц: 'Ts',
    Ч: 'Ch', Ш: 'Sh', Щ: 'Shch', Ъ: '', Ы: 'Y', Ь: '', Э: 'E', Ю: 'Yu',
    Я: 'Ya', а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo',
    ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n',
    о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'kh',
    ц: 'ts', ч: 'ch', ш: 'sh', щ: 'shch', ъ: '', ы: 'y', ь: '', э: 'e',
    ю: 'yu', я: 'ya',
  };

  return str
    .split('')
    .map(char => cyrillicToLatinMap[char] || char)
    .join('');
};
