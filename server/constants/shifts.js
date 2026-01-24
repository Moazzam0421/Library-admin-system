const SHIFTS = [
  // 4 HOURS
  { code: "4H_1", duration: 4, start: 6, end: 10, fee: 300 },
  { code: "4H_2", duration: 4, start: 10, end: 14, fee: 300 },
  { code: "4H_3", duration: 4, start: 14, end: 18, fee: 300 },
  { code: "4H_4", duration: 4, start: 18, end: 22, fee: 300 },
  { code: "4H_5", duration: 4, start: 22, end: 26, fee: 300 }, // 2am
  { code: "4H_6", duration: 4, start: 26, end: 30, fee: 300 }, // 6am

  // 8 HOURS
  { code: "8H_1", duration: 8, start: 6, end: 14, fee: 500 },
  { code: "8H_2", duration: 8, start: 10, end: 18, fee: 500 },
  { code: "8H_3", duration: 8, start: 14, end: 22, fee: 500 },
  { code: "8H_4", duration: 8, start: 18, end: 26, fee: 500 },
  { code: "8H_5", duration: 8, start: 22, end: 30, fee: 500 },

  // 12 HOURS
  { code: "12H_1", duration: 12, start: 6, end: 18, fee: 700 },
  { code: "12H_2", duration: 12, start: 10, end: 22, fee: 700 },
  { code: "12H_3", duration: 12, start: 14, end: 26, fee: 700 },
  { code: "12H_4", duration: 12, start: 18, end: 30, fee: 700 },
];

module.exports = { SHIFTS };
