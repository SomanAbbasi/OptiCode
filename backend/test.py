from core.parser import CodeParser
from core.ast_analyzer import ASTAnalyzer

code = """
def test():
    for i in range(10):
        for i in range(10):
            print(i)
"""

parser = CodeParser()
parsed = parser.parse(code)

if parsed["success"]:
    analyzer = ASTAnalyzer()
    result = analyzer.analyze(parsed["tree"])
    print(result)
else:
    print(parsed["error"])