import React, { useState, useMemo } from 'react';
import { Calculator, Info } from "lucide-react";
import { ToolCard, Label, TextInput, TextAreaReadOnly, Row, CopyButton } from './UIComponents';

// Boolean expression parser and evaluator
class BooleanExpression {
  constructor(expression) {
    this.original = expression;
    this.variables = this.extractVariables(expression);
    this.expression = this.normalizeExpression(expression);
  }

  extractVariables(expr) {
    const vars = new Set();
    // Match single letters that are not operators or reserved words
    const matches = expr.match(/\b[a-zA-Z]\b/g) || [];
    matches.forEach(match => {
      if (!['AND', 'OR', 'NOT', 'XOR', 'NAND', 'NOR', 'XNOR'].includes(match.toUpperCase())) {
        vars.add(match.toLowerCase());
      }
    });
    return Array.from(vars).sort();
  }

  normalizeExpression(expr) {
    return expr
      .replace(/\s+/g, '') // Remove spaces
      .replace(/∧|&/g, '∧') // Standardize AND
      .replace(/∨|\|/g, '∨') // Standardize OR
      .replace(/¬|~/g, '¬') // Standardize NOT
      .replace(/\^/g, '⊕') // Standardize XOR
      .toUpperCase();
  }

  evaluate(vars) {
    try {
      let expr = this.expression;

      // Replace variables with their values
      this.variables.forEach(v => {
        const value = vars[v] ? '1' : '0';
        expr = expr.replace(new RegExp(`\\b${v}\\b`, 'gi'), value);
      });

      // Replace operators with symbols that won't conflict
      expr = expr
        .replace(/∧/g, '&')
        .replace(/∨/g, '|')
        .replace(/¬/g, '~')
        .replace(/⊕/g, '^');

      // Evaluate the expression
      return this.evalBoolean(expr);
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  evalBoolean(expr) {
    // Use a proper recursive descent parser
    return this.parseExpression(expr);
  }

  parseExpression(expr) {
    // Remove whitespace
    expr = expr.replace(/\s+/g, '');

    // Parse using recursive descent
    let pos = 0;

    const parseOr = () => {
      let result = parseXor();
      while (pos < expr.length && expr[pos] === '|') {
        pos++; // skip '|'
        const right = parseXor();
        result = (result === '1' || right === '1') ? '1' : '0';
      }
      return result;
    };

    const parseXor = () => {
      let result = parseAnd();
      while (pos < expr.length && expr[pos] === '^') {
        pos++; // skip '^'
        const right = parseAnd();
        result = (result !== right) ? '1' : '0';
      }
      return result;
    };

    const parseAnd = () => {
      let result = parseNot();
      while (pos < expr.length && expr[pos] === '&') {
        pos++; // skip '&'
        const right = parseNot();
        result = (result === '1' && right === '1') ? '1' : '0';
      }
      return result;
    };

    const parseNot = () => {
      if (pos < expr.length && expr[pos] === '~') {
        pos++; // skip '~'
        const operand = parsePrimary();
        return operand === '0' ? '1' : '0';
      }
      return parsePrimary();
    };

    const parsePrimary = () => {
      if (pos >= expr.length) return '0';

      if (expr[pos] === '(') {
        pos++; // skip '('
        const result = parseOr();
        if (pos < expr.length && expr[pos] === ')') {
          pos++; // skip ')'
        }
        return result;
      }

      // Parse literal (0 or 1)
      if (expr[pos] === '0' || expr[pos] === '1') {
        return expr[pos++];
      }

      // If we reach here, there's a parsing error
      return '0';
    };

    const result = parseOr();

    // If we didn't consume the entire expression, there was an error
    if (pos < expr.length) {
      return '0';
    }

    return result;
  }

  generateTruthTable() {
    if (this.variables.length === 0) return null;

    const numRows = Math.pow(2, this.variables.length);
    const table = [];

    for (let i = 0; i < numRows; i++) {
      const vars = {};
      this.variables.forEach((v, idx) => {
        vars[v] = (i & (1 << (this.variables.length - 1 - idx))) !== 0;
      });

      const result = this.evaluate(vars);
      table.push({
        inputs: vars,
        output: result === '1'
      });
    }

    return table;
  }
}

export function TruthTable() {
  const [expression, setExpression] = useState("A ∧ B | ¬C");

  const truthTable = useMemo(() => {
    if (!expression.trim()) return null;
    try {
      const boolExpr = new BooleanExpression(expression);
      return {
        expression: boolExpr,
        table: boolExpr.generateTruthTable()
      };
    } catch {
      return null;
    }
  }, [expression]);

  const formatTable = (tableData) => {
    if (!tableData) return '';

    const { expression, table } = tableData;
    if (!table) return 'Invalid expression';

    const variables = expression.variables;
    let result = '';

    // Header
    variables.forEach(v => {
      result += v.toUpperCase() + '\t';
    });
    result += 'Output\n';

    // Separator
    result += ''.padEnd((variables.length + 1) * 8, '-') + '\n';

    // Rows
    table.forEach(row => {
      variables.forEach(v => {
        result += (row.inputs[v] ? '1' : '0') + '\t';
      });
      result += (row.output ? '1' : '0') + '\n';
    });

    return result;
  };

  return (
    <ToolCard
      title="Truth Table Generator"
      icon={<Calculator className="text-indigo-400" size={18} />}
      footer={
        <div className="space-y-2">
          <div>
            <span className="text-zinc-400">Example: </span>
            <span className="font-mono text-zinc-300">"A ∧ B | ¬C" generates complete truth table</span>
          </div>
          <div className="flex items-start gap-2">
            <Info size={14} className="mt-0.5"/>
            <div className="text-xs">
              <span>Generate truth tables for Boolean expressions. Use ∧ (AND), | ∨ (OR), ¬ ~ (NOT), ⊕ ^ (XOR). Variables: A-Z. </span>
              <a href="https://en.wikipedia.org/wiki/Truth_table" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 underline">
                Learn about truth tables
              </a>
              {" | "}
              <a href="https://en.wikipedia.org/wiki/Boolean_algebra" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 underline">
                Boolean algebra
              </a>
            </div>
          </div>
        </div>
      }
    >
      <div>
        <Label>Boolean Expression</Label>
        <TextInput
          value={expression}
          onChange={setExpression}
          placeholder="e.g. A ∧ B | ¬C or A & B | ~C"
          mono={false}
        />
      </div>

      {truthTable && truthTable.table && (
        <div className="mt-4">
          <Label>Truth Table</Label>
          <div className="flex gap-2">
            <TextAreaReadOnly value={formatTable(truthTable)} mono={true} />
            <CopyButton text={formatTable(truthTable)} />
          </div>
          <div className="mt-2 text-sm text-zinc-400">
            Variables: {truthTable.expression.variables.join(', ').toUpperCase()} |
            Rows: {truthTable.table.length}
          </div>
        </div>
      )}

      {truthTable && !truthTable.table && (
        <div className="mt-4 p-3 rounded-xl bg-red-900/20 border border-red-800">
          <p className="text-red-400 text-sm">Unable to parse expression. Please check syntax.</p>
        </div>
      )}
    </ToolCard>
  );
}
