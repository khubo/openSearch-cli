import { Client, Connection } from "@opensearch-project/opensearch";
import { defaultProvider } from "@aws-sdk/credential-provider-node";
import aws4 from "aws4";

let esClient;

const createAwsConnector = (credentials, region) => {
  class AmazonConnection extends Connection {
    buildRequestObject(params) {
      const request = super.buildRequestObject(params);
      request.service = "es";
      request.region = region;
      request.headers = request.headers || {};
      request.headers["host"] = request.hostname;

      return aws4.sign(request, credentials);
    }
  }
  return {
    Connection: AmazonConnection,
  };
};

function parseIndices(body) {
  const entries = body
    .split("\n")
    .filter((i) => !!i.trim())
    .map((i) => i.split(" ").slice(0, 7));
  return entries;
}

class EsClient {
  constructor(host, credentials) {
    this.host = host;
    this.client = new Client({
      ...createAwsConnector(credentials, "us-west-2"),
      node: `https://${host}`,
    });
  }

  async listIndices() {
    const resp = await this.client.cat.indices();
    const body = resp.body;
    return body ? parseIndices(body) : [];
  }
}

export async function setClient(host) {
  if (esClient && host == esClient.host) return;
  const credentials = await defaultProvider()();
  esClient = new EsClient(host, credentials);
}

export async function getClient() {
  if (esClient !== null) return esClient;
  throw new Error("pick domain first");
}
