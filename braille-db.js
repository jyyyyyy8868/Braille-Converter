// 传统布莱叶盲文（6点系统）数据库
// 点位编号：
// 列1（左列）：点1（上）、点2（中）、点3（下）
// 列2（右列）：点4（上）、点5（中）、点6（下）

const brailleDatabase = {
  'a': { dots: [1], unicode: '\u2801', description: '点1' },
  'b': { dots: [1, 2], unicode: '\u2803', description: '点1, 点2' },
  'c': { dots: [1, 4], unicode: '\u2809', description: '点1, 点4' },
  'd': { dots: [1, 4, 5], unicode: '\u2819', description: '点1, 点4, 点5' },
  'e': { dots: [1, 5], unicode: '\u2811', description: '点1, 点5' },
  'f': { dots: [1, 2, 4], unicode: '\u280b', description: '点1, 点2, 点4' },
  'g': { dots: [1, 2, 4, 5], unicode: '\u281b', description: '点1, 点2, 点4, 点5' },
  'h': { dots: [1, 2, 5], unicode: '\u2813', description: '点1, 点2, 点5' },
  'i': { dots: [2, 4], unicode: '\u280a', description: '点2, 点4' },
  'j': { dots: [2, 4, 5], unicode: '\u281a', description: '点2, 点4, 点5' },
  'k': { dots: [1, 3], unicode: '\u2805', description: '点1, 点3' },
  'l': { dots: [1, 2, 3], unicode: '\u2807', description: '点1, 点2, 点3' },
  'm': { dots: [1, 3, 4], unicode: '\u280d', description: '点1, 点3, 点4' },
  'n': { dots: [1, 3, 4, 5], unicode: '\u281d', description: '点1, 点3, 点4, 点5' },
  'o': { dots: [1, 3, 5], unicode: '\u2815', description: '点1, 点3, 点5' },
  'p': { dots: [1, 2, 3, 4], unicode: '\u280f', description: '点1, 点2, 点3, 点4' },
  'q': { dots: [1, 2, 3, 4, 5], unicode: '\u281f', description: '点1, 点2, 点3, 点4, 点5' },
  'r': { dots: [1, 2, 3, 5], unicode: '\u2817', description: '点1, 点2, 点3, 点5' },
  's': { dots: [2, 3, 4], unicode: '\u280e', description: '点2, 点3, 点4' },
  't': { dots: [2, 3, 4, 5], unicode: '\u281e', description: '点2, 点3, 点4, 点5' },
  'u': { dots: [1, 3, 6], unicode: '\u2825', description: '点1, 点3, 点6' },
  'v': { dots: [1, 2, 3, 6], unicode: '\u2827', description: '点1, 点2, 点3, 点6' },
  'w': { dots: [2, 4, 5, 6], unicode: '\u283a', description: '点2, 点4, 点5, 点6' },
  'x': { dots: [1, 3, 4, 6], unicode: '\u282d', description: '点1, 点3, 点4, 点6' },
  'y': { dots: [1, 3, 4, 5, 6], unicode: '\u283d', description: '点1, 点3, 点4, 点5, 点6' },
  'z': { dots: [1, 3, 5, 6], unicode: '\u2835', description: '点1, 点3, 点5, 点6' }
};

// 获取字母的盲文信息
function getBrailleInfo(letter) {
  const lowerLetter = letter.toLowerCase();
  return brailleDatabase[lowerLetter] || null;
}

// 检查字母是否在数据库中
function isValidLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

// 比较两个盲文点位是否相同
function compareBrailleDots(dots1, dots2) {
  if (dots1.length !== dots2.length) return false;
  const sorted1 = [...dots1].sort((a, b) => a - b);
  const sorted2 = [...dots2].sort((a, b) => a - b);
  return sorted1.every((dot, index) => dot === sorted2[index]);
}
