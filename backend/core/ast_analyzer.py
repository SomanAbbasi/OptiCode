import ast

class ASTAnalyzer(ast.NodeVisitor):
    """
    Traverses AST and extracts useful structural information.
    """

    def __init__(self):
        self.loops = []
        self.function_calls = []
        self.functions = []

    # --- LOOP DETECTION ---

    def visit_For(self, node):
        self.loops.append({
            "type": "for",
            "lineno": node.lineno
        })
        self.generic_visit(node)

    def visit_While(self, node):
        self.loops.append({
            "type": "while",
            "lineno": node.lineno
        })
        self.generic_visit(node)

    # --- FUNCTION CALL DETECTION ---

    def visit_Call(self, node):
        if isinstance(node.func, ast.Name):
            name = node.func.id
        elif isinstance(node.func, ast.Attribute):
            name = node.func.attr
        else:
            name = "unknown"

        self.function_calls.append({
            "name": name,
            "lineno": node.lineno
        })

        self.generic_visit(node)

    # --- FUNCTION DEFINITIONS ---

    def visit_FunctionDef(self, node):
        self.functions.append({
            "name": node.name,
            "lineno": node.lineno
        })
        self.generic_visit(node)

    # --- ENTRY METHOD ---

    def analyze(self, tree):
        self.visit(tree)

        return {
            "loops": self.loops,
            "function_calls": self.function_calls,
            "functions": self.functions
        }