import {
  DescribeDomainCommand,
  ListDomainNamesCommand,
  OpenSearchClient,
} from "@aws-sdk/client-opensearch";

const client = new OpenSearchClient({});

export async function listDomains() {
  const command = new ListDomainNamesCommand({
    EngineType: "Elasticsearch",
  });
  const response = await client.send(command);
  return response?.DomainNames?.map((i) => i.DomainName);
}

export async function getDomainUri(domain) {
  const command = new DescribeDomainCommand({
    DomainName: domain,
  });
  const response = await client.send(command);
  const domainUri = response?.DomainStatus?.Endpoint;
  return domainUri;
}
