default: notes.pdf

inputFiles: notes.otl macros.tex std-macros.tex figures.slides refdb

sfig:
	git clone https://github.com/percyliang/sfig

refdb:
	git clone https://github.com/percyliang/refdb

figures.slides: sfig figures.js utils.js
	nodejs figures.js
	touch figures.slides

notes.pdf: inputFiles
	./otl2pdf notes.otl

notes-preliminary.pdf: inputFiles
	(echo !showPreliminary; cat notes.otl) > notes-preliminary.otl
	./otl2pdf notes-preliminary.otl
	rm notes-preliminary.otl

clean:
	rm -f notes.log notes.aux notes.bbl notes.blg notes.toc notes.out
	rm -f notes-preliminary.log notes-preliminary.aux notes-preliminary.bbl notes-preliminary.blg notes-preliminary.toc notes-preliminary.out

run:
	go notes.pdf
