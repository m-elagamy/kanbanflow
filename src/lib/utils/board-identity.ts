const boardIdentityStyles = [
  "bg-[#cfe5ff] text-[#174a78] dark:bg-[#2e5277] dark:text-[#d9edff]",
  "bg-[#d3edcf] text-[#2d6b3d] dark:bg-[#376c43] dark:text-[#d8f7df]",
  "bg-[#f2d6ee] text-[#8a356d] dark:bg-[#78486f] dark:text-[#ffdff2]",
  "bg-[#f0d8c3] text-[#8a5127] dark:bg-[#8b5b35] dark:text-[#ffebd5]",
  "bg-[#ddd8ff] text-[#4d3c8c] dark:bg-[#51468e] dark:text-[#eeeaff]",
  "bg-[#c9eadb] text-[#216850] dark:bg-[#2d7158] dark:text-[#d1f7e6]",
  "bg-[#f5d8dc] text-[#8d3f54] dark:bg-[#874854] dark:text-[#ffe4e8]",
  "bg-[#c8ebe8] text-[#226a69] dark:bg-[#2f7774] dark:text-[#d5fbf8]",
  "bg-[#d2dafa] text-[#33448a] dark:bg-[#3b4e91] dark:text-[#e0e7ff]",
  "bg-[#e7edbd] text-[#58621e] dark:bg-[#606b32] dark:text-[#f2f6c8]",
  "bg-[#ead8f0] text-[#6d3b79] dark:bg-[#74477f] dark:text-[#f8e3ff]",
  "bg-[#c9e9f3] text-[#236479] dark:bg-[#2f7186] dark:text-[#d7f4ff]",
  "bg-[#d6efdf] text-[#316946] dark:bg-[#39734f] dark:text-[#def8e5]",
  "bg-[#f6dfd2] text-[#8f4b34] dark:bg-[#8e5640] dark:text-[#ffe7d9]",
  "bg-[#e1dcf5] text-[#51448a] dark:bg-[#5a4d91] dark:text-[#eeeaff]",
  "bg-[#cce3f6] text-[#255b81] dark:bg-[#315f82] dark:text-[#def2ff]",
  "bg-[#c8dcff] text-[#24458a] dark:bg-[#304d8b] dark:text-[#e0e8ff]",
  "bg-[#f6e7ba] text-[#7b5b16] dark:bg-[#79602e] dark:text-[#ffefc4]",
  "bg-[#e6d0e5] text-[#624466] dark:bg-[#684966] dark:text-[#f5e1f0]",
  "bg-[#cfe5ff] text-[#174a78] dark:bg-[#2e5277] dark:text-[#d9edff]",
  "bg-[#f6d5e5] text-[#943b64] dark:bg-[#874661] dark:text-[#ffdfef]",
  "bg-[#d9e0e8] text-[#46586e] dark:bg-[#53677d] dark:text-[#e5efff]",
  "bg-[#e3d4f3] text-[#654783] dark:bg-[#70518f] dark:text-[#f1e6ff]",
  "bg-[#cbe6f2] text-[#2d617b] dark:bg-[#39738d] dark:text-[#ddf5ff]",
] as const;

type BoardIdentitySource = { id: string };

export function getBoardIdentityPaletteIndices<T extends BoardIdentitySource>(
  boards: T[],
) {
  const sortedBoards = [...boards].sort((a, b) => a.id.localeCompare(b.id));
  return new Map(
    sortedBoards.map((board, index) => [
      board.id,
      index % boardIdentityStyles.length,
    ]),
  );
}

export function getBoardIdentity(
  title: string,
  id: string,
  paletteIndex?: number,
) {
  let hash = 0;
  for (const character of id) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  }

  return {
    initial: Array.from(title.trim())[0] ?? "?",
    className:
      boardIdentityStyles[paletteIndex ?? hash % boardIdentityStyles.length],
  };
}
