

def validate_response(data: dict) -> dict:
    """
    Takes the raw parsed model response and returns a normalized
    version with all required fields guaranteed to exist.

    If a field is missing or has the wrong type it is replaced
    with a safe default rather than crashing or returning broken data.

    Args:
        data: Raw parsed JSON dict from the model

    Returns:
        Normalized dict that matches the frontend TypeScript contract
    """

    if not isinstance(data, dict):
        data = {}

    return {
        "status": _get_status(data),
        "syntax_check": _get_syntax_check(data),
        "analysis": _get_analysis(data),
        "issues": _get_issues(data),
        "optimizations": _get_optimizations(data),
        "optimized_code": _get_optimized_code(data),
    }


# _get_status returns only allowed status values.
def _get_status(data: dict) -> str:
    status = data.get("status", "success")
    return status if status in ("success", "error") else "success"


# _get_syntax_check keeps syntax_check shape stable and safe.
def _get_syntax_check(data: dict) -> dict:
    raw = data.get("syntax_check", {})

    if not isinstance(raw, dict):
        return {"valid": True, "errors": []}

    raw_errors = raw.get("errors", [])
    errors = []

    if isinstance(raw_errors, list):
        for err in raw_errors:
            if isinstance(err, dict):
                line_value = err.get("line", 0)
                line = int(line_value) if str(line_value).isdigit() else 0

                errors.append(
                    {
                        "message": str(err.get("message", "Unknown error")),
                        "line": line,
                    }
                )

    return {
        "valid": bool(raw.get("valid", True)),
        "errors": errors,
    }


# _get_analysis normalizes analysis fields and default values.
def _get_analysis(data: dict) -> dict:
    raw = data.get("analysis", {})

    if not isinstance(raw, dict):
        return {
            "language": "unknown",
            "detected_patterns": [],
            "time_complexity": "Unknown",
            "space_complexity": "Unknown",
        }

    patterns = raw.get("detected_patterns", [])
    if not isinstance(patterns, list):
        patterns = []
    patterns = [str(p) for p in patterns if p]

    return {
        "language": str(raw.get("language", "unknown")),
        "detected_patterns": patterns,
        "time_complexity": str(raw.get("time_complexity", "Unknown")),
        "space_complexity": str(raw.get("space_complexity", "Unknown")),
    }


# _get_issues ensures every issue item is a valid object.
def _get_issues(data: dict) -> list:
    raw = data.get("issues", [])

    if not isinstance(raw, list):
        return []

    issues = []
    for item in raw:
        if not isinstance(item, dict):
            continue

        issues.append(
            {
                "type": str(item.get("type", "Performance")),
                "description": str(item.get("description", "")),
                "reason": str(item.get("reason", "")),
            }
        )

    return issues


# _get_optimizations ensures optimization entries are well-formed.
def _get_optimizations(data: dict) -> list:
    raw = data.get("optimizations", [])

    if not isinstance(raw, list):
        return []

    optimizations = []
    for item in raw:
        if not isinstance(item, dict):
            continue

        optimizations.append(
            {
                "approach": str(item.get("approach", "")),
                "explanation": str(item.get("explanation", "")),
                "complexity_before": str(item.get("complexity_before", "")),
                "complexity_after": str(item.get("complexity_after", "")),
                "conditions": str(item.get("conditions", "")),
            }
        )

    return optimizations


# _get_optimized_code guarantees code and notes always exist.
def _get_optimized_code(data: dict) -> dict:
    raw = data.get("optimized_code", {})

    if not isinstance(raw, dict):
        return {"code": "", "notes": ""}

    return {
        "code": str(raw.get("code", "")),
        "notes": str(raw.get("notes", "")),
    }