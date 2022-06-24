#!usr/bin/env node
import chalk from "chalk";
import readLine from "readline-sync";
import { parse } from "./parse.js";
import { evaluateCommand } from "./eval.js";

const log = console.log;

log(chalk.yellow.bold("Open search cli"));

async function run() {
  while (true) {
    try {
      const line = readLine.prompt(">");
      const command = parse(line);
      await evaluateCommand(command);
    } catch (e) {
      log(chalk.red(e.message));
    }
  }
}

run().catch(console.error);
