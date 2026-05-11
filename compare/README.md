Helper code for comparing the original and this port.

This should always produce the same output.

```
input="su-ji̍p"
echo "$input" | node convert.ts poj 
echo "$input" | uv run convert.py poj 
```

`make compare -j4`, then `diff allwords-{original,port}-kip.txt` and `diff allwords-{original,port}-poj.txt` should both produce no output (no differences).

The initial word list is created from the Kemdict database. Build it, and place it where wordlist.ts expects it to be.
