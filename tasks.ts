// @deno-types="npm:@types/lodash"
import _, { Dictionary } from "npm:lodash";
import * as I from "npm:iter-tools-es";

// deno-lint-ignore no-unused-vars
const { floor, ceil, sign, abs, min, max } = Math;

export type Task<T1 = number, T2 = T1, Args extends unknown[] = void[]> = (
  input: AsyncIterableIterator<string>,
  ...args: Args
) => Promise<[T1, T2]>;

export const task01: Task = async (input) => {
  const sums = await I.arrayFromAsync(I.execPipe(
    input,
    I.asyncSplitWhen(_.isEmpty),
    I.asyncMap(I.pipe(I.asyncMap(Number), I.asyncReduce(_.add))),
    I.asyncTakeSorted(3),
  ));
  return [sums[2], _.sum(sums)];
};

// lol js
const mod = (a: number, b: number): number => ((a % b) + b) % b;

const letterCode = (offset: string, letter: string): number =>
  letter.charCodeAt(0) - offset.charCodeAt(0);

export const task02: Task = async (input) => {
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

export const task03: Task = async (input) => {
  let scoreA = 0;
  let scoreB = 0;
  const letterPriority = (letter: string): number =>
    letter.charCodeAt(0) -
    (letter < "a" ? "A".charCodeAt(0) - 26 : "a".charCodeAt(0)) + 1;
  const [input1, input2] = I.asyncFork(input);
  for await (const line of input1) {
    const mid = line.length / 2;
    const [first, second] = [line.slice(0, mid), line.slice(mid)].map((l) =>
      l.split("")
    );
    const commonLetter = _.intersection(first, second)[0];
    scoreA += letterPriority(commonLetter);
  }
  for await (const lines of I.asyncBatch(3, input2)) {
    const letters = (await I.arrayFromAsync(lines)).map((l) => l.split(""));
    const commonLetter = _.intersection(...letters)[0];
    scoreB += letterPriority(commonLetter);
  }

  return [scoreA, scoreB];
};

export const task04: Task = async (input) => {
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

export const task05: Task<string> = async (inputIt) => {
  const input = await I.arrayFromAsync(inputIt);
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

export const task06: Task = async (inputIt) => {
  const input = (await I.asyncFirst(inputIt))!;
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

export const task07: Task = async (input) => {
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

export const task08: Task = async (input) => {
  const trees = (await I.arrayFromAsync(input)).map((line) =>
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

export const task09: Task = async (input) => {
  const snake = _.times(10, () => [0, 0]);
  const head = snake[0];
  const positionsA = new Set();
  const positionsB = new Set();

  const _print = () =>
    _.range(-165, 16).map((y) =>
      _.range(-50, 175).map((x) => {
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

        if (abs(dist[0]) > 1 || abs(dist[1]) > 1) {
          nodeB[0] += sign(dist[0]);
          nodeB[1] += sign(dist[1]);
        }
      }

      positionsA.add(snake[1].join(","));
      positionsB.add(_.last(snake)!.join(","));
    }
  }
  // console.log(_print());
  return [positionsA.size, positionsB.size];
};

export const task10: Task<number, string[]> = async (input) => {
  let cycle = 0, reg = 1, resultA = 0;
  const display = _.times(6, () => new Array(40));
  const incrCycle = () => {
    const row = floor(cycle / 40), col = cycle % 40;
    display[row][col] = abs(col - reg) <= 1 ? "#" : ".";
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

export const task11: Task = async (input) => {
  const monkeys = await I.execPipe(
    input,
    I.asyncSplitWhen(_.isEmpty),
    I.asyncMap(async (linesIt: AsyncIterableIterator<string>) => {
      const lines = await I.arrayFromAsync(linesIt);
      return {
        startingItems: lines[1].match(/(\d+)/g)!.map(Number),
        op: new Function(
          "old",
          "return " + lines[2].match(/new = (.*)/)![1],
        ) as (old: number) => number,
        divBy: Number(lines[3].match(/by (\d+)/)![1]),
        throwTo: lines.slice(-2).reverse().map((l) =>
          Number(l.match(/to monkey (\d+)/)![1])
        ),
        items: [] as number[],
        inspectCount: 0,
      };
    }),
    I.arrayFromAsync,
  );

  const divBy = I.execPipe(
    monkeys,
    I.map((m) => m.divBy),
    I.reduce(_.multiply),
  );

  const work = (rounds: number, k: number) => {
    monkeys.forEach((monkey) => {
      monkey.items = monkey.startingItems.slice();
      monkey.inspectCount = 0;
    });
    _.range(rounds).forEach(() => {
      monkeys.forEach((monkey) => {
        monkey.items.forEach((item) => {
          item = floor(monkey.op(item) / k);
          if (item > Number.MAX_SAFE_INTEGER) throw new Error("Overflow");
          if (k == 1) item = item % divBy;

          const next = monkey.throwTo[Number((item % monkey.divBy) == 0)];
          monkeys[next].items.push(item);
        });
        monkey.inspectCount += monkey.items.length;
        monkey.items.length = 0;
      });
    });
    return monkeys.map((m) => m.inspectCount).sort((a, b) => b - a).slice(0, 2)
      .reduce((a, b) => a * b);
  };

  return [work(20, 3), work(10000, 1)];
};

export const task12: Task = async (input) => {
  const terrainInput = await I.execPipe(
    input,
    I.asyncMap((line) => line.split("")),
    I.arrayFromAsync,
  );
  type Pos = [number, number];
  let start!: Pos, dest!: Pos;
  const terrain = terrainInput.map((row, r) =>
    row.map((letter, c) => {
      if (letter == "S") {
        start = [r, c];
        letter = "a";
      }
      if (letter == "E") {
        dest = [r, c];
        letter = "z";
      }
      return letterCode("a", letter);
    })
  );
  const rowCount = terrain.length, colCount = terrain[0].length;

  let paths = [[start]];
  let visited = terrain.map((r) => r.map(() => false));
  const walk = (uphill: boolean): number => {
    let progress = false;
    paths = paths.flatMap((path) => {
      const [r, c] = _.last(path)!;

      const current = terrain[r][c];
      const directions: Pos[] = [
        [r + 1, c],
        [r, c + 1],
        [r - 1, c],
        [r, c - 1],
      ];
      const nodes = directions.filter(
        ([r, c]) => {
          if (
            !(0 <= r && r < rowCount &&
              0 <= c && c < colCount)
          ) return false;
          const diff = terrain[r][c] - current;
          if (uphill ? diff > 1 : diff < -1) return false;
          return !visited[r][c];
        },
      );
      nodes.forEach(([r, c]) => visited[r][c] = true);
      if (nodes.length) progress = true;
      return nodes.map((node) => [...path, node]);
    });
    if (!progress) {
      console.log(paths);
      console.log(
        visited.map((row, r) =>
          row.map((v, c) => v ? terrainInput[r][c] : " ").join("")
        ).join("\n"),
      );
      throw new Error("Stuck");
    }
    for (const path of paths) {
      const [r, c] = _.last(path)!;
      if (uphill) {
        if (dest[0] == r && dest[1] == c) return path.length - 1;
      } else {
        if (terrain[r][c] == 0) return path.length - 1;
      }
    }
    return walk(uphill);
  };

  const resultUphill = walk(true);

  paths = [[dest]];
  visited = terrain.map((r) => r.map(() => false));
  const resultDownhill = walk(false);
  return [resultUphill, resultDownhill];
};

export const task13: Task = async (inputIt) => {
  const parseLine = (line: string): NestedArray<number> => eval(line);

  type NestedArray<T> = Array<T | NestedArray<T>>;
  const compare = (
    a: number | NestedArray<number>,
    b: number | NestedArray<number>,
  ): boolean | null => {
    if (_.isArray(a) && _.isNumber(b)) return compare(a, [b]);
    if (_.isNumber(a) && _.isArray(b)) return compare([a], b);
    if (_.isNumber(a) && _.isNumber(b)) {
      if (a < b) return true;
      if (a > b) return false;
      return null;
    }
    if (_.isArray(a) && _.isArray(b)) {
      for (let i = 0; i < min(a.length, b.length); i++) {
        const c = compare(a[i], b[i]);
        if (_.isBoolean(c)) return c;
      }
      if (a.length < b.length) return true;
      if (a.length > b.length) return false;
      return null;
    }
    throw new Error("No match");
  };

  const input = await I.arrayFromAsync(inputIt);

  const filtered = I.execPipe(
    input,
    I.splitWhen(_.isEmpty),
    I.map(I.pipe(I.map(parseLine))),
    I.enumerate(1),
    I.filter(([, [left, right]]) => {
      const c = compare(left, right);
      if (_.isBoolean(c)) return c;
      throw new Error("No difference");
    }),
    I.arrayFrom,
  );

  const sorted = I.execPipe(
    input,
    I.filter((l) => !_.isEmpty(l)),
    I.map(parseLine),
    I.arrayFrom,
    (c) =>
      c.sort((left, right) => {
        const c = compare(left, right);
        if (c === true) return -1;
        if (c === false) return 1;
        throw new Error("No difference");
      }),
  );

  let indexA = -1, indexB = -1;

  for (let i = 0; i < sorted.length; i++) {
    if (indexA == -1) {
      if (compare(sorted[i], [[2]]) == false) indexA = i + 1;
    } else if (indexB == -1) {
      if (compare(sorted[i], [[6]]) == false) indexB = i + 2;
    } else {
      break;
    }
  }

  return [_.sum(filtered.map(_.first)), indexA * indexB];
};

export const task14: Task = async (inputIt) => {
  type Cell = "#" | "o" | "x" | ".";
  const width = 1000;
  const level: Cell[][] = [];
  for await (const line of inputIt) {
    const points = line.split(" -> ")
      .map((p) => p.split(",").map(Number));

    const extraY = _.max(points.map((p) => p[1]))! - level.length + 1;
    level.push(..._.times(extraY, () => _.times(width, () => "." as Cell)));

    for (const [[x1, y1], [x2, y2]] of I.window(2, points)) {
      const dx = sign(x2 - x1), dy = sign(y2 - y1);
      _.range(x1, x2 + dx, dx).forEach((x) => level[y1][x] = "#");
      _.range(y1, y2 + dy, dy).forEach((y) => level[y][x1] = "#");
    }
  }
  level.push(
    _.times(width, () => "." as Cell),
    _.times(width, () => "#" as Cell),
  );

  let countA!: number;
  let counter = 0;
  for (; counter < level.length ** 2; counter++) {
    let x = 500;
    if (level[0][x] != ".") break;
    inner:
    for (let y = 0; y < level.length; y++) {
      if (y == level.length - 2) countA ??= counter;
      for (const cx of [x, x - 1, x + 1]) {
        if (cx < 0 || cx >= width) throw new Error("Overflow!");
        if (level[y][cx] == ".") {
          x = cx;
          continue inner;
        }
      }
      level[y - 1][x] = countA ? "x" : "o";
      break;
    }
  }

  //   console.log(level.map((row) => row.slice(400, 600).join("")).join("\n"));
  return [countA, counter];
};

export const task15: Task<
  number,
  number,
  [targetRow?: number | void, targetArea?: number | void]
> = async (
  input,
  targetY = 2_000_000,
  targetArea = 4_000_000,
) => {
  const sensors = await I.execPipe(
    input,
    I.asyncMap((line) => {
      const [s, b] = [...line.matchAll(/x=(-?\d+), y=(-?\d+)/g)]
        .map(([, x, y]) => [Number(x), Number(y)]);
      return ({
        sx: s[0],
        sy: s[1],
        bx: b[0],
        by: b[1],
        dist: abs(s[0] - b[0]) + abs(s[1] - b[1]),
      });
    }),
    I.arrayFromAsync,
  );

  const beacons = _(sensors)
    .map(({ bx, by }) => ({ x: bx, y: by }))
    .uniqWith(_.isEqual);

  const targetSensors = _(sensors).map(({ sx, sy, dist }) => {
    const distX = dist - abs(targetY - sy);
    return [sx - distX, sx + distX];
  }).filter(([lx, ly]) => lx <= ly);

  const count = targetSensors.map("1").max() + 1 -
    targetSensors.map("0").min() -
    beacons.filter(({ y }) => y == targetY).size();

  let resultX = -1, resultY = -1;

  outer:
  for (const sa of sensors) {
    for (const sb of sensors) {
      if (sa == sb) continue;
      // top to right
      const xa0 = sa.sx, ya0 = sa.sy - sa.dist;

      // top to left
      const xb0 = sb.sx, yb0 = sb.sy - sb.dist;

      const xc = xb0 - xa0, yc = yb0 - ya0;
      const da = (xc + yc) / 2, db = (xc - yc) / 2;

      if (0 > da || da > sa.dist || 0 > db || db > sb.dist) continue;

      const ix = xa0 + da, y = floor(ya0 + da) - 1;

      for (const x of [floor(ix), ceil(ix)]) {
        if (0 > x || x > targetArea || 0 > y || y > targetArea) continue;
        if (
          sensors.some(({ sx, sy, dist }) => abs(sx - x) + abs(sy - y) <= dist)
        ) continue;

        resultX = x;
        resultY = y;
        break outer;
      }
    }
  }

  return [count, resultX * 4_000_000 + resultY];
};

export const task16: Task = async (input) => {
  const valves = await I.execPipe(
    input,
    I.asyncMap((line) => {
      const [, name, rate, outgoing] = line.match(
        /Valve (\w+) has flow rate=(\d*); tunnels? leads? to valves? (.*)/,
      )!;
      const valve = {
        name,
        rate: Number(rate),
        outgoing: outgoing.split(", "),
      };
      return [name, valve] as [string, typeof valve];
    }),
    I.objectFromAsync,
  );
  // console.log(valves);

  const start = "AA"; // AAAAAAAAAAAAAAAAAAAAAA, always start at AA 😭😭😭😭
  const viable = _(valves).filter((v) => v.rate > 0).map("name").value();

  const reach = _.fromPairs([start, ...viable].map((v) => {
    const result: Dictionary<number> = {};
    const visited: string[] = [];
    let edge = [v];
    for (let dist = 0; edge.length > 0; dist++) {
      edge = edge.flatMap((vv) => {
        if (visited.includes(vv)) return [];
        visited.push(vv);
        if (viable.includes(vv) && dist) result[vv] = dist;
        return valves[vv].outgoing;
      });
    }
    return [v, result];
  }));

  const work = (
    v: string,
    minutes: number,
    closed: string[],
    second: boolean,
  ) => {
    let r = 0;
    for (const vv of closed) {
      const d = (reach[v][vv] ?? 1000) + 1;
      if (d >= minutes) continue;
      r = max(
        r,
        valves[vv].rate * (minutes - d) + work(
          vv,
          minutes - d,
          _.without(closed, vv),
          second,
        ),
      );
    }
    if (second) {
      r = max(r, work(start, 26, closed, false));
    }
    return r;
  };
  const resultA = work(start, 30, viable, false);
  const resultB = work(start, 26, viable, true);

  return [resultA, resultB];
};
