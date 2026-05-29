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

### Differences

- `si_lomaji` is public

## 其他

### 算字數

```bash
$ echo "我是Tâi-gí ê ke-si" | node le/sng_jisoo.ts
# 字數=7
```
