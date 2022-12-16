import { readLines } from "https://deno.land/std@0.167.0/io/mod.ts";
import { config } from "https://deno.land/std@0.167.0/dotenv/mod.ts";

import * as T from "./tasks.ts";

export const taskWithInput = async <T1, T2>(
  number: number,
  task: T.Task<T1, T2>,
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
    await config({ export: true });
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

const tasksArray: T.Task<unknown, unknown>[] = Object.values(T);
// Learn more at https://deno.land/manual/examples/module_metadata#concepts
if (import.meta.main) {
  for (let i = 0; i < tasksArray.length; i++) {
    console.log(
      "Task " + (i + 1),
      ...(await taskWithInput(i + 1, tasksArray[i])),
    );
  }
}

for (let i = 0; i < tasksArray.length; i++) {
  Deno.bench("Task " + (i + 1), async () => {
    await taskWithInput(i + 1, tasksArray[i]);
  });
}
