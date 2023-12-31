# cyb.fyi

[Cyber Info](https://cyber.info) link shortener

___

![Hono](https://img.shields.io/static/v1?style=for-the-badge&message=Hono&color=E36002&logo=Hono&logoColor=FFFFFF&label=)
![Cloudflare](https://img.shields.io/static/v1?style=for-the-badge&message=Cloudflare&color=F38020&logo=Cloudflare&logoColor=FFFFFF&label=)
![Biome](https://img.shields.io/static/v1?style=for-the-badge&message=Biome&color=222222&logo=Biome&logoColor=F7B911&label=)

## Prerequisites

- Cloudflare Workers
- `pnpm` and the gang
- Plausible Analytics

## Setup

1. Create a Cloudflare KV namespace
2. Clone the repo
3. Install dependencies with `pnpm i`
4. Rename `wrangler.example.toml` to `wrangler.toml` and fill in the values
5. Run `pnpm run deploy` to deploy to Cloudflare Workers
6. Fill up your KV namespace with keys (slugs) and values (redirect URLs)
