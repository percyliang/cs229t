for filename in $(find . -maxdepth 5 -name "*.tex"); do
    if [  "$filename" != "./defs.tex" ];then
        echo $filename
        pdflatex $filename
    fi
done
