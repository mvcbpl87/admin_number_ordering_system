function swap(items: any[], leftIndex: number, rightIndex: number) {
  let temp = items[leftIndex];
  items[leftIndex] = items[rightIndex];
  items[rightIndex] = temp;
}

function partition(items: any[], left: number, right: number) {
  let pivot = items[Math.floor((right + left) / 2)].value;
  let i = left;
  let j = right;

  while (i <= j) {
    while (items[i].value < pivot) {
      i++;
    }
    while (items[j].value > pivot) {
      j--;
    }
    if (i <= j) {
      swap(items, i, j);
      i++;
      j--;
    }
  } // End of while
  return i;
}

export default function quickSort(items: any[], left: number, right: number) {
  let index;
  if (items.length > 1) {
    index = partition(items, left, right);
    if (left < index - 1) {
      quickSort(items, left, index - 1);
    }
    if (index < right) {
      quickSort(items, index, right);
    }
  }
  return items;
}
