from core.parser import CodeParser

parser = CodeParser()


code = """
for i in range(10):
    print(i)
"""

result = parser.parse(code)
print(result)