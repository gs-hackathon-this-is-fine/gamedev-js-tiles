file = open("questions.txt")

questions = []
answers = []

while True:
    question = file.readline()
    if len(question) == 0:
        break
    if question[0] == 'Q':
        question = '<p>' + question[3:] + '</p>'
        questions += [question]

        first_ans = False
        while not first_ans:
            ans = file.readline()
            if ans[0] == 'N':
                answers += [[(False, ans[3:])]]
                first_ans = True
            elif ans[0] == 'Y':
                answers += [[(True, ans[3:])]]
                first_ans = True
            else:
                questions[-1] += '<p>' + ans + '</p>'

        while True:
            ans = file.readline()
            if ans[0] == 'N':
                answers[-1] += [(False, ans[3:])]
            elif ans[0] == 'Y':
                answers[-1] += [(True, ans[3:])]
            else:
                break

file.close()

for i in range(len(questions)):
    question = questions[i]
    ans = answers[i]
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
    <script id="MathJax-script" async
            src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js">
    </script>
</head>
<body>
{question}

<form>

"""
    for j in range(len(ans)):
        (b, a) = ans[j]
        html += f"""
    <input type="radio" id="{j}" value="{j}" name="ans">
    <label for="1">{a}</label><br>
    """

    html += """
    <button type="submit">Zatwierdź</button>
</form>
</body>
</html>"""

    file = open(f"quiz{i}.html", "w")
    file.write(html)
    file.close()



