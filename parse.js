export class SelectQuery {
  constructor(type) {
    this.type = type;
  }
}

export class Exit {}

export class ListQuery {
  constructor(type) {
    this.type = type;
  }
}

function parsePick(idents) {
  if (idents[1] !== "domain" || idents.length > 2)
    throw new Error("unrecognized query! Did you mean `select domain`?");

  return new SelectQuery("domain");
}

function parseList(idents) {
  if (idents[1] !== "indices" || idents.length > 2)
    throw new Error("unrecognized command! Did you mean `list indices`");

  return new ListQuery("indices");
}

export function parse(line) {
  const idents = line
    .split(" ")
    .filter((i) => !!i.trim())
    .map((i) => i.toLowerCase());
  const command = idents[0];
  if (command === "pick") return parsePick(idents);
  else if (command === "list") return parseList(idents);
  else if (command === "exit" && idents.length == 1) return new Exit();
  else {
    throw new Error("unrecognized query");
  }
}
