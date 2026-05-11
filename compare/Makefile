allwords.txt: wordlist.ts
	node wordlist.ts

allwords-original-poj.txt:
	cat allwords.txt | uv run convert.py poj > allwords-original-poj.txt

allwords-port-poj.txt:
	cat allwords.txt | node convert.ts poj > allwords-port-poj.txt

allwords-original-kip.txt:
	cat allwords.txt | uv run convert.py kip > allwords-original-kip.txt

allwords-port-kip.txt:
	cat allwords.txt | node convert.ts kip > allwords-port-kip.txt

compare: allwords-original-poj.txt allwords-port-poj.txt allwords-original-kip.txt allwords-port-kip.txt
