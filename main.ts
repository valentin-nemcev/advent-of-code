// @deno-types="npm:@types/lodash"
import _ from "npm:lodash";

type Task<T = number> = (input: string[]) => [T, T];

export const task1: Task = (input) => {
  const chunks: number[][] = [];
  let nextChunk: number[] = [];
  input.forEach((line) => {
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
  return [sums[0], sums[0] + sums[1] + sums[2]];
};

// lol js
const mod = (a: number, b: number): number => ((a % b) + b) % b;

const letterCode = (offset: string, letter: string): number =>
  letter.charCodeAt(0) - offset.charCodeAt(0);

export const task2: Task = (input) => {
  let scoreA = 0;
  let scoreB = 0;
  input.forEach((line) => {
    const [abc, xyz] = line.split(" ");
    const [theirs, second] = [letterCode("A", abc), letterCode("X", xyz)];

    let yours = second;
    let outcome = mod(yours - theirs + 1, 3);
    scoreA += yours + 1 + outcome * 3;

    outcome = second;
    yours = mod(theirs + outcome - 1, 3);
    scoreB += yours + 1 + outcome * 3;
  });
  return [scoreA, scoreB];
};

export const letterPriority = (letter: string): number =>
  letter.charCodeAt(0) -
  (letter < "a" ? "A".charCodeAt(0) - 26 : "a".charCodeAt(0)) + 1;

export const task3: Task = (input) => {
  let scoreA = 0;
  let scoreB = 0;
  input.forEach((line) => {
    const mid = line.length / 2;
    const [first, second] = [line.slice(0, mid), line.slice(mid)].map((l) =>
      l.split("")
    );
    const commonLetter = _.intersection(first, second)[0];
    scoreA += letterPriority(commonLetter);
  });
  _.chunk(input, 3).forEach(
    (lines) => {
      const letters = lines.map((l) => l.split(""));
      const commonLetter = _.intersection(...letters)[0];
      scoreB += letterPriority(commonLetter);
    },
  );
  return [scoreA, scoreB];
};

export const task4: Task = (input) => {
  let scoreA = 0;
  let scoreB = 0;
  const contains = ([a1, a2]: [number, number], [b1, b2]: [number, number]) =>
    a1 >= b1 && a2 <= b2;
  const partiallyOverlaps = (
    [a1]: [number, number],
    [b1, b2]: [number, number],
  ) => a1 >= b1 && a1 <= b2;

  input.forEach((line) => {
    const [a, b] = line.split(",").map((int) =>
      int.split("-").map((d) => parseInt(d)) as [number, number]
    );
    scoreA += Number(contains(a, b) || contains(b, a));
    scoreB += Number(partiallyOverlaps(a, b) || partiallyOverlaps(b, a));
  });

  return [scoreA, scoreB];
};

export const task5: Task<string> = (input) => {
  const splitAt = input.indexOf("");
  const [stackLines, moves] = [
    input.slice(0, splitAt - 1),
    input.slice(splitAt + 1),
  ];

  const numbers = (input[splitAt - 1].match(/\d+/g) ?? []).map(Number);

  const stacks: string[][][] = [0, 1].map(() =>
    Array(numbers[numbers.length - 1]).fill(null).map(
      () => [],
    )
  );

  stackLines.reverse().map((line) => {
    Array.from(line.matchAll(/(?:\[(\w)\]| {3})(?: |$)/g), (m) => m[1]).forEach(
      (letter, i) => {
        if (letter != null) stacks.forEach((s) => s[i].push(letter));
      },
    );
  });

  moves.forEach((move) => {
    const match = move.match(/move (\d+) from (\d+) to (\d+)/) ?? [];
    const [amount, from, to] = match.slice(1).map(Number);
    for (let i = 0; i < amount; i++) {
      stacks[0][to - 1].push(stacks[0][from - 1].pop()!);
    }
    stacks[1][to - 1].push(...stacks[1][from - 1].splice(-amount, amount));
  });

  return stacks.map((stack) => stack.map((s) => s[s.length - 1]).join("")) as [
    string,
    string,
  ];
};

const tasks = [task1, task2, task3, task4, task5];

// Learn more at https://deno.land/manual/examples/module_metadata#concepts
if (import.meta.main) {
  for (const [i, task] of tasks.entries()) {
    const input = (await Deno.readTextFile(`input/${i + 1}.txt`)).trim().split(
      "\n",
    );
    console.log("Task " + (i + 1), ...task(input));
  }
}
