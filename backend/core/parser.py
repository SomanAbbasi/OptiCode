import ast

class CodeParser:
    """
    Responsible for converting raw Python code into AST safely.
    """

    def parse(self, code: str):
        """
        Returns AST tree or structured error
        """

        try:
            tree = ast.parse(code)
            return {
                "success": True,
                "tree": tree
            }

        except SyntaxError as e:
            return {
                "success": False,
                "error": {
                    "type": "SyntaxError",
                    "message": str(e),
                    "line": e.lineno,
                    "offset": e.offset
                }
            }

        except Exception as e:
            return {
                "success": False,
                "error": {
                    "type": "ParseError",
                    "message": str(e)
                }
            }