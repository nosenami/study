import { useState } from "react";

/** *********************************************************************
 *
 *  メイン。
 *
 *
 * @returns
 */
export default function Game() {
  // 盤の履歴。
  const [history, setHistory] = useState([Array(9).fill(null)]);

  // 打った座標の履歴。
  const [pointHistory, setPointHistory] = useState([[0, 0]]);

  // 何手目を打ち終わった状態か。
  const [currentMove, setCurrentMove] = useState(0);

  // 今から打つのは×である。
  const xIsNext = currentMove % 2 === 0;

  // 最新履歴の盤の状態。
  const currentSquares = history[currentMove];

  // 手順の履歴ボタンを降順に表示するか。
  const [isExecuteReberse, setIsExecuteReverse] = useState(false);

  // 手順の履歴ボタンの配列。
  const [moves, setMoves] = useState(
    createMoves([Array(9).fill(null)], false, [[0, 0]])
  );

  /**
   *
   */
  function handlePlay(nextSquares, _pointHistory) {
    // 盤の履歴に、打った盤の状態を追加する。
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);

    const newPointHistory = [
      ...pointHistory.slice(0, currentMove + 1),
      _pointHistory,
    ];
    setPointHistory(newPointHistory);

    setCurrentMove(nextHistory.length - 1);
    const moves = createMoves(nextHistory, isExecuteReberse, newPointHistory);
    setMoves(moves);
  }

  /**
   * 手順の履歴ボタン押した時に、○手目を表示する。
   */
  function jumpTo(_nextMove) {
    setCurrentMove(_nextMove);
  }

  /**
   * 手順の履歴ボタンを作成する。
   * （でたらめにやって関数に変えてみたりしたが、別に関数かしなくてもいける気がする）
   * @param {*} _history
   * @param {*} _isMovesReverse
   * 手順の履歴ボタンの並び順を、降順にする必要があるかを示す。
   * true  並び順を降順にしたいため、逆転する必要がある。
   * false 並び順を昇順にしたいため、逆転する必要はない。
   * 通常時は、isExecuteReberseをそのまま渡してもらう。
   * ソートボタン押下時のみ、反転させたisExecuteReberseを渡してもらう。
   * @param {*} _pointHistory
   * @returns
   */
  function createMoves(_history, _isMovesReverse, _pointHistory) {
    // 手順の履歴ボタンを作成し、<li>タグの配列で返す。
    let moves = [];
    moves = _history.map((squares, move) => {
      // ボタンに表示する文字列を組み立てる。
      let description;
      if (move > 0) {
        // １手目以降用の文字列を生成。
        description = `go to move #${move}  (${_pointHistory[move][0]},${_pointHistory[move][1]})`;
      } else {
        // 0手目（初期状態）用の文字列を生成。
        description = "go to game start";
      }

      // 組み立てた文字列をのボタンを、リストで設置する。
      return (
        <li key={move}>
          <button key={move} onClick={() => jumpTo(move)}>
            {description}
          </button>
        </li>
      );
    });

    // 手順の履歴ボタンの配列の並び順を変更する。
    let sortedMoves = [];
    if (_isMovesReverse == true) {
      sortedMoves = moves.toReversed();
    } else {
      sortedMoves = moves;
    }

    return sortedMoves;
  }

  /**
   * ソートボタン押下時に手順の履歴を昇降逆順する。
   */
  function handleSortMoves() {
    setIsExecuteReverse((isExecuteReberse) => !isExecuteReberse);
    const newMoves = createMoves(history, !isExecuteReberse, pointHistory);
    setMoves(newMoves);
  }

  // 次が何手目かを表示する文言を組み立てる。
  let nextMoveNoMessage = "";
  if (!calculateWinner(history[currentMove])) {
    if (currentMove < 9) {
      nextMoveNoMessage = "you are move#" + (currentMove + 1);
    } else {
      nextMoveNoMessage = "ゲーム終了 引き分けです";
    }
  } else {
    nextMoveNoMessage = "Game end";
  }

  // ソートボタンに表示する文言を組み立てる。
  let sortButtonValue = "";
  if (isExecuteReberse) {
    sortButtonValue = "昇順に並べ替える";
  } else {
    sortButtonValue = "降順に並べ替える";
  }

  /**
   * リターン。
   */
  return (
    <div className="game">
      {/* ３×３のマス。 */}
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      {/* 手順の履歴のボタン。 */}
      <div className="game-info">
        <ol>{moves}</ol>
        {nextMoveNoMessage}
      </div>
      {/* 手順の履歴を並べ替えるボタン。 */}
      <div>
        <button onClick={() => handleSortMoves()}>{sortButtonValue}</button>
      </div>
    </div>
  );
}

/** ***********************************************************
 * ９×９のボードの、１ターン分。
 */
function Board({ xIsNext, squares, onPlay }) {
  const winner = calculateWinner(squares);

  let status;
  if (winner) {
    status = "winner : " + winner;
  } else {
    status = "next player : " + (xIsNext ? "x" : "o");
  }

  /**
   * マスをクリックした際の処理。
   * i : マス何番目をクリックしたか。0〜8の数字。
   */
  function handleClick(i) {
    // クリックした１マスの値に、すでに○とか×とかが入っている場合は、何もせずぬける。
    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    // クリックした１マスの座標を取得する。
    let point = [];
    switch (i) {
      case 0:
        point = [1, 1];
        break;
      case 1:
        point = [1, 2];
        break;
      case 2:
        point = [1, 3];
        break;
      case 3:
        point = [2, 1];
        break;
      case 4:
        point = [2, 2];
        break;
      case 5:
        point = [2, 3];
        break;
      case 6:
        point = [3, 1];
        break;
      case 7:
        point = [3, 2];
        break;
      case 8:
        point = [3, 3];
        break;
    }

    // 直前の盤面の状態を元に、クリック後の盤面の状態を作成する。
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "x";
    } else {
      nextSquares[i] = "○";
    }
    onPlay(nextSquares, point);
  }

  let rows = []; // Squareタグ３つ分を入れる配列。
  let rowAndColumns = []; // divタグ付きのSquareタグ３つ分 を３行分入れる配列。
  let index = 0; // マス９つ分の連番を表す添字。0〜8。
  let squareClassName = "";
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      // indexを使用すると、Boad内でスコープが有効なため、handleClick時の動作がどのマスもindexが9になってしまう。
      // そのため関数をはさんで、狭いスコープの中で別の添字を使用する。
      const createRow = function (localIndex) {
        const winningPatternArray = calculateWinPattern(squares);

        if (winningPatternArray.includes(localIndex)) {
          squareClassName = "square_win";
        } else {
          squareClassName = "square";
        }

        return (
          <Square
            key={localIndex}
            value={squares[localIndex]}
            onSquareClick={() => handleClick(localIndex)}
            css={squareClassName}
          />
        );
      };

      rows.push(createRow(index));
      index = index + 1;
    }
    rowAndColumns.push(
      <div className="board-row" key={crypto.randomUUID()}>
        {rows}
      </div>
    );
    rows = [];
  }

  return (
    <>
      <div className="status">{status}</div>
      {rowAndColumns}
    </>
  );
}

/** *********************************************************************
 *
 * マス一つ分を表す部品タグ（コンポーネント）。
 *  value : ×か○の表示用文字列。
 *  onSquareClick : マスをクリックした際の挙動（を処理する、Boadからもらった関数）。
 *
 * @param {*} param0
 * @returns
 */
function Square({ value, onSquareClick, css }) {
  // イベントを表す変数は、on〇〇という名前で書くのが一般的らしい。
  return (
    <button className={css} onClick={onSquareClick}>
      {value}
    </button>
  );
}

/** *********************************************************************
 * 勝利情報の取得
 * 受け取った盤の勝敗判定を行い、どちらかが勝っていれば、勝利情報を配列で返す。
 * どちらも勝っていなければ、nullを返す。
 * @param {*} squares
 * @returns　要素0番目：勝者（◯か×）　要素1〜3番目：勝利につながった３つのマス目の番号
 */
function calculateWinInfo(squares) {
  // 勝ちパターンの定義。
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  // 受け取った盤の状態が、勝ちパターンのいずれかに当てはまっている場合は、勝っている方の×か○かの文字列を返す
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], a, b, c];
    }
  }

  return null;
}

/** *********************************************************************
 * 勝者を取得
 * @param {*} squares
 * @returns 勝者（◯か×）
 */
function calculateWinner(squares) {
  // 勝利情報を取得する。
  const winInfo = calculateWinInfo(squares);
  // 取得した勝利情報をもとに、勝者を返却する。
  if (winInfo) {
    return winInfo[0];
  } else {
    return null;
  }
}

/** *********************************************************************
 * 勝者を取得
 * @param {*} squares
 * @returns 勝利につながった３つのマス目の番号、それぞれ配列の要素０〜２番目に入れて返す。
 */
function calculateWinPattern(squares) {
  // 勝利情報を取得する。
  const winInfo = calculateWinInfo(squares);
  // 取得した勝利情報をもとに、勝利につながった３つのマス目の番号を返却する。
  if (winInfo) {
    return [winInfo[1], winInfo[2], winInfo[3]];
  } else {
    return [];
  }
}
