import { Column } from '@devexpress/dx-react-grid';

function getColumnSortRank(column: Column) {
  const order: RegExp[] = [
    /^id$/,
    /^name$/
  ];
  for (const [i, regexp] of order.entries()) {
    if (column.name.match(regexp)) {
      return i;
    }
  }
  return Infinity;
}

export function defaultColumnSort(a: Column, b: Column) {
  const aSort = getColumnSortRank(a);
  const bSort = getColumnSortRank(b);
  return aSort - bSort;
}