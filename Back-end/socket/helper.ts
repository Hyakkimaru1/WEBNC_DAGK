export default function checkWin(a, x, y, turn) {
  //   console.log("x,y,turn", x, y, turn);
  //   console.table("a", a);
  if (a) {
    if (checkVertical(a, x, y, turn)) return true;
    if (checkHorizontal(a, x, y, turn)) return true;
    if (checkDiagonalMain(a, x, y, turn)) return true;
    if (checkDiagonal(a, x, y, turn)) return true;
  }

  return false;
}

function checkVertical(a, x, y, turn) {
  let i = x,
    j = y;
  let count = 0;
  while (i >= 0 && i < 25 && a[i][j] == turn) {
    count++;
    if (count == 5) return true;
    i++;
  }
  i = x - 1;
  j = y;
  while (i >= 0 && i < 25 && a[i][j] == turn) {
    count++;
    if (count == 5) return true;
    i--;
  }
  return false;
}
function checkHorizontal(a, x, y, turn) {
  let i = x,
    j = y;
  let count = 0;
  while (j >= 0 && j < 25 && a[i][j] == turn) {
    count++;
    if (count == 5) return true;
    j++;
  }
  i = x;
  j = y - 1;
  while (j >= 0 && j < 25 && a[i][j] == turn) {
    count++;
    if (count == 5) return true;
    j--;
  }
  return false;
}

function checkDiagonalMain(a, x, y, turn) {
  let i = x,
    j = y;
  let count = 0;
  while (i >= 0 && i < 25 && j >= 0 && j < 25 && a[i][j] == turn) {
    count++;
    if (count == 5) return true;
    j++;
    i--;
  }
  i = x + 1;
  j = y - 1;
  while (i >= 0 && i < 25 && j >= 0 && j < 25 && a[i][j] == turn) {
    count++;
    if (count == 5) return true;
    i++;
    j--;
  }
  return false;
}
function checkDiagonal(a, x, y, turn) {
  let i = x,
    j = y;
  let count = 0;
  while (i >= 0 && i < 25 && j >= 0 && j < 25 && a[i][j] == turn) {
    count++;
    if (count == 5) return true;
    i--;
    j--;
  }
  i = x + 1;
  j = y + 1;
  while (i >= 0 && i < 25 && j >= 0 && j < 25 && a[i][j] == turn) {
    count++;
    if (count == 5) return true;
    i++;
    j++;
  }
  return false;
}
