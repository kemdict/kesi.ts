# @kemdict/kesi

https://github.com/i3thuan5/KeSi ported to TypeScript.

Convert between traditional POJ and Ministry of Education's Tailo.

## Install

```bash
npm install @kemdict/kesi
```

```bash
pnpm add @kemdict/kesi
```

```bash
bun install @kemdict/kesi
```

## Usage

Exactly like upstream.

```typescript
import { Ku } from "@kemdict/kesi";

// Convert input to KIP (TL)
new Ku("Phah-jī sī chiaⁿ tiōng-iàu ê tāi-chì").KIP().hanlo
// -> "Phah-jī sī tsiann tiōng-iàu ê tāi-tsì"

// Convert input to POJ
new Ku("Guá m̄ tsai-iánn tse sī beh按怎tsò.").POJ().hanlo
// -> "Góa m̄ chai-iáⁿ che sī beh按怎chò."
```

For the CLI:

```sh
npx @kemdict/kesi --input text-input.txt --to kip # "tl" has the same effect
npx @kemdict/kesi --input text-input.txt --to poj
npx @kemdict/kesi --input text-input.txt --to poj --output output.txt # instead of stdout
echo goá | npx @kemdict/kesi --to kip # read from stdin
npx @kemdict/kesi -i text-input.txt --count # count syllables
echo "我是Tâi-gí ê ke-si" | npx @kemdict/kesi --count # -> 7
```

### Differences

- `si_lomaji` is public
- This provides a CLI
