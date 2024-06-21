import { useState, useSyncExternalStore } from "react";

/** *********************************************************************
 *
 *  メイン。
 *
 * 課題２の考えた点
 *  ソートボタンを押した際に、手順の履歴（moves）の上下並び順を変えたい。
 *  ・movesを変更するには、あらかじめuseStateしておき、新しい並び順でsetしてあげないといけない。
 *  　movesは今までuseStateしていなかったため、useStateするように変更した。
 *  ・movesをsetする処理の記載場所がGameの直下にあるとToo many re-rendersになってしまうため、
 *    マスをクリックした場合にのみsetする必要がある。
 *    Gameの直下ではなく、handlePlay時にmovesを作成しsetするように変更した。
 *  ・movesを作成するための情報であるhistoryは、同じhandlePlayでsetしたばかりでまだ反映（再表示）されていない(?)ため、
 *    set後のhistoryではなく、setに使用するhistoryを使用するように変更した。
 *
 * 課題３の考えた点
 * ・
 *
 *
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

  // historyに対してreverseをかけるかどうか。
  const [isExecuteReberse, setIsExecuteReverse] = useState(false);

  const [movesAAA, setMovesAAA] = useState(
    createMoves([Array(9).fill(null)], 0, isExecuteReberse)
  );

  /**
   *
   */
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);

    const moves = createMoves(
      nextHistory,
      nextHistory.length - 1,
      isExecuteReberse
    );
    setMovesAAA(moves);
  }

  /**
   * ○手目ボzタンを押した時に、○手目を表示する。また、次がXかOかもそれに合わせる。
   */
  function jumpTo(_nextMove, _isExecuteReberse) {
    setCurrentMove(_nextMove);
    // const moves = createMoves(history, _nextMove, _isExecuteReberse);
    // setMovesAAA(moves);
  }

  function createMoves(_history, _currentMove, _isExecuteReberse) {
    /**
     * 手順の履歴ボタンを作成し、<li>タグの配列で返す。
     */
    let moves = [];
    moves = _history.map((squares, move) => {
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
          <button onClick={() => jumpTo(move, _isExecuteReberse)}>
            {description}
          </button>
        </li>
      );
    });

    // if (!calculateWinner(_history[_currentMove])) {
    //   moves.push("you are move#" + (_currentMove + 1));
    // } else {
    //   moves.push("Game end");
    // }

    let newMoves = [];
    if (_isExecuteReberse == true) {
      newMoves = moves.toReversed();
    } else {
      newMoves = moves;
    }

    return newMoves;
  }

  /**
   * ソートボタン押下時に手順の履歴を昇降逆順する。
   */
  function handleSortMoves(_isExecuteReberse) {
    const newIsExecuteReverse = !_isExecuteReberse;
    setIsExecuteReverse(newIsExecuteReverse);
    const moves = createMoves(history, currentMove, newIsExecuteReverse);
    setMovesAAA(moves);
  }

  let nextMoveNoMessage = "";
  if (!calculateWinner(history[currentMove])) {
    nextMoveNoMessage = "you are move#" + (currentMove + 1);
  } else {
    nextMoveNoMessage = "Game end";
  }

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
        <ol>{movesAAA}</ol>
        {nextMoveNoMessage}
      </div>
      {/* 手順の履歴を並べ替えるボタン。 */}
      <div>
        <button onClick={() => handleSortMoves(isExecuteReberse)}>
          {sortButtonValue}
        </button>
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
            value={squares[localIndex]}
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
