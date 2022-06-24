import readLine from "readline-sync";
import chalk from "chalk";
import Table from "cli-table";
import { Exit, ListQuery, SelectQuery } from "./parse.js";
import { listDomains, getDomainUri } from "./aws.js";
import { getClient, setClient } from "./esClient.js";

async function evaluatePickDomain() {
  const domains = await listDomains();
  if (domains.length == 0) {
    console.log(chalk.yellow("No domains available"));
    return;
  }

  const selection = readLine.keyInSelect(
    domains,
    "Pick the proper es domain",
    {}
  );
  const uri = await getDomainUri(domains[selection]);
  setClient(uri);
}

async function evaluateListQuery(command) {
  const { type } = command;
  const client = await getClient();
  const resp = await client.listIndices();
  const table = new Table({
    head: ["status", "state", "name", "", "", "", "entrycount"],
  });
  table.push(...resp);
  console.log(table.toString());
}

export async function evaluateCommand(command) {
  if (command instanceof Exit) {
    log(chalk.green("Bye!"));
    process.exit(0);
  } else if (command instanceof SelectQuery) {
    await evaluatePickDomain();
    return;
  } else if (command instanceof ListQuery) {
    await evaluateListQuery(command);
  }
}

evaluateCommand(new SelectQuery("domain")).then();
