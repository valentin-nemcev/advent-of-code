// @deno-types="npm:@types/lodash"
import _ from "npm:lodash";

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
  if (nextChunk.length > 0) {
    chunks.push(nextChunk);
  }
  const sums = chunks.map((chunk) => chunk.reduce((a, b) => a + b));
  sums.sort((a, b) => b - a);
  return sums[0] + sums[1] + sums[2];
}

// lol js
function mod(a: number, b: number): number {
  return ((a % b) + b) % b;
}

export function task2(input: string): number {
  return input.split("\n").filter(Boolean).map((line) => {
    const [abc, xyz] = line.split(" ");
    const [theirs, mine] = [
      abc.charCodeAt(0) - "A".charCodeAt(0) + 1,
      xyz.charCodeAt(0) - "X".charCodeAt(0) + 1,
    ];
    const outcome = mod(mine - theirs, 3);

    return mine + (outcome == 1 ? 6 : outcome == 0 ? 3 : 0);
  }).reduce((a, b) => a + b);
}

export function task2b(input: string): number {
  return input.split("\n").filter(Boolean).map((line) => {
    const [abc, xyz] = line.split(" ");
    const [theirs, outcome] = [
      abc.charCodeAt(0) - "A".charCodeAt(0),
      xyz.charCodeAt(0) - "X".charCodeAt(0) - 1,
    ];
    const mine = mod(theirs + outcome, 3);
    return mine + 1 + (outcome == 1 ? 6 : outcome == 0 ? 3 : 0);
  }).reduce((a, b) => a + b);
}

export function letterPriority(letter: string): number {
  return letter < "a"
    ? letter.charCodeAt(0) - "A".charCodeAt(0) + 27
    : letter.charCodeAt(0) - "a".charCodeAt(0) + 1;
}

export function task3(input: string): number {
  return input.split("\n").filter(Boolean).map((line) => {
    const mid = line.length / 2;
    const [first, second] = [line.slice(0, mid), line.slice(mid)].map((l) =>
      l.split("")
    );
    const commonLetter = _.intersection(first, second)[0];
    return letterPriority(commonLetter);
  }).reduce((a, b) => a + b);
}

export function task3b(input: string): number {
  return _.chunk(input.split("\n").filter(Boolean), 3).map(
    (lines) => {
      const letters = lines.map((l) => l.split(""));
      const commonLetter = _.intersection(...letters)[0];
      return letterPriority(commonLetter);
    },
  ).reduce((a, b) => a + b);
}

// Learn more at https://deno.land/manual/examples/module_metadata#concepts
if (import.meta.main) {
  const input = await Deno.readTextFile("input/3.txt");
  console.log(task3b(input));
}
