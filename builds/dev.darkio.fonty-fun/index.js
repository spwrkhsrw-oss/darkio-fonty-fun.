/* Darkio Fonty Fun — Revenge Classic / Bunny plugin.
 * Local-only rendering helper. No token access, network calls, or profile edits.
 * Supports the classic Vendetta-style loader and spec-3 Revenge loader.
 */
globalThis.plugin = (() => {
  "use strict";
  const isSpec3 = typeof definePlugin === 'function';
  const revenge = typeof bunny !== 'undefined' ? bunny : globalThis.bunny;
  const legacy = typeof vendetta !== 'undefined' ? vendetta : null;
  const runtime = isSpec3 ? (revenge || legacy) : (legacy || revenge);

  // Some Classic builds expose both the legacy Vendetta compatibility layer and
  // Bunny/Revenge. A property getter on one layer may be missing or throw, so
  // resolve each candidate independently instead of letting the first layer mask
  // a working implementation on the other layer.
  const safeRead = getter => { try { return getter(); } catch (_) { return undefined; } };
  const React = safeRead(() => revenge?.metro?.common?.React)
    || safeRead(() => legacy?.metro?.common?.React)
    || safeRead(() => runtime?.metro?.common?.React)
    || safeRead(() => globalThis.React);
  const RN = safeRead(() => revenge?.metro?.common?.ReactNative)
    || safeRead(() => legacy?.metro?.common?.ReactNative)
    || safeRead(() => runtime?.metro?.common?.ReactNative)
    || safeRead(() => globalThis.ReactNative);
  const logger = safeRead(() => revenge?.plugin?.logger)
    || safeRead(() => legacy?.logger)
    || safeRead(() => runtime?.logger)
    || safeRead(() => runtime?.plugin?.logger);
  const patcher = safeRead(() => revenge?.api?.patcher)
    || safeRead(() => legacy?.patcher)
    || safeRead(() => revenge?.patcher);
  const findByProps = safeRead(() => revenge?.metro?.findByPropsLazy)
    || safeRead(() => revenge?.metro?.findByProps)
    || safeRead(() => legacy?.metro?.findByProps)
    || safeRead(() => runtime?.metro?.findByProps);
const h = React?.createElement?.bind(React);
const Animated = RN?.Animated;
const Text = RN?.Text;
const View = RN?.View;
const ScrollView = RN?.ScrollView;
const TextInput = RN?.TextInput;
const Switch = RN?.Switch;
const Pressable = RN?.Pressable || RN?.TouchableOpacity || RN?.Button;

const DEFAULT_SETTINGS = {
  enabled: false,
  targetName: '',
  fontStyle: 'medieval',
  colorEnabled: true,
  color: '#B69CFF',
  colorMode: 'solid',
  animationSpeed: 'normal',
};

const COLOR_MODE_OPTIONS = [
  { id: 'solid', label: 'Solid', sample: '●' },
  { id: 'rainbow', label: 'Prism / Rainbow', sample: '🌈' },
  { id: 'ocean', label: 'Ocean', sample: '🌊' },
  { id: 'sunset', label: 'Sunset', sample: '🌅' },
  { id: 'aurora', label: 'Aurora', sample: '✨' },
  { id: 'neon-pulse', label: 'Neon Pulse', sample: '💜' },
  { id: 'gummy', label: 'Gummy', sample: '🍬' },
];
const SPEED_OPTIONS = [
  { id: 'slow', label: 'Slow' },
  { id: 'normal', label: 'Normal' },
  { id: 'fast', label: 'Fast' },
];
const ANIMATION_DURATIONS = { slow: 10000, normal: 6200, fast: 3400 };
const COLOR_PALETTES = {
  rainbow: { inputRange: [0,1,2,3,4,5,6], outputRange: ['#FF4D6D','#FFB84D','#F9F871','#55E6A5','#49C6FF','#A78BFA','#FF4D6D'] },
  ocean: { inputRange: [0,2,4,6], outputRange: ['#22D3EE','#38BDF8','#6366F1','#22D3EE'] },
  sunset: { inputRange: [0,2,4,6], outputRange: ['#FB7185','#F97316','#FACC15','#FB7185'] },
  aurora: { inputRange: [0,2,4,6], outputRange: ['#5EEAD4','#60A5FA','#C084FC','#5EEAD4'] },
  gummy: { inputRange: [0,1.5,3,4.5,6], outputRange: ['#FF8FAB','#F9A8D4','#C4B5FD','#93C5FD','#FF8FAB'] },
};

const FONT_OPTIONS = [
  {
    "id": "gg-sans",
    "label": "gg sans",
    "sample": "Darkio",
    "note": "Classic / unchanged text"
  },
  {
    "id": "tempo",
    "label": "Tempo",
    "sample": "𝗗𝗮𝗿𝗸𝗶𝗼",
    "note": "Bold sans approximation"
  },
  {
    "id": "sakura",
    "label": "Sakura",
    "sample": "𝒟𝒶𝓇𝓀𝒾𝑜",
    "note": "Script approximation"
  },
  {
    "id": "jellybean",
    "label": "Jellybean",
    "sample": "𝔻𝕒𝕣𝕜𝕚𝕠",
    "note": "Double-struck approximation"
  },
  {
    "id": "modern",
    "label": "Modern",
    "sample": "𝘋𝘢𝘳𝘬𝘪𝘰",
    "note": "Sans italic approximation"
  },
  {
    "id": "medieval",
    "label": "Medieval",
    "sample": "𝔇𝔞𝔯𝔨𝔦𝔬",
    "note": "Fraktur / blackletter"
  },
  {
    "id": "8bit",
    "label": "8Bit",
    "sample": "🄳🄰🅁🄺🄸🄾",
    "note": "Squared characters"
  },
  {
    "id": "vampyre",
    "label": "Vampyre",
    "sample": "𝕯𝖆𝖗𝖐𝖎𝖔",
    "note": "Bold blackletter approximation"
  },
  {
    "id": "monkey-bars",
    "label": "Monkey Bars",
    "sample": "ⓓⓐⓡⓚⓘⓞ",
    "note": "Circled / bubble approximation"
  },
  {
    "id": "mainframe",
    "label": "Mainframe",
    "sample": "𝙳𝚊𝚛𝚔𝚒𝚘",
    "note": "Monospace characters"
  },
  {
    "id": "headbang",
    "label": "Headbang",
    "sample": "𝑫𝒂𝒓𝒌𝒊𝒐",
    "note": "Bold italic approximation"
  },
  {
    "id": "journal",
    "label": "Journal",
    "sample": "𝐷𝑎𝑟𝑘𝑖𝑜",
    "note": "Italic serif approximation"
  },
  {
    "id": "bold-serif",
    "label": "Bold Serif",
    "sample": "𝐃𝐚𝐫𝐤𝐢𝐨",
    "note": "Extra style"
  },
  {
    "id": "italic-serif",
    "label": "Italic Serif",
    "sample": "𝐷𝑎𝑟𝑘𝑖𝑜",
    "note": "Extra style"
  },
  {
    "id": "bold-italic",
    "label": "Bold Italic",
    "sample": "𝑫𝒂𝒓𝒌𝒊𝒐",
    "note": "Extra style"
  },
  {
    "id": "bold-fraktur",
    "label": "Bold Fraktur",
    "sample": "𝕯𝖆𝖗𝖐𝖎𝖔",
    "note": "Extra style"
  },
  {
    "id": "double-struck",
    "label": "Double-Struck",
    "sample": "𝔻𝕒𝕣𝕜𝕚𝕠",
    "note": "Extra style"
  },
  {
    "id": "small-caps",
    "label": "Small Caps",
    "sample": "ᴅᴀʀᴋɪᴏ",
    "note": "Extra style"
  },
  {
    "id": "fullwidth",
    "label": "Fullwidth",
    "sample": "Ｄａｒｋｉｏ",
    "note": "Extra style"
  },
  {
    "id": "sans-italic",
    "label": "Sans Italic",
    "sample": "𝘋𝘢𝘳𝘬𝘪𝘰",
    "note": "Extra style"
  },
  {
    "id": "bubble",
    "label": "Bubble Letters",
    "sample": "ⓓⓐⓡⓚⓘⓞ",
    "note": "Extra style"
  }
];
const FONT_ALPHABET = {
  "gg-sans": "plain",
  "tempo": "bold-sans",
  "sakura": "script",
  "jellybean": "double-struck",
  "modern": "sans-italic",
  "medieval": "fraktur",
  "8bit": "squared",
  "vampyre": "bold-fraktur",
  "monkey-bars": "circled",
  "mainframe": "monospace",
  "headbang": "bold-italic",
  "journal": "italic-serif",
  "double-struck": "double-struck",
  "small-caps": "small-caps",
  "fullwidth": "fullwidth",
  "bold-serif": "bold-serif",
  "italic-serif": "italic-serif",
  "bold-italic": "bold-italic",
  "bold-fraktur": "bold-fraktur",
  "sans-italic": "sans-italic",
  "bubble": "bubble"
};
const ALPHABETS = {
  "plain": {
    "upper": [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z"
    ],
    "lower": [
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z"
    ],
    "digits": [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9"
    ]
  },
  "fraktur": {
    "upper": [
      "𝔄",
      "𝔅",
      "ℭ",
      "𝔇",
      "𝔈",
      "𝔉",
      "𝔊",
      "ℌ",
      "ℑ",
      "𝔍",
      "𝔎",
      "𝔏",
      "𝔐",
      "𝔑",
      "𝔒",
      "𝔓",
      "𝔔",
      "ℜ",
      "𝔖",
      "𝔗",
      "𝔘",
      "𝔙",
      "𝔚",
      "𝔛",
      "𝔜",
      "ℨ"
    ],
    "lower": [
      "𝔞",
      "𝔟",
      "𝔠",
      "𝔡",
      "ℯ",
      "𝔣",
      "ℊ",
      "𝔥",
      "𝔦",
      "𝔧",
      "𝔨",
      "𝔩",
      "𝔪",
      "𝔫",
      "ℴ",
      "𝔭",
      "𝔮",
      "𝔯",
      "𝔰",
      "𝔱",
      "𝔲",
      "𝔳",
      "𝔴",
      "𝔵",
      "𝔶",
      "𝔷"
    ]
  },
  "script": {
    "upper": [
      "𝒜",
      "ℬ",
      "𝒞",
      "𝒟",
      "ℰ",
      "ℱ",
      "𝒢",
      "ℋ",
      "ℐ",
      "𝒥",
      "𝒦",
      "ℒ",
      "ℳ",
      "𝒩",
      "𝒪",
      "𝒫",
      "𝒬",
      "ℛ",
      "𝒮",
      "𝒯",
      "𝒰",
      "𝒱",
      "𝒲",
      "𝒳",
      "𝒴",
      "𝒵"
    ],
    "lower": [
      "𝒶",
      "𝒷",
      "𝒸",
      "𝒹",
      "ℯ",
      "𝒻",
      "ℊ",
      "𝒽",
      "𝒾",
      "𝒿",
      "𝓀",
      "𝓁",
      "𝓂",
      "𝓃",
      "ℴ",
      "𝓅",
      "𝓆",
      "𝓇",
      "𝓈",
      "𝓉",
      "𝓊",
      "𝓋",
      "𝓌",
      "𝓍",
      "𝓎",
      "𝓏"
    ]
  },
  "double-struck": {
    "upper": [
      "𝔸",
      "𝔹",
      "ℂ",
      "𝔻",
      "𝔼",
      "𝔽",
      "𝔾",
      "ℍ",
      "𝕀",
      "𝕁",
      "𝕂",
      "𝕃",
      "𝕄",
      "ℕ",
      "𝕆",
      "ℙ",
      "ℚ",
      "ℝ",
      "𝕊",
      "𝕋",
      "𝕌",
      "𝕍",
      "𝕎",
      "𝕏",
      "𝕐",
      "ℤ"
    ],
    "lower": [
      "𝕒",
      "𝕓",
      "𝕔",
      "𝕕",
      "𝕖",
      "𝕗",
      "𝕘",
      "𝕙",
      "𝕚",
      "𝕛",
      "𝕜",
      "𝕝",
      "𝕞",
      "𝕟",
      "𝕠",
      "𝕡",
      "𝕢",
      "𝕣",
      "𝕤",
      "𝕥",
      "𝕦",
      "𝕧",
      "𝕨",
      "𝕩",
      "𝕪",
      "𝕫"
    ],
    "digits": [
      "𝟘",
      "𝟙",
      "𝟚",
      "𝟛",
      "𝟜",
      "𝟝",
      "𝟞",
      "𝟟",
      "𝟠",
      "𝟡"
    ]
  },
  "monospace": {
    "upper": [
      "𝙰",
      "𝙱",
      "𝙲",
      "𝙳",
      "𝙴",
      "𝙵",
      "𝙶",
      "𝙷",
      "𝙸",
      "𝙹",
      "𝙺",
      "𝙻",
      "𝙼",
      "𝙽",
      "𝙾",
      "𝙿",
      "𝚀",
      "𝚁",
      "𝚂",
      "𝚃",
      "𝚄",
      "𝚅",
      "𝚆",
      "𝚇",
      "𝚈",
      "𝚉"
    ],
    "lower": [
      "𝚊",
      "𝚋",
      "𝚌",
      "𝚍",
      "𝚎",
      "𝚏",
      "𝚐",
      "𝚑",
      "𝚒",
      "𝚓",
      "𝚔",
      "𝚕",
      "𝚖",
      "𝚗",
      "𝚘",
      "𝚙",
      "𝚚",
      "𝚛",
      "𝚜",
      "𝚝",
      "𝚞",
      "𝚟",
      "𝚠",
      "𝚡",
      "𝚢",
      "𝚣"
    ],
    "digits": [
      "𝟶",
      "𝟷",
      "𝟸",
      "𝟹",
      "𝟺",
      "𝟻",
      "𝟼",
      "𝟽",
      "𝟾",
      "𝟿"
    ]
  },
  "small-caps": {
    "upper": [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z"
    ],
    "lower": [
      "ᴀ",
      "ʙ",
      "ᴄ",
      "ᴅ",
      "ᴇ",
      "ꜰ",
      "ɢ",
      "ʜ",
      "ɪ",
      "ᴊ",
      "ᴋ",
      "ʟ",
      "ᴍ",
      "ɴ",
      "ᴏ",
      "ᴘ",
      "ǫ",
      "ʀ",
      "ꜱ",
      "ᴛ",
      "ᴜ",
      "ᴠ",
      "ᴡ",
      "x",
      "ʏ",
      "ᴢ"
    ]
  },
  "fullwidth": {
    "upper": [
      "Ａ",
      "Ｂ",
      "Ｃ",
      "Ｄ",
      "Ｅ",
      "Ｆ",
      "Ｇ",
      "Ｈ",
      "Ｉ",
      "Ｊ",
      "Ｋ",
      "Ｌ",
      "Ｍ",
      "Ｎ",
      "Ｏ",
      "Ｐ",
      "Ｑ",
      "Ｒ",
      "Ｓ",
      "Ｔ",
      "Ｕ",
      "Ｖ",
      "Ｗ",
      "Ｘ",
      "Ｙ",
      "Ｚ"
    ],
    "lower": [
      "ａ",
      "ｂ",
      "ｃ",
      "ｄ",
      "ｅ",
      "ｆ",
      "ｇ",
      "ｈ",
      "ｉ",
      "ｊ",
      "ｋ",
      "ｌ",
      "ｍ",
      "ｎ",
      "ｏ",
      "ｐ",
      "ｑ",
      "ｒ",
      "ｓ",
      "ｔ",
      "ｕ",
      "ｖ",
      "ｗ",
      "ｘ",
      "ｙ",
      "ｚ"
    ],
    "digits": [
      "０",
      "１",
      "２",
      "３",
      "４",
      "５",
      "６",
      "７",
      "８",
      "９"
    ]
  },
  "bold-serif": {
    "upper": [
      "𝐀",
      "𝐁",
      "𝐂",
      "𝐃",
      "𝐄",
      "𝐅",
      "𝐆",
      "𝐇",
      "𝐈",
      "𝐉",
      "𝐊",
      "𝐋",
      "𝐌",
      "𝐍",
      "𝐎",
      "𝐏",
      "𝐐",
      "𝐑",
      "𝐒",
      "𝐓",
      "𝐔",
      "𝐕",
      "𝐖",
      "𝐗",
      "𝐘",
      "𝐙"
    ],
    "lower": [
      "𝐚",
      "𝐛",
      "𝐜",
      "𝐝",
      "𝐞",
      "𝐟",
      "𝐠",
      "𝐡",
      "𝐢",
      "𝐣",
      "𝐤",
      "𝐥",
      "𝐦",
      "𝐧",
      "𝐨",
      "𝐩",
      "𝐪",
      "𝐫",
      "𝐬",
      "𝐭",
      "𝐮",
      "𝐯",
      "𝐰",
      "𝐱",
      "𝐲",
      "𝐳"
    ],
    "digits": [
      "𝟎",
      "𝟏",
      "𝟐",
      "𝟑",
      "𝟒",
      "𝟓",
      "𝟔",
      "𝟕",
      "𝟖",
      "𝟗"
    ]
  },
  "italic-serif": {
    "upper": [
      "𝐴",
      "𝐵",
      "𝐶",
      "𝐷",
      "𝐸",
      "𝐹",
      "𝐺",
      "𝐻",
      "𝐼",
      "𝐽",
      "𝐾",
      "𝐿",
      "𝑀",
      "𝑁",
      "𝑂",
      "𝑃",
      "𝑄",
      "𝑅",
      "𝑆",
      "𝑇",
      "𝑈",
      "𝑉",
      "𝑊",
      "𝑋",
      "𝑌",
      "𝑍"
    ],
    "lower": [
      "𝑎",
      "𝑏",
      "𝑐",
      "𝑑",
      "𝑒",
      "𝑓",
      "𝑔",
      "ℎ",
      "𝑖",
      "𝑗",
      "𝑘",
      "𝑙",
      "𝑚",
      "𝑛",
      "𝑜",
      "𝑝",
      "𝑞",
      "𝑟",
      "𝑠",
      "𝑡",
      "𝑢",
      "𝑣",
      "𝑤",
      "𝑥",
      "𝑦",
      "𝑧"
    ]
  },
  "bold-italic": {
    "upper": [
      "𝑨",
      "𝑩",
      "𝑪",
      "𝑫",
      "𝑬",
      "𝑭",
      "𝑮",
      "𝑯",
      "𝑰",
      "𝑱",
      "𝑲",
      "𝑳",
      "𝑴",
      "𝑵",
      "𝑶",
      "𝑷",
      "𝑸",
      "𝑹",
      "𝑺",
      "𝑻",
      "𝑼",
      "𝑽",
      "𝑾",
      "𝑿",
      "𝒀",
      "𝒁"
    ],
    "lower": [
      "𝒂",
      "𝒃",
      "𝒄",
      "𝒅",
      "𝒆",
      "𝒇",
      "𝒈",
      "𝒉",
      "𝒊",
      "𝒋",
      "𝒌",
      "𝒍",
      "𝒎",
      "𝒏",
      "𝒐",
      "𝒑",
      "𝒒",
      "𝒓",
      "𝒔",
      "𝒕",
      "𝒖",
      "𝒗",
      "𝒘",
      "𝒙",
      "𝒚",
      "𝒛"
    ]
  },
  "bold-sans": {
    "upper": [
      "𝗔",
      "𝗕",
      "𝗖",
      "𝗗",
      "𝗘",
      "𝗙",
      "𝗚",
      "𝗛",
      "𝗜",
      "𝗝",
      "𝗞",
      "𝗟",
      "𝗠",
      "𝗡",
      "𝗢",
      "𝗣",
      "𝗤",
      "𝗥",
      "𝗦",
      "𝗧",
      "𝗨",
      "𝗩",
      "𝗪",
      "𝗫",
      "𝗬",
      "𝗭"
    ],
    "lower": [
      "𝗮",
      "𝗯",
      "𝗰",
      "𝗱",
      "𝗲",
      "𝗳",
      "𝗴",
      "𝗵",
      "𝗶",
      "𝗷",
      "𝗸",
      "𝗹",
      "𝗺",
      "𝗻",
      "𝗼",
      "𝗽",
      "𝗾",
      "𝗿",
      "𝘀",
      "𝘁",
      "𝘂",
      "𝘃",
      "𝘄",
      "𝘅",
      "𝘆",
      "𝘇"
    ],
    "digits": [
      "𝟬",
      "𝟭",
      "𝟮",
      "𝟯",
      "𝟰",
      "𝟱",
      "𝟲",
      "𝟳",
      "𝟴",
      "𝟵"
    ]
  },
  "bold-fraktur": {
    "upper": [
      "𝕬",
      "𝕭",
      "𝕮",
      "𝕯",
      "𝕰",
      "𝕱",
      "𝕲",
      "𝕳",
      "𝕴",
      "𝕵",
      "𝕶",
      "𝕷",
      "𝕸",
      "𝕹",
      "𝕺",
      "𝕻",
      "𝕼",
      "𝕽",
      "𝕾",
      "𝕿",
      "𝖀",
      "𝖁",
      "𝖂",
      "𝖃",
      "𝖄",
      "𝖅"
    ],
    "lower": [
      "𝖆",
      "𝖇",
      "𝖈",
      "𝖉",
      "𝖊",
      "𝖋",
      "𝖌",
      "𝖍",
      "𝖎",
      "𝖏",
      "𝖐",
      "𝖑",
      "𝖒",
      "𝖓",
      "𝖔",
      "𝖕",
      "𝖖",
      "𝖗",
      "𝖘",
      "𝖙",
      "𝖚",
      "𝖛",
      "𝖜",
      "𝖝",
      "𝖞",
      "𝖟"
    ]
  },
  "sans-italic": {
    "upper": [
      "𝘈",
      "𝘉",
      "𝘊",
      "𝘋",
      "𝘌",
      "𝘍",
      "𝘎",
      "𝘏",
      "𝘐",
      "𝘑",
      "𝘒",
      "𝘓",
      "𝘔",
      "𝘕",
      "𝘖",
      "𝘗",
      "𝘘",
      "𝘙",
      "𝘚",
      "𝘛",
      "𝘜",
      "𝘝",
      "𝘞",
      "𝘟",
      "𝘠",
      "𝘡"
    ],
    "lower": [
      "𝘢",
      "𝘣",
      "𝘤",
      "𝘥",
      "𝘦",
      "𝘧",
      "𝘨",
      "𝘩",
      "𝘪",
      "𝘫",
      "𝘬",
      "𝘭",
      "𝘮",
      "𝘯",
      "𝘰",
      "𝘱",
      "𝘲",
      "𝘳",
      "𝘴",
      "𝘵",
      "𝘶",
      "𝘷",
      "𝘸",
      "𝘹",
      "𝘺",
      "𝘻"
    ]
  },
  "circled": {
    "upper": [
      "Ⓐ",
      "Ⓑ",
      "Ⓒ",
      "Ⓓ",
      "Ⓔ",
      "Ⓕ",
      "Ⓖ",
      "Ⓗ",
      "Ⓘ",
      "Ⓙ",
      "Ⓚ",
      "Ⓛ",
      "Ⓜ",
      "Ⓝ",
      "Ⓞ",
      "Ⓟ",
      "Ⓠ",
      "Ⓡ",
      "Ⓢ",
      "Ⓣ",
      "Ⓤ",
      "Ⓥ",
      "Ⓦ",
      "Ⓧ",
      "Ⓨ",
      "Ⓩ"
    ],
    "lower": [
      "ⓐ",
      "ⓑ",
      "ⓒ",
      "ⓓ",
      "ⓔ",
      "ⓕ",
      "ⓖ",
      "ⓗ",
      "ⓘ",
      "ⓙ",
      "ⓚ",
      "ⓛ",
      "ⓜ",
      "ⓝ",
      "ⓞ",
      "ⓟ",
      "ⓠ",
      "ⓡ",
      "ⓢ",
      "ⓣ",
      "ⓤ",
      "ⓥ",
      "ⓦ",
      "ⓧ",
      "ⓨ",
      "ⓩ"
    ],
    "digits": [
      "⓪",
      "①",
      "②",
      "③",
      "④",
      "⑤",
      "⑥",
      "⑦",
      "⑧",
      "⑨"
    ]
  },
  "squared": {
    "upper": [
      "🄰",
      "🄱",
      "🄲",
      "🄳",
      "🄴",
      "🄵",
      "🄶",
      "🄷",
      "🄸",
      "🄹",
      "🄺",
      "🄻",
      "🄼",
      "🄽",
      "🄾",
      "🄿",
      "🅀",
      "🅁",
      "🅂",
      "🅃",
      "🅄",
      "🅅",
      "🅆",
      "🅇",
      "🅈",
      "🅉"
    ],
    "lower": [
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z"
    ],
    "digits": [
      "⓪",
      "①",
      "②",
      "③",
      "④",
      "⑤",
      "⑥",
      "⑦",
      "⑧",
      "⑨"
    ]
  },
  "bubble": {
    "upper": [
      "Ⓐ",
      "Ⓑ",
      "Ⓒ",
      "Ⓓ",
      "Ⓔ",
      "Ⓕ",
      "Ⓖ",
      "Ⓗ",
      "Ⓘ",
      "Ⓙ",
      "Ⓚ",
      "Ⓛ",
      "Ⓜ",
      "Ⓝ",
      "Ⓞ",
      "Ⓟ",
      "Ⓠ",
      "Ⓡ",
      "Ⓢ",
      "Ⓣ",
      "Ⓤ",
      "Ⓥ",
      "Ⓦ",
      "Ⓧ",
      "Ⓨ",
      "Ⓩ"
    ],
    "lower": [
      "ⓐ",
      "ⓑ",
      "ⓒ",
      "ⓓ",
      "ⓔ",
      "ⓕ",
      "ⓖ",
      "ⓗ",
      "ⓘ",
      "ⓙ",
      "ⓚ",
      "ⓛ",
      "ⓜ",
      "ⓝ",
      "ⓞ",
      "ⓟ",
      "ⓠ",
      "ⓡ",
      "ⓢ",
      "ⓣ",
      "ⓤ",
      "ⓥ",
      "ⓦ",
      "ⓧ",
      "ⓨ",
      "ⓩ"
    ],
    "digits": [
      "⓪",
      "①",
      "②",
      "③",
      "④",
      "⑤",
      "⑥",
      "⑦",
      "⑧",
      "⑨"
    ]
  }
};

function readSettings() {
  const out = { ...DEFAULT_SETTINGS };
  if (storage) for (const key of Object.keys(DEFAULT_SETTINGS)) {
    if (storage[key] !== undefined && storage[key] !== null) out[key] = storage[key];
  }
  if (!FONT_ALPHABET[out.fontStyle]) out.fontStyle = DEFAULT_SETTINGS.fontStyle;
  if (!COLOR_MODE_OPTIONS.some(x => x.id === out.colorMode)) out.colorMode = DEFAULT_SETTINGS.colorMode;
  if (!SPEED_OPTIONS.some(x => x.id === out.animationSpeed)) out.animationSpeed = DEFAULT_SETTINGS.animationSpeed;
  return out;
}
function writeSettings(partial) {
  if (!storage) return;
  for (const [key, value] of Object.entries(partial)) storage[key] = value;
  syncAnimation(readSettings());
}
function validHexColor(value) { return /^#[0-9a-fA-F]{6}$/.test(value || ''); }
function lightenHex(hex, amount) {
  if (!validHexColor(hex)) hex = '#B69CFF';
  const values = [1,3,5].map(i => parseInt(hex.slice(i, i+2), 16));
  return '#' + values.map(v => Math.round(v + (255-v)*(amount ?? 0.42)).toString(16).padStart(2,'0')).join('');
}
function mapText(input, style) {
  const map = ALPHABETS[FONT_ALPHABET[style]] || ALPHABETS.fraktur;
  return Array.from(input, char => {
    const code = char.codePointAt(0);
    if (style === '8bit') {
      const up = char.toUpperCase().codePointAt(0);
      if (up >= 65 && up <= 90) return map.upper[up - 65] || char;
      return char;
    }
    if (code >= 65 && code <= 90) return map.upper[code - 65] || char;
    if (code >= 97 && code <= 122) return map.lower[code - 97] || char;
    if (code >= 48 && code <= 57 && map.digits) return map.digits[code - 48] || char;
    return char;
  }).join('');
}

let storage = Object.create(null);
let colorProgress;
let colorLoop;
let colorLoopKey = '';
const unpatches = [];
function getProgress() {
  if (!colorProgress && Animated?.Value) colorProgress = new Animated.Value(0);
  return colorProgress;
}
function stopAnimation() {
  try { colorLoop?.stop?.(); } catch (_) {}
  colorLoop = null;
  colorLoopKey = '';
  try { colorProgress?.setValue?.(0); } catch (_) {}
}
function syncAnimation(settings) {
  const shouldAnimate = !!Animated && settings.colorEnabled && settings.colorMode !== 'solid';
  if (!shouldAnimate) { if (colorLoop) stopAnimation(); return; }
  const key = settings.colorMode + ':' + settings.animationSpeed;
  if (colorLoop && colorLoopKey === key) return;
  try { colorLoop?.stop?.(); } catch (_) {}
  const progress = getProgress();
  if (!progress) return;
  progress.setValue(0);
  colorLoop = Animated.loop(Animated.timing(progress, {
    toValue: 6,
    duration: ANIMATION_DURATIONS[settings.animationSpeed] || ANIMATION_DURATIONS.normal,
    useNativeDriver: false,
    isInteraction: false,
  }));
  colorLoopKey = key;
  colorLoop.start();
}
function colorValue(settings) {
  if (!settings.colorEnabled) return undefined;
  const safeCustom = validHexColor(settings.color) ? settings.color : '#B69CFF';
  if (settings.colorMode === 'solid') return safeCustom;
  const progress = getProgress();
  if (!progress) return safeCustom;
  if (settings.colorMode === 'neon-pulse') return progress.interpolate({
    inputRange: [0,3,6], outputRange: [lightenHex(safeCustom), safeCustom, lightenHex(safeCustom)], extrapolate: 'clamp'
  });
  const palette = COLOR_PALETTES[settings.colorMode] || COLOR_PALETTES.rainbow;
  return progress.interpolate({ inputRange: palette.inputRange, outputRange: palette.outputRange, extrapolate: 'clamp' });
}
function patchElementArgs(_thisObject, args) {
  // Bunny/Revenge Classic's before() callback receives (thisObject, args).
  // The argument array must be mutated; returning a replacement array is ignored.
  try {
    if (!Array.isArray(args) || args.length < 2) return;
    const settings = readSettings();
    const type = args[0];
    const props = args[1];
    if (!settings.enabled || !settings.targetName?.trim() || !props || typeof props !== 'object') return;
    const children = props.children;
    if (typeof children !== 'string' || children.trim() !== settings.targetName.trim()) return;

    const typeName = type?.displayName || type?.name || type?.render?.displayName || type?.render?.name || '';
    const isKnownText = type === Text || type === RN?.Text || type === Animated?.Text;
    const looksLikeText = typeof typeName === 'string' && /text/i.test(typeName);
    // Discord may render usernames through custom Text wrappers. Exact-string matching
    // plus a style prop lets these wrappers pass through while keeping other content alone.
    if (!isKnownText && !looksLikeText && props.style === undefined) return;

    const nextProps = { ...props, children: mapText(children, settings.fontStyle) };
    const nextColor = colorValue(settings);
    if (nextColor !== undefined) nextProps.style = [props.style, { color: nextColor }];

    // Animated.Text is only substituted for native Text; preserve custom Discord wrappers.
    const nativeText = type === Text || type === RN?.Text;
    const useAnimated = nativeText && settings.colorEnabled && settings.colorMode !== 'solid' && !!Animated?.Text;
    args[0] = useAnimated ? Animated.Text : type;
    args[1] = nextProps;
  } catch (e) {
    logger?.warn?.('Could not transform a matching text element', e);
  }
}
function addPatcher(target, method) {
  if (!target || typeof target[method] !== 'function' || !patcher?.before) return;
  try {
    // Correct API order: before(targetObject, methodName, callback).
    const unpatch = patcher.before(target, method, patchElementArgs);
    if (typeof unpatch === 'function') unpatches.push(unpatch);
  } catch (e) { logger?.warn?.('Could not patch ' + method, e); }
}

function rowLabel(label, note) {
  return h(View, { style: { gap: 3, marginTop: 5 } },
    h(Text, { style: { color: '#F4F0FF', fontWeight: '700' } }, label),
    note ? h(Text, { style: { color: '#AAA7B5', fontSize: 12 } }, note) : null
  );
}
function choiceButton(label, active, onPress, sample) {
  return h(Pressable, {
    onPress,
    style: { borderWidth: 1, borderColor: active ? '#B69CFF' : '#4A4857', backgroundColor: active ? '#302744' : '#1C1B24', borderRadius: 10, padding: 11, marginBottom: 7, gap: 4 }
  },
    h(Text, { style: { color: '#F5F2FF', fontWeight: active ? '700' : '500' } }, label + (active ? '  ✓' : '')),
    sample ? h(Text, { style: { color: '#F5F2FF', fontSize: 18 } }, sample) : null
  );
}
function chip(label, active, onPress) {
  return h(Pressable, { onPress, style: { borderWidth: 1, borderColor: active ? '#B69CFF' : '#4A4857', backgroundColor: active ? '#302744' : '#1C1B24', borderRadius: 18, paddingVertical: 8, paddingHorizontal: 11, marginRight: 7, marginBottom: 7 } },
    h(Text, { style: { color: '#F5F2FF', fontWeight: active ? '700' : '400' } }, label + (active ? ' ✓' : ''))
  );
}
function toggleControl(value, onValueChange) {
  if (Switch) return h(Switch, { value: !!value, onValueChange });
  return h(Pressable, {
    onPress: () => onValueChange(!value),
    style: { borderWidth: 1, borderColor: value ? '#B69CFF' : '#4A4857', borderRadius: 18, paddingVertical: 8, paddingHorizontal: 12 }
  }, h(Text, { style: { color: '#F5F2FF', fontWeight: '700' } }, value ? 'ON' : 'OFF'));
}
function SettingsComponent() {
  if (!React?.useState || !h || !Text || !View || !ScrollView || !TextInput || !Pressable) return null;
  const [, setRevision] = React.useState(0);
  const settings = readSettings();
  const update = partial => { writeSettings(partial); setRevision(n => n + 1); };
  const target = settings.targetName || 'Darkio';
  const preview = mapText(target, settings.fontStyle);
  const previewColor = colorValue(settings) || '#FFFFFF';
  const inputStyle = { borderWidth: 1, borderColor: '#4A4857', borderRadius: 10, padding: 12, color: '#F5F2FF', backgroundColor: '#1C1B24', marginTop: 7 };
  return h(ScrollView, { contentContainerStyle: { padding: 16, paddingBottom: 30, gap: 12, backgroundColor: '#111018' } },
    h(Text, { style: { color: '#F5F2FF', fontSize: 23, fontWeight: '800' } }, 'Darkio Fonty Fun'),
    h(Text, { style: { color: '#BEBACB', fontSize: 13, lineHeight: 19 } }, 'Local name styling for this device only. Your Discord profile and public name stay unchanged.'),
    h(View, { style: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 } },
      h(View, { style: { flex: 1, paddingRight: 10 } }, rowLabel('Enable local styling', 'Only exact text matches are changed by this prototype.')),
      toggleControl(!!settings.enabled, enabled => update({ enabled }))
    ),
    rowLabel('Exact display name', 'Enter capitalization and spacing exactly as shown in Discord.'),
    h(TextInput, { value: settings.targetName, onChangeText: targetName => update({ targetName }), placeholder: 'Your exact display name', placeholderTextColor: '#777383', autoCapitalize: 'none', style: inputStyle }),
    rowLabel('Font Lab · Nitro-inspired', 'The real Discord styles are proprietary. These are Unicode look-alikes, not the actual Nitro font files.'),
    ...FONT_OPTIONS.map(option => choiceButton(option.label + ' · ' + option.note, settings.fontStyle === option.id, () => update({ fontStyle: option.id }), option.sample)),
    h(View, { style: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 } },
      h(View, { style: { flex: 1, paddingRight: 10 } }, rowLabel('Color FX', 'Solid color or animated gradient-style cycling.')),
      toggleControl(!!settings.colorEnabled, colorEnabled => update({ colorEnabled }))
    ),
    rowLabel('Color effect'),
    h(View, { style: { flexDirection: 'row', flexWrap: 'wrap' } }, ...COLOR_MODE_OPTIONS.map(option => chip(option.sample + ' ' + option.label, settings.colorMode === option.id, () => update({ colorMode: option.id })))),
    h(TextInput, { value: settings.color, onChangeText: color => update({ color }), placeholder: '#B69CFF', placeholderTextColor: '#777383', autoCapitalize: 'characters', style: { ...inputStyle, borderColor: validHexColor(settings.color) ? '#4A4857' : '#FF657A' } }),
    validHexColor(settings.color) ? null : h(Text, { style: { color: '#FF657A', fontSize: 12 } }, 'Use a 6-digit hex color, such as #B69CFF.'),
    settings.colorMode !== 'solid' ? h(React.Fragment, null,
      rowLabel('Animation speed'),
      h(View, { style: { flexDirection: 'row', flexWrap: 'wrap' } }, ...SPEED_OPTIONS.map(option => chip(option.label, settings.animationSpeed === option.id, () => update({ animationSpeed: option.id }))))
    ) : null,
    h(View, { style: { borderRadius: 12, backgroundColor: '#1B1924', padding: 16, gap: 9, marginTop: 3 } },
      h(Text, { style: { color: '#A9A5B8', fontSize: 11, fontWeight: '700', letterSpacing: 1 } }, 'LIVE PREVIEW'),
      Animated?.Text ? h(Animated.Text, { style: { fontSize: 26, fontWeight: '800', color: previewColor } }, preview) : h(Text, { style: { fontSize: 26, fontWeight: '800', color: typeof previewColor === 'string' ? previewColor : '#B69CFF' } }, preview),
      h(Text, { style: { color: '#A9A5B8', fontSize: 11 } }, settings.colorMode === 'solid' ? 'Static color' : settings.colorMode.replace('-', ' ') + ' · ' + settings.animationSpeed + ' cycle')
    ),
    choiceButton('Reset all settings', false, () => { writeSettings({ ...DEFAULT_SETTINGS }); setRevision(n => n + 1); }, null),
    h(Text, { style: { color: '#918C9F', fontSize: 12, lineHeight: 17 } }, 'Prototype note: this intercepts supported React element creation and matches exact text. A matching name elsewhere may also be changed; some screens may be missed. Unicode glyphs vary by Android font. This does not unlock Nitro or copy Discord font files.')
  );
}

const lifecycle = {
  start() {
    if (!React || !RN || !Text || !View || !ScrollView || !TextInput || !Pressable) {
      logger?.error?.('Darkio Fonty Fun: required React Native APIs were not found on this Revenge Classic build.');
      return;
    }
    // createStorage is available in some Revenge Classic/Bunny builds too; do
    // not gate it on the newer spec-3 loader check.
    const persistentStorage = safeRead(() => revenge?.plugin?.createStorage?.())
      || safeRead(() => legacy?.plugin?.storage)
      || safeRead(() => revenge?.plugin?.storage);
    if (persistentStorage && typeof persistentStorage === 'object') storage = persistentStorage;
    else logger?.warn?.('Darkio Fonty Fun: persistent storage is unavailable; settings will last only for this session.');
    for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) if (storage[key] === undefined) storage[key] = value;
    // React Native's classic JSX transform uses createElement. Some Discord builds use jsx/jsxs helpers.
    addPatcher(React, 'createElement');
    try {
      const jsxRuntime = findByProps?.('jsx', 'jsxs');
      if (jsxRuntime) { addPatcher(jsxRuntime, 'jsx'); addPatcher(jsxRuntime, 'jsxs'); if (typeof jsxRuntime.jsxDEV === 'function') addPatcher(jsxRuntime, 'jsxDEV'); }
    } catch (_) {}
    syncAnimation(readSettings());
    logger?.log?.('Darkio Fonty Fun started (local rendering only).');
  },
  stop() {
    stopAnimation();
    while (unpatches.length) { try { unpatches.pop()(); } catch (_) {} }
    logger?.log?.('Darkio Fonty Fun stopped.');
  },
  SettingsComponent,
};

  if (isSpec3) return definePlugin(lifecycle);
  return {
    onLoad: lifecycle.start,
    onUnload: lifecycle.stop,
    settings: lifecycle.SettingsComponent,
  };
})();
