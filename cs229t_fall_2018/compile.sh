for filename in $(find . -maxdepth 5 -name "*.tex"); do
    echo $filename
    pdflatex $filename
done
