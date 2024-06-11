import { useState, useSyncExternalStore } from "react";

/** *********************************************************************
 *
 *  メイン。
 *
 * @returns
 */
export default function Game() {
  // 盤の履歴 初期状態を定義。
  const [history, setHistory] = useState([Array(9).fill(null)]);

  // currentMove：今、何手目か。
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;

  // 最新履歴の盤の状態を取得。
  const currentSquares = history[currentMove];

  /**
   *
   */
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  /**
   * ○手目ボzタンを押した時に、○手目を表示する。また、次がXかOかもそれに合わせる。
   */
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  /**
   * 手順の履歴ボタンを作成し、<li>タグの配列で返す。
   */
  let moves = history.map((squares, move) => {
    // とりだした値, 要素番号

    // ボタンに表示する文字列を組み立てる。
    let description;
    if (move > 0) {
      // １手目以降用の文字列を生成。
      description = "go to move #" + move;
    } else {
      // 0手目（初期状態）用の文字列を生成。
      description = "go to game start";
    }

    // 組み立てた文字列をのボタンを、リストで設置する。
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  if (!calculateWinner(currentSquares)) {
    moves.push("you are move#" + (currentMove + 1));
  } else {
    moves.push("投了");
  }

  return (
    <div className="game">
      {/* ３×３のマス。 */}
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      {/* 手順の履歴のボタン。 */}
      <div className="game-info">
        <ol>{moves}</ol>
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
    alert(i);
    // クリックした１マスの値に、すでに○とか×とかが入っている場合は、何もせずぬける。
    // すでに勝者が決まっている場合は、何もせずぬける。
    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    // 直前の盤面の状態を元に、クリック後の盤面の状態を作成する。
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "x";
    } else {
      nextSquares[i] = "○";
    }
    onPlay(nextSquares);
  }

  let rows = []; // Squareタグ３つ分を入れる配列。
  let rowAndColumns = []; // divタグ付きのSquareタグ３つ分 を３行分入れる配列。
  let index = 0; // マス９つ分の連番を表す添字。0〜8。

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      // indexを使用すると、Boad内でスコープが有効なため、handleClick時の動作がどのマスもindexが9になってしまう。
      // そのため関数をはさんで、狭いスコープの中で別の添字を使用する。
      const createRow = function (localIndex) {
        return (
          <Square
            key={localIndex}
            value={localIndex}
            onSquareClick={() => handleClick(localIndex)}
          />
        );
      };

      rows.push(createRow(index));
      index = index + 1;
    }
    rowAndColumns.push(<div className="board-row"> {rows} </div>);
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
function Square({ value, onSquareClick }) {
  // イベントを表す変数は、on〇〇という名前で書くのが一般的らしい。
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

/** *********************************************************************
 * 今時点で、どちらかが勝っていれば、勝っている方の×か○かの文字列を返す。
 * どちらも勝っていなければ、nullを返す。
 * @param {*} squares
 * @returns
 */
function calculateWinner(squares) {
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

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
