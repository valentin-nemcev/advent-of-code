import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
// @deno-types="npm:@types/lodash"
import _ from "npm:lodash";
import { asyncWrap } from "npm:iter-tools-es";

import * as T from "./main_iter.ts";
const { taskWithInput } = T;
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
  assertEquals(await T.task1(input), [24000, 45000]);
  assertEquals(await taskWithInput(1, T.task1), [69289, 205615]);
});

Deno.test("task 2", async () => {
  const input = example`
    A Y
    B X
    C Z
  `;
  assertEquals(await T.task2(input), [15, 12]);
  assertEquals(await taskWithInput(2, T.task2), [14827, 13889]);
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
  assertEquals(await T.task3(input), [157, 70]);
  assertEquals(await taskWithInput(3, T.task3), [7850, 2581]);
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
  assertEquals(await T.task4(input), [2, 4]);
  assertEquals(await taskWithInput(4, T.task4), [498, 859]);
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
  assertEquals(await T.task5(input), ["CMZ", "MCD"]);
  assertEquals(await taskWithInput(5, T.task5), [
    "QNNTGTPFN",
    "GGNPJBTTR",
  ]);
});

Deno.test("task 6", async () => {
  assertEquals(await T.task6(asyncWrap(["mjqjpqmgbljsphdztnvjfqwrcgsmlb"])), [
    7,
    19,
  ]);
  assertEquals(await T.task6(asyncWrap(["bvwbjplbgvbhsrlpgdmjqwftvncz"])), [
    5,
    23,
  ]);
  assertEquals(await T.task6(asyncWrap(["nppdvjthqldpwncqszvftbrmjlhg"])), [
    6,
    23,
  ]);
  assertEquals(
    await T.task6(asyncWrap(["nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg"])),
    [
      10,
      29,
    ],
  );
  assertEquals(await T.task6(asyncWrap(["zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw"])), [
    11,
    26,
  ]);
  assertEquals(await taskWithInput(6, T.task6), [1480, 2746]);
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
  assertEquals(await T.task7(input), [95437, 24933642]);
  assertEquals(await taskWithInput(7, T.task7), [1348005, 12785886]);
});
