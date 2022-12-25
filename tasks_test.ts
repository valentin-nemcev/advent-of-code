import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
// @deno-types="npm:@types/lodash"
import _ from "npm:lodash";
import { asyncWrap } from "npm:iter-tools-es";

import * as T from "./tasks.ts";
import { taskWithInput } from "./main.ts";

const example = (strings: readonly string[]): AsyncIterableIterator<string> => {
  const lines = strings.join("").split("\n");
  if (lines[0] == "") lines.shift();
  if (lines[lines.length - 1].match(/^[\s\n]*$/)) lines.pop();
  const indent = _.min(lines.map((line) => line.match(/^(\s*)/)![1].length));
  return asyncWrap(lines.map((line) => line.slice(indent)));
};

Deno.test("task 1", async () => {
  const input = example`
    1000
    2000
    3000
    
    4000
    
    5000
    6000
    
    7000
    8000
    9000
    
    10000
  `;
  assertEquals(await T.task01(input), [24000, 45000]);
  assertEquals(await taskWithInput(1, T.task01), [69289, 205615]);
});

Deno.test("task 2", async () => {
  const input = example`
    A Y
    B X
    C Z
  `;
  assertEquals(await T.task02(input), [15, 12]);
  assertEquals(await taskWithInput(2, T.task02), [14827, 13889]);
});

Deno.test("task 3", async () => {
  const input = example`
    vJrwpWtwJgWrhcsFMMfFFhFp
    jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
    PmmdzqPrVvPwwTWBwg
    wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
    ttgJtRGJQctTZtZT
    CrZsJsPPZsGzwwsLwLmpwMDw
  `;
  assertEquals(await T.task03(input), [157, 70]);
  assertEquals(await taskWithInput(3, T.task03), [7850, 2581]);
});

Deno.test("task 4", async () => {
  const input = example`
    2-4,6-8
    2-3,4-5
    5-7,7-9
    2-8,3-7
    6-6,4-6
    2-6,4-8
  `;
  assertEquals(await T.task04(input), [2, 4]);
  assertEquals(await taskWithInput(4, T.task04), [498, 859]);
});

Deno.test("task 5", async () => {
  const input = example`
        [D]    
    [N] [C]    
    [Z] [M] [P]
    1   2   3 
    
    move 1 from 2 to 1
    move 3 from 1 to 3
    move 2 from 2 to 1
    move 1 from 1 to 2
  `;
  assertEquals(await T.task05(input), ["CMZ", "MCD"]);
  assertEquals(await taskWithInput(5, T.task05), [
    "QNNTGTPFN",
    "GGNPJBTTR",
  ]);
});

Deno.test("task 6", async () => {
  assertEquals(await T.task06(asyncWrap(["mjqjpqmgbljsphdztnvjfqwrcgsmlb"])), [
    7,
    19,
  ]);
  assertEquals(await T.task06(asyncWrap(["bvwbjplbgvbhsrlpgdmjqwftvncz"])), [
    5,
    23,
  ]);
  assertEquals(await T.task06(asyncWrap(["nppdvjthqldpwncqszvftbrmjlhg"])), [
    6,
    23,
  ]);
  assertEquals(
    await T.task06(asyncWrap(["nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg"])),
    [
      10,
      29,
    ],
  );
  assertEquals(
    await T.task06(asyncWrap(["zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw"])),
    [
      11,
      26,
    ],
  );
  assertEquals(await taskWithInput(6, T.task06), [1480, 2746]);
});

Deno.test("task 7", async () => {
  const input = example`
    $ cd /
    $ ls
    dir a
    14848514 b.txt
    8504156 c.dat
    dir d
    $ cd a
    $ ls
    dir e
    29116 f
    2557 g
    62596 h.lst
    $ cd e
    $ ls
    584 i
    $ cd ..
    $ cd ..
    $ cd d
    $ ls
    4060174 j
    8033020 d.log
    5626152 d.ext
    7214296 k
  `;
  assertEquals(await T.task07(input), [95437, 24933642]);
  assertEquals(await taskWithInput(7, T.task07), [1348005, 12785886]);
});

Deno.test("task 8", async () => {
  const input = example`
    30373
    25512
    65332
    33549
    35390
  `;
  assertEquals(await T.task08(input), [21, 8]);
  assertEquals(await taskWithInput(8, T.task08), [1832, 157320]);
});

Deno.test("task 9", async () => {
  const input1 = example`
    R 4
    U 4
    L 3
    D 1
    R 4
    D 1
    L 5
    R 2
  `;
  assertEquals(await T.task09(input1), [13, 1]);
  const input2 = example`
    R 5
    U 8
    L 8
    D 3
    R 17
    D 10
    L 25
    U 20
  `;
  assertEquals(await T.task09(input2), [88, 36]);
  assertEquals(await taskWithInput(9, T.task09), [6175, 2578]);
});

Deno.test("task 10", async () => {
  const input = example`
    addx 15
    addx -11
    addx 6
    addx -3
    addx 5
    addx -1
    addx -8
    addx 13
    addx 4
    noop
    addx -1
    addx 5
    addx -1
    addx 5
    addx -1
    addx 5
    addx -1
    addx 5
    addx -1
    addx -35
    addx 1
    addx 24
    addx -19
    addx 1
    addx 16
    addx -11
    noop
    noop
    addx 21
    addx -15
    noop
    noop
    addx -3
    addx 9
    addx 1
    addx -3
    addx 8
    addx 1
    addx 5
    noop
    noop
    noop
    noop
    noop
    addx -36
    noop
    addx 1
    addx 7
    noop
    noop
    noop
    addx 2
    addx 6
    noop
    noop
    noop
    noop
    noop
    addx 1
    noop
    noop
    addx 7
    addx 1
    noop
    addx -13
    addx 13
    addx 7
    noop
    addx 1
    addx -33
    noop
    noop
    noop
    addx 2
    noop
    noop
    noop
    addx 8
    noop
    addx -1
    addx 2
    addx 1
    noop
    addx 17
    addx -9
    addx 1
    addx 1
    addx -3
    addx 11
    noop
    noop
    addx 1
    noop
    addx 1
    noop
    noop
    addx -13
    addx -19
    addx 1
    addx 3
    addx 26
    addx -30
    addx 12
    addx -1
    addx 3
    addx 1
    noop
    noop
    noop
    addx -9
    addx 18
    addx 1
    addx 2
    noop
    noop
    addx 9
    noop
    noop
    noop
    addx -1
    addx 2
    addx -37
    addx 1
    addx 3
    noop
    addx 15
    addx -21
    addx 22
    addx -6
    addx 1
    noop
    addx 2
    addx 1
    noop
    addx -10
    noop
    noop
    addx 20
    addx 1
    addx 2
    addx 2
    addx -6
    addx -11
    noop
    noop
    noop
  `;
  assertEquals(await T.task10(input), [13140, [
    "##..##..##..##..##..##..##..##..##..##..",
    "###...###...###...###...###...###...###.",
    "####....####....####....####....####....",
    "#####.....#####.....#####.....#####.....",
    "######......######......######......####",
    "#######.......#######.......#######.....",
  ]]);
  assertEquals(await taskWithInput(10, T.task10), [13860, [
    "###..####.#..#.####..##....##..##..###..",
    "#..#....#.#..#.#....#..#....#.#..#.#..#.",
    "#..#...#..####.###..#.......#.#....###..",
    "###...#...#..#.#....#.##....#.#....#..#.",
    "#.#..#....#..#.#....#..#.#..#.#..#.#..#.",
    "#..#.####.#..#.#.....###..##...##..###..",
  ]]);
});

Deno.test("task 11", async () => {
  const input = example`
    Monkey 0:
      Starting items: 79, 98
      Operation: new = old * 19
      Test: divisible by 23
        If true: throw to monkey 2
        If false: throw to monkey 3
    
    Monkey 1:
      Starting items: 54, 65, 75, 74
      Operation: new = old + 6
      Test: divisible by 19
        If true: throw to monkey 2
        If false: throw to monkey 0
    
    Monkey 2:
      Starting items: 79, 60, 97
      Operation: new = old * old
      Test: divisible by 13
        If true: throw to monkey 1
        If false: throw to monkey 3
    
    Monkey 3:
      Starting items: 74
      Operation: new = old + 3
      Test: divisible by 17
        If true: throw to monkey 0
        If false: throw to monkey 1
  `;
  assertEquals(await T.task11(input), [10605, 2713310158]);
  assertEquals(await taskWithInput(11, T.task11), [95472, 17926061332]);
});

Deno.test("task 12", async () => {
  const input = example`
    Sabqponm
    abcryxxl
    accszExk
    acctuvwj
    abdefghi
  `;
  assertEquals(await T.task12(input), [31, 29]);
  assertEquals(await taskWithInput(12, T.task12), [528, 522]);
});

Deno.test("task 13", async () => {
  const input = example`
    [1,1,3,1,1]
    [1,1,5,1,1]
    
    [[1],[2,3,4]]
    [[1],4]
    
    [9]
    [[8,7,6]]
    
    [[4,4],4,4]
    [[4,4],4,4,4]
    
    [7,7,7,7]
    [7,7,7]
    
    []
    [3]
    
    [[[]]]
    [[]]
    
    [1,[2,[3,[4,[5,6,7]]]],8,9]
    [1,[2,[3,[4,[5,6,0]]]],8,9]
  `;
  assertEquals(await T.task13(input), [13, 140]);
  assertEquals(await taskWithInput(13, T.task13), [5198, 22344]);
});

Deno.test("task 14", async () => {
  const input = example`
    498,4 -> 498,6 -> 496,6
    503,4 -> 502,4 -> 502,9 -> 494,9
  `;
  assertEquals(await T.task14(input), [24, 93]);
  assertEquals(await taskWithInput(14, T.task14), [644, 27324]);
});

Deno.test("task 15", async () => {
  const input = example`
    Sensor at x=2, y=18: closest beacon is at x=-2, y=15
    Sensor at x=9, y=16: closest beacon is at x=10, y=16
    Sensor at x=13, y=2: closest beacon is at x=15, y=3
    Sensor at x=12, y=14: closest beacon is at x=10, y=16
    Sensor at x=10, y=20: closest beacon is at x=10, y=16
    Sensor at x=14, y=17: closest beacon is at x=10, y=16
    Sensor at x=8, y=7: closest beacon is at x=2, y=10
    Sensor at x=2, y=0: closest beacon is at x=2, y=10
    Sensor at x=0, y=11: closest beacon is at x=2, y=10
    Sensor at x=20, y=14: closest beacon is at x=25, y=17
    Sensor at x=17, y=20: closest beacon is at x=21, y=22
    Sensor at x=16, y=7: closest beacon is at x=15, y=3
    Sensor at x=14, y=3: closest beacon is at x=15, y=3
    Sensor at x=20, y=1: closest beacon is at x=15, y=3
  `;
  assertEquals(await T.task15(input, 10, 20), [26, 56000011]);
  assertEquals(await taskWithInput(15, T.task15), [4879972, 12525726647448]);
});

Deno.test("task 16", async () => {
  const input = example`
    Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
    Valve BB has flow rate=13; tunnels lead to valves CC, AA
    Valve CC has flow rate=2; tunnels lead to valves DD, BB
    Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
    Valve EE has flow rate=3; tunnels lead to valves FF, DD
    Valve FF has flow rate=0; tunnels lead to valves EE, GG
    Valve GG has flow rate=0; tunnels lead to valves FF, HH
    Valve HH has flow rate=22; tunnel leads to valve GG
    Valve II has flow rate=0; tunnels lead to valves AA, JJ
    Valve JJ has flow rate=21; tunnel leads to valve II
  `;
  assertEquals(await T.task16(input), [1651, 1707]);
});

Deno.test({
  name: "task 16 long",
  ignore: true,
  fn: async () => {
    assertEquals(await taskWithInput(16, T.task16), [1857, 2536]);
  },
});
