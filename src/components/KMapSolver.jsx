import React, { useState, useMemo } from 'react';
import { Calculator, Info, Grid3X3 } from "lucide-react";
import { ToolCard, Label, TextInput, Select, Row, CopyButton, TextAreaReadOnly } from './UIComponents';

// Karnaugh Map Solver
class KarnaughMap {
  constructor(numVars, minterms = []) {
    this.numVars = numVars;
    this.minterms = minterms;
    this.variables = this.getVariableNames();
    this.map = this.generateMap();
  }

  getVariableNames() {
    const names = ['A', 'B', 'C', 'D'];
    return names.slice(0, this.numVars);
  }

  generateMap() {
    const size = Math.pow(2, Math.ceil(this.numVars / 2));
    const map = Array(size).fill().map(() => Array(size).fill(0));

    this.minterms.forEach(minterm => {
      const [row, col] = this.getGrayCodePosition(minterm);
      if (row < size && col < size) {
        map[row][col] = 1;
      }
    });

    return map;
  }

  getGrayCodePosition(minterm) {
    const binary = minterm.toString(2).padStart(this.numVars, '0');
    const rowVars = Math.ceil(this.numVars / 2);

    const rowBinary = binary.slice(0, rowVars);
    const colBinary = binary.slice(rowVars);

    const row = this.binaryToGray(parseInt(rowBinary, 2));
    const col = this.binaryToGray(parseInt(colBinary, 2));

    return [row, col];
  }

  binaryToGray(num) {
    return num ^ (num >> 1);
  }

  getHeaders() {
    const rowVars = Math.ceil(this.numVars / 2);
    const colVars = Math.floor(this.numVars / 2);

    const rowLabels = this.generateGrayCodeLabels(rowVars);
    const colLabels = this.generateGrayCodeLabels(colVars);

    return { rowLabels, colLabels };
  }

  generateGrayCodeLabels(numBits) {
    const labels = [];
    for (let i = 0; i < Math.pow(2, numBits); i++) {
      const gray = this.binaryToGray(i);
      const binary = gray.toString(2).padStart(numBits, '0');
      labels.push(binary);
    }
    return labels;
  }

  minimize() {
    // Simple minimization - find largest groups
    const groups = this.findGroups();
    return this.groupsToExpression(groups);
  }

  findGroups() {
    const groups = [];
    const visited = new Set();

    // Find groups of 8 (4x2)
    for (let i = 0; i < this.map.length; i++) {
      for (let j = 0; j < this.map[0].length; j++) {
        if (this.map[i][j] === 1 && !visited.has(`${i},${j}`)) {
          const group = this.findGroupOfSize(i, j, 4, 2);
          if (group.length >= 8) {
            groups.push(group);
            group.forEach(([r, c]) => visited.add(`${r},${c}`));
          }
        }
      }
    }

    // Find groups of 4 (2x2)
    for (let i = 0; i < this.map.length; i++) {
      for (let j = 0; j < this.map[0].length; j++) {
        if (this.map[i][j] === 1 && !visited.has(`${i},${j}`)) {
          const group = this.findGroupOfSize(i, j, 2, 2);
          if (group.length >= 4) {
            groups.push(group);
            group.forEach(([r, c]) => visited.add(`${r},${c}`));
          }
        }
      }
    }

    // Find groups of 2 (horizontal and vertical)
    for (let i = 0; i < this.map.length; i++) {
      for (let j = 0; j < this.map[0].length; j++) {
        if (this.map[i][j] === 1 && !visited.has(`${i},${j}`)) {
          // Try horizontal group
          const hGroup = this.findGroupOfSize(i, j, 1, 2);
          if (hGroup.length >= 2) {
            groups.push(hGroup);
            hGroup.forEach(([r, c]) => visited.add(`${r},${c}`));
          } else {
            // Try vertical group
            const vGroup = this.findGroupOfSize(i, j, 2, 1);
            if (vGroup.length >= 2) {
              groups.push(vGroup);
              vGroup.forEach(([r, c]) => visited.add(`${r},${c}`));
            } else {
              // Single cell
              groups.push([[i, j]]);
              visited.add(`${i},${j}`);
            }
          }
        }
      }
    }

    return groups;
  }

  findGroupOfSize(startRow, startCol, height, width) {
    const group = [];

    for (let r = 0; r < height; r++) {
      for (let c = 0; c < width; c++) {
        const row = (startRow + r) % this.map.length;
        const col = (startCol + c) % this.map[0].length;

        if (this.map[row][col] === 1) {
          group.push([row, col]);
        } else {
          return []; // Can't form a complete group
        }
      }
    }

    return group;
  }

  groupsToExpression(groups) {
    const terms = [];

    groups.forEach(group => {
      const term = this.groupToTerm(group);
      if (term) terms.push(term);
    });

    return terms.length > 0 ? terms.join(' + ') : '0';
  }

  groupToTerm(group) {
    if (group.length === 0) return '';

    const [firstRow, firstCol] = group[0];
    const firstBinary = this.positionToBinary(firstRow, firstCol);

    let term = '';
    const variables = this.variables;

    for (let i = 0; i < this.numVars; i++) {
      let allSame = true;
      const firstBit = firstBinary[i];

      for (const [r, c] of group) {
        const binary = this.positionToBinary(r, c);
        if (binary[i] !== firstBit) {
          allSame = false;
          break;
        }
      }

      if (allSame) {
        term += firstBit === '0' ? variables[i] : `¬${variables[i]}`;
      }
      // If not all same, don't include this variable (it's "don't care")
    }

    return term || '1'; // If no variables, it's the constant 1
  }

  positionToBinary(row, col) {
    const rowVars = Math.ceil(this.numVars / 2);
    const colVars = Math.floor(this.numVars / 2);

    const rowGray = row;
    const colGray = col;

    const rowBinary = this.grayToBinary(rowGray).toString(2).padStart(rowVars, '0');
    const colBinary = this.grayToBinary(colGray).toString(2).padStart(colVars, '0');

    return rowBinary + colBinary;
  }

  grayToBinary(gray) {
    let binary = gray;
    while (gray > 0) {
      gray >>= 1;
      binary ^= gray;
    }
    return binary;
  }
}

export function KMapSolver() {
  const [numVars, setNumVars] = useState(3);
  const [mintermsInput, setMintermsInput] = useState("0,1,3,7");

  const kmap = useMemo(() => {
    const minterms = mintermsInput
      .split(',')
      .map(s => parseInt(s.trim()))
      .filter(n => !isNaN(n) && n >= 0 && n < Math.pow(2, numVars));

    return new KarnaughMap(numVars, minterms);
  }, [numVars, mintermsInput]);

  const minimized = useMemo(() => {
    return kmap.minimize();
  }, [kmap]);

  const { rowLabels, colLabels } = kmap.getHeaders();

  const formatMap = () => {
    let result = '';

    // Column headers
    result += '\t';
    colLabels.forEach(label => {
      result += label + '\t';
    });
    result += '\n';

    // Map rows
    kmap.map.forEach((row, i) => {
      result += rowLabels[i] + '\t';
      row.forEach(cell => {
        result += cell + '\t';
      });
      result += '\n';
    });

    return result;
  };

  return (
    <ToolCard
      title="K-Map Solver"
      icon={<Grid3X3 className="text-indigo-400" size={18} />}
      footer={
        <div className="space-y-2">
          <div>
            <span className="text-zinc-400">Example: </span>
            <span className="font-mono text-zinc-300">Minterms "0,1,3,7" → Simplified Boolean expression</span>
          </div>
          <div className="flex items-start gap-2">
            <Info size={14} className="mt-0.5"/>
            <div className="text-xs">
              <span>Simplify Boolean expressions using Karnaugh maps. Enter minterm indices (0-{Math.pow(2, numVars) - 1} for {numVars} variables). </span>
              <a href="https://en.wikipedia.org/wiki/Karnaugh_map" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 underline">
                Learn about Karnaugh maps
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
      <Row>
        <div>
          <Label>Number of Variables</Label>
          <Select
            value={numVars}
            onChange={(v) => setNumVars(Number(v))}
            options={[
              { label: "2 Variables", value: 2 },
              { label: "3 Variables", value: 3 },
              { label: "4 Variables", value: 4 }
            ]}
          />
        </div>
        <div>
          <Label>Minterms (comma-separated)</Label>
          <TextInput
            value={mintermsInput}
            onChange={setMintermsInput}
            placeholder="e.g. 0,1,3,7"
          />
        </div>
      </Row>

      <div className="mt-4">
        <Label>Karnaugh Map</Label>
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 font-mono text-sm">
          <pre className="text-zinc-100 whitespace-pre-wrap">{formatMap()}</pre>
        </div>
      </div>

      <div className="mt-4">
        <Label>Minimized Expression</Label>
        <div className="flex gap-2">
          <TextInput value={minimized} readOnly />
          <CopyButton text={minimized} />
        </div>
      </div>

      <div className="mt-2 text-sm text-zinc-400">
        Variables: {kmap.variables.join(', ')} |
        Minterms: {kmap.minterms.length} |
        Max terms: {Math.pow(2, numVars) - kmap.minterms.length}
      </div>
    </ToolCard>
  );
}
