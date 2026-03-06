.PHONY: serve fmt lint

serve:
	deno run --allow-net --allow-read serve.ts

fmt:
	deno fmt web/js web/css web/*.html serve.ts AGENTS.md README.md

lint:
	deno lint web/js serve.ts
