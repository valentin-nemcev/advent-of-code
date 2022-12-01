export function task1(input: string): number {
  const chunks: number[][] = [];
  let nextChunk: number[] = [];
  input.split("\n").forEach((line) => {
    if (line == "") {
      if (nextChunk.length > 0) {
        chunks.push(nextChunk);
        nextChunk = [];
      }
    } else {
      nextChunk.push(parseInt(line));
    }
  });
  const sums = chunks.map((chunk) => chunk.reduce((a, b) => a + b));
  sums.sort((a, b) => b - a);
  return sums[0];
}

// Learn more at https://deno.land/manual/examples/module_metadata#concepts
if (import.meta.main) {
  const input1 = await Deno.readTextFile("input/1.txt");
  console.log(task1(input1));
}
