// @deno-types="npm:@types/lodash"
import _ from "npm:lodash";
import { readLines } from "https://deno.land/std@0.167.0/io/mod.ts";
import { config } from "https://deno.land/std@0.167.0/dotenv/mod.ts";

import {
  arrayFromAsync,
  asyncBatch,
  asyncFirst,
  asyncFork,
  asyncMap,
  asyncReduce,
  asyncSplitWhen,
  asyncTakeSorted,
  execPipe,
  pipe,
} from "npm:iter-tools-es";

type Task<T1 = number, T2 = T1> = (
  input: AsyncIterableIterator<string>,
) => Promise<[T1, T2]>;

export const task1: Task = async (input) => {
  const sums = await arrayFromAsync(execPipe(
    input,
    asyncSplitWhen(_.isEmpty),
    asyncMap(pipe(asyncMap(Number), asyncReduce(_.add))),
    asyncTakeSorted(3),
  ));
  return [sums[2], _.sum(sums)];
};

// lol js
const mod = (a: number, b: number): number => ((a % b) + b) % b;

const letterCode = (offset: string, letter: string): number =>
  letter.charCodeAt(0) - offset.charCodeAt(0);

export const task2: Task = async (input) => {
  let scoreA = 0;
  let scoreB = 0;
  for await (const line of input) {
    const [abc, xyz] = line.split(" ");
    const [theirs, second] = [letterCode("A", abc), letterCode("X", xyz)];

    let yours = second;
    let outcome = mod(yours - theirs + 1, 3);
    scoreA += yours + 1 + outcome * 3;

    outcome = second;
    yours = mod(theirs + outcome - 1, 3);
    scoreB += yours + 1 + outcome * 3;
  }
  return [scoreA, scoreB];
};

export const task3: Task = async (input) => {
  let scoreA = 0;
  let scoreB = 0;
  const letterPriority = (letter: string): number =>
    letter.charCodeAt(0) -
    (letter < "a" ? "A".charCodeAt(0) - 26 : "a".charCodeAt(0)) + 1;
  const [input1, input2] = asyncFork(input);
  for await (const line of input1) {
    const mid = line.length / 2;
    const [first, second] = [line.slice(0, mid), line.slice(mid)].map((l) =>
      l.split("")
    );
    const commonLetter = _.intersection(first, second)[0];
    scoreA += letterPriority(commonLetter);
  }
  for await (const lines of asyncBatch(3, input2)) {
    const letters = (await arrayFromAsync(lines)).map((l) => l.split(""));
    const commonLetter = _.intersection(...letters)[0];
    scoreB += letterPriority(commonLetter);
  }

  return [scoreA, scoreB];
};

export const task4: Task = async (input) => {
  let scoreA = 0;
  let scoreB = 0;
  const contains = ([a1, a2]: [number, number], [b1, b2]: [number, number]) =>
    a1 >= b1 && a2 <= b2;
  const partiallyOverlaps = (
    [a1]: [number, number],
    [b1, b2]: [number, number],
  ) => a1 >= b1 && a1 <= b2;

  for await (const line of input) {
    const [a, b] = line.split(",").map((int) =>
      int.split("-").map((d) => parseInt(d)) as [number, number]
    );
    scoreA += Number(contains(a, b) || contains(b, a));
    scoreB += Number(partiallyOverlaps(a, b) || partiallyOverlaps(b, a));
  }

  return [scoreA, scoreB];
};

export const task5: Task<string> = async (inputIt) => {
  const input = await arrayFromAsync(inputIt);
  const splitAt = input.indexOf("");
  const [stackLines, moves] = [
    input.slice(0, splitAt - 1),
    input.slice(splitAt + 1),
  ];

  const numbers = (input[splitAt - 1].match(/\d+/g) ?? []).map(Number);

  const stacks = _.times(
    2,
    () => _.times(_.last(numbers)!, () => [] as string[]),
  );

  stackLines.reverse().map((line) => {
    Array.from(line.matchAll(/(?:\[(\w)\]| {3})(?: |$)/g), (m) => m[1]).forEach(
      (letter, i) => {
        if (letter != null) stacks.forEach((s) => s[i].push(letter));
      },
    );
  });

  moves.forEach((move) => {
    const match = move.match(/move (\d+) from (\d+) to (\d+)/);
    const [amount, from, to] = match!.slice(1).map(Number);
    stacks[0][to - 1].push(
      ...stacks[0][from - 1].splice(-amount, amount).reverse(),
    );
    stacks[1][to - 1].push(...stacks[1][from - 1].splice(-amount, amount));
  });

  return stacks.map((s) => s.map(_.last).join("")) as [string, string];
};

export const task6: Task = async (inputIt) => {
  const input = (await asyncFirst(inputIt))!;
  let startOfPacket = 0;
  let startOfMessage = 0;
  for (let i = 1; i <= input.length; i++) {
    if (_.uniq(input.substring(i - 4, i)).length == 4 && !startOfPacket) {
      startOfPacket = i;
    }

    if (_.uniq(input.substring(i - 14, i)).length == 14 && !startOfMessage) {
      startOfMessage = i;
    }
  }
  return [startOfPacket, startOfMessage];
};

export const task7: Task = async (input) => {
  type FS = { name: string; size: number; files?: FS[] };
  const fs: FS = { name: "/", size: 0, files: [] };
  const stack: FS[] = [];
  for await (const line of input) {
    if (line.startsWith("$")) {
      const [, command, arg] = line.split(" ");
      if (command == "cd") {
        if (arg == "/" && stack.length == 0) stack.push(fs);
        else if (arg == "..") stack.pop();
        else stack.push(_.last(stack)!.files!.find((d) => d.name == arg)!);
      }
    } else {
      const [dirOrSize, name] = line.split(" ");
      _.last(stack)!.files!.push({
        name,
        ...dirOrSize == "dir"
          ? { size: 0, files: [] }
          : { size: Number(dirOrSize) },
      });
      if (dirOrSize != "dir") {
        _.forEachRight(stack, (dir) => dir.size += Number(dirOrSize));
      }
    }
  }
  const target = 30000000 - (70000000 - fs.size);

  let sum = 0;
  let dirSize = Number.POSITIVE_INFINITY;
  const walk = (dir: FS) => {
    if (!dir.files) return;
    if (dir.size <= 100000) sum += dir.size;
    if (dir.size >= target && dir.size <= dirSize) dirSize = dir.size;
    dir.files.forEach(walk);
  };

  walk(fs);

  return [sum, dirSize];
};

export const task8: Task = async (input) => {
  const trees = (await arrayFromAsync(input)).map((line) =>
    line.split("").map(Number)
  );

  const result = trees.map((line, x) =>
    line.map((tree, y) => {
      let visible = false, score = 1;
      [
        _.range(y + 1, line.length).map((y1, i) => [x, y1, i]),
        _.rangeRight(y).map((y1, i) => [x, y1, i]),
        _.range(x + 1, trees.length).map((x1, i) => [x1, y, i]),
        _.rangeRight(x).map((x1, i) => [x1, y, i]),
      ].forEach((ix) => {
        for (const [x, y, i] of ix) {
          if (tree > trees[x][y]) continue;
          score *= i + 1;
          return;
        }
        score *= ix.length;
        visible ||= true;
      });
      return { visible, score };
    })
  );

  return [
    _.sum(result.map((line) => line.filter((x) => x.visible).length)),
    _.max(result.map((line) => _.max(line.map((x) => x.score)))) ?? 0,
  ];
};

export const task9: Task = async (input) => {
  const snake = _.times(10, () => [0, 0]);
  const head = snake[0];
  const positionsA = new Set();
  const positionsB = new Set();

  const _print = () =>
    _.range(-15, 6).map((y) =>
      _.range(-11, 15).map((x) => {
        const i = snake.findIndex((n) => n[0] == x && n[1] == y);
        return i >= 0
          ? i
          : x == 0 && y == 0
          ? "s"
          : positionsB.has([x, y].join(","))
          ? "#"
          : ".";
      }).join("")
    )
      .join("\n");

  for await (const line of input) {
    const [dir, count] = line.split(" ");
    for (let i = 0; i < Number(count); i++) {
      if (dir == "U") head[1]--;
      if (dir == "D") head[1]++;
      if (dir == "L") head[0]--;
      if (dir == "R") head[0]++;

      for (let i = 1; i < snake.length; i++) {
        const nodeA = snake[i - 1], nodeB = snake[i];
        const dist = [nodeA[0] - nodeB[0], nodeA[1] - nodeB[1]];

        if (Math.abs(dist[0]) > 1 || Math.abs(dist[1]) > 1) {
          nodeB[0] += Math.sign(dist[0]);
          nodeB[1] += Math.sign(dist[1]);
        }
      }

      positionsA.add(snake[1].join(","));
      positionsB.add(_.last(snake)!.join(","));
    }
    // console.log(_print());
  }
  return [positionsA.size, positionsB.size];
};

export const task10: Task<number, string[]> = async (input) => {
  let cycle = 0, reg = 1, resultA = 0;
  const display = _.times(6, () => new Array(40));
  const incrCycle = () => {
    const row = Math.floor(cycle / 40), col = cycle % 40;
    display[row][col] = Math.abs(col - reg) <= 1 ? "#" : ".";
    cycle++;
    if ((cycle - 20) % 40 == 0) resultA += cycle * reg;
  };
  for await (const line of input) {
    const [instr, arg] = line.split(" ");
    if (instr == "noop") incrCycle();
    else {
      incrCycle();
      incrCycle();
      reg += Number(arg);
    }
  }
  return [resultA, display.map((line) => line.join(""))];
};

const tasks: Task<unknown, unknown>[] = [
  task1,
  task2,
  task3,
  task4,
  task5,
  task6,
  task7,
  task8,
  task9,
  task10,
];

export const taskWithInput = async <T1, T2>(
  number: number,
  task: Task<T1, T2>,
): Promise<[T1, T2]> => {
  const path = `input/${number}.txt`;

  const read = async () => {
    const f = await Deno.open(path);
    try {
      return await task(readLines(f));
    } finally {
      f.close();
    }
  };

  try {
    return await read();
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) {
      throw error;
    }
    console.log(`Downloading input for task ${number}`);
    await config();
    const cookie = Deno.env.get("AOC_SESSION_COOKIE");
    if (!cookie) throw new Error("Please set AOC_SESSION_COOKIE");
    const r = await fetch(`https://adventofcode.com/2022/day/${number}/input`, {
      headers: { cookie },
    });
    if (!r.ok || !r.body) {
      throw new Error(r.statusText);
    }
    const f = await Deno.open(path, { create: true, write: true });
    await r.body.pipeTo(f.writable);
    return await read();
  }
};

// Learn more at https://deno.land/manual/examples/module_metadata#concepts
if (import.meta.main) {
  for (const [i, task] of tasks.entries()) {
    console.log("Task " + (i + 1), ...(await taskWithInput(i + 1, task)));
  }
}

for (const [i, task] of tasks.entries()) {
  Deno.bench("Task " + (i + 1), async () => {
    await taskWithInput(i + 1, task);
  });
}
