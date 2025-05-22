/**
 * このファイルの実行の仕方
 * ターミナルで、node getFood.test.js と打つ。
 */
const { getFood } = require("./getFood");

// １週間の食料を取得する
const sinamono1 = getFood(4, 2000, "");
console.log(sinamono1);

// １日の食料とピザを取得する
const sinamono2 = getFood(1, 2000, "ピザ");
console.log(sinamono2);
