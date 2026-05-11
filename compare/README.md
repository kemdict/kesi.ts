Helper code for comparing the original and this port.

This should always produce the same output.

```
input="su-ji̍p"
echo "$input" | node convert.ts poj 
echo "$input" | uv run convert.py poj 
```
