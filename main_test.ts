import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
// @deno-types="npm:@types/lodash"
import _ from "npm:lodash";

import * as T from "./main.ts";

const example = (strings: readonly string[]): string[] => {
  const lines = strings.join("").split("\n");
  if (lines[0] == "") lines.shift();
  if (lines[lines.length - 1].match(/^[\s\n]*$/)) lines.pop();
  const indent = _.min(lines.map((line) => line.match(/^(\s*)/)![1].length));
  return lines.map((line) => line.slice(indent));
};

const fromFile = async (name: string): Promise<string[]> =>
  (await Deno.readTextFile(`input/${name}.txt`)).trim().split("\n");

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
  assertEquals(T.task1(input), [24000, 45000]);
  assertEquals(T.task1(await fromFile("1")), [69289, 205615]);
});

Deno.test("task 2", async () => {
  const input = example`
    A Y
    B X
    C Z
  `;
  assertEquals(T.task2(input), [15, 12]);
  assertEquals(T.task2(await fromFile("2")), [14827, 13889]);
});

Deno.test("letterPriority", () => {
  assertEquals(T.letterPriority("a"), 1);
  assertEquals(T.letterPriority("z"), 26);
  assertEquals(T.letterPriority("A"), 27);
  assertEquals(T.letterPriority("Z"), 52);
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
  assertEquals(T.task3(input), [157, 70]);
  assertEquals(T.task3(await fromFile("3")), [7850, 2581]);
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
  assertEquals(T.task4(input), [2, 4]);
  assertEquals(T.task4(await fromFile("4")), [498, 859]);
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
  assertEquals(T.task5(input), ["CMZ", "MCD"]);
  assertEquals(T.task5(await fromFile("5")), ["QNNTGTPFN", "GGNPJBTTR"]);
});
