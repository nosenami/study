/**
 * 食料を取得する
 *
 * @param kikan 期間の区分（1:１日、2:２日、3:３日、4:１週間）
 * @param kingaku 金額
 * @param option 指定して買いたいもの
 * @returns 品物が入ったオブジェクト
 */
function getFood(kikan, kingaku, option) {
  let sinamono = [];

  switch (kikan) {
    case 1:
      sinamono = [imo, niku];
      break;
    case 2:
      sinamono = [imo, niku, kyabetu, sakana];
      break;
    case 3:
      sinamono = [imo, niku, kyabetu, sakana, daikon, tamago];
      break;
    case 4:
      sinamono = [imo, niku, kyabetu, sakana, daikon, reitouUdon, tamago];
      break;
    default:
      break;
  }

  if (option != "") {
    sinamono.push(option);
  }

  return sinamono;
}

const kome = "お米";
const gyunyu = "牛乳";
const sakana = "魚";
const niku = "肉";
const otya = "お茶";
const kyabetu = "キャベツ";
const imo = "いも";
const daikon = "だいこん";
const reitouUdon = "冷凍うどん";
const tamago = "たまご";

module.exports = {
  getFood,
};
