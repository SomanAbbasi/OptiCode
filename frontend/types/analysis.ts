
//Supported language

export type Language = "python" | "c++" | "c" | "java" | "c#";

export const SUPPORTED_LANGUAGES: Language[] = [
    "python",
    "c++",
    "c",
    "java",
    "c#",
]

// Syntax Check
export interface SyntaxError {
    message: string; // what went wrong
    line: number;  // it's line no.
}

export interface SyntaxCheck {
    valid: boolean;
    errors: SyntaxError[]

}

// Code Analysis
export interface Analysis {
    language: string;
    detected_patterns: string[];
    time_complexity: string;
    space_complexity: string;
}

// issues in code
export interface Issue {
    type: string; // "Performance" | "Logic" | "Style"
    description: string;
    reason: string;
}

// Optimization Suggestions
export interface Optimization {
    approach: string;
    explanation: string;
    complexity_before: string;
    complexity_after: string;
    conditions: string;
}


// Optimze code
export interface OptimizedCode {
    code: string;
    description: string;
}


// Backend Response
// Returned by POST/analyze on success
export interface AnalysisResult {
    status: "success" | "error";
    syntax_check: SyntaxCheck;
    analysis: Analysis;
    issues: Issue[];
    optimizations: Optimization[];
    optimized_code: OptimizedCode;
}


// backend validation error 
// Returned by Post/analyzed when input is rejected

export interface ValidationError {
    status: "error";
    source: "validation" | "openrouter" | "parsing";
    errors?: string[];
    message?: string;
}

// UI State

export type AnalyzerStatus =
    | "idle"     // nothing submitted yet
    | "loading"  // API call in progress
    | "success"  // response received successfully
    | "error";   // something went wrong

export interface AnalyzerState {
    status:AnalyzerStatus;
    result:AnalysisResult | null;
    error:string | null;

}


// Request paylod 
// What we send to Post / analyze
export interface AnalyzeRequest {
  code: string;
  language: Language;
}