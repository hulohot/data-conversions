import React, { useMemo, useState } from 'react';
import { Calculator } from 'lucide-react';
import { parseBigInt, toBase } from '../utils/conversionUtils';
import {
  ToolCard,
  Label,
  TextInput,
  Select,
  Row,
  CopyButton
} from './UIComponents';

const BASE_OPTIONS = [
  { label: 'Binary (2)', value: '2' },
  { label: 'Octal (8)', value: '8' },
  { label: 'Decimal (10)', value: '10' },
  { label: 'Hex (16)', value: '16' }
];

const OPERATION_OPTIONS = [
  { value: 'add', label: 'Addition (+)', symbol: '+', kind: 'arithmetic' },
  { value: 'subtract', label: 'Subtraction (-)', symbol: '-', kind: 'arithmetic' },
  { value: 'and', label: 'Bitwise AND (&)', symbol: '&', kind: 'bitwise' },
  { value: 'or', label: 'Bitwise OR (|)', symbol: '|', kind: 'bitwise' },
  { value: 'xor', label: 'XOR (bitwise addition)', symbol: '^', kind: 'bitwise' },
  { value: 'xnor', label: 'XNOR (bitwise)', symbol: '~^', kind: 'bitwise' },
  { value: 'nand', label: 'NAND (bitwise)', symbol: '~&', kind: 'bitwise' },
  { value: 'nor', label: 'NOR (bitwise)', symbol: '~|', kind: 'bitwise' }
];

const EXAMPLES_BY_BASE = {
  2: { first: '1101', second: '1011' },
  8: { first: '15', second: '13' },
  10: { first: '13', second: '11' },
  16: { first: 'D', second: 'B' }
};

export function XorCalculator() {
  const [val1, setVal1] = useState('');
  const [val2, setVal2] = useState('');
  const [base1, setBase1] = useState('2');
  const [base2, setBase2] = useState('2');
  const [operation, setOperation] = useState('xor');
  const [bits, setBits] = useState(32);

  const base1Num = Number(base1);
  const base2Num = Number(base2);

  const selectedOperation = useMemo(
    () => OPERATION_OPTIONS.find((op) => op.value === operation) || OPERATION_OPTIONS[0],
    [operation]
  );

  const normalizedBits = useMemo(() => {
    const next = Number.parseInt(String(bits), 10);
    if (Number.isNaN(next)) return 32;
    return Math.min(1024, Math.max(1, next));
  }, [bits]);

  const value1Big = useMemo(() => parseBigInt(val1, base1Num), [val1, base1Num]);
  const value2Big = useMemo(() => parseBigInt(val2, base2Num), [val2, base2Num]);

  const calculation = useMemo(() => {
    if (value1Big == null || value2Big == null) return null;

    const width = BigInt(normalizedBits);
    const bitRange = 1n << width;
    const mask = bitRange - 1n;
    const leftMasked = value1Big & mask;
    const rightMasked = value2Big & mask;

    let result = 0n;
    switch (operation) {
      case 'add':
        result = value1Big + value2Big;
        break;
      case 'subtract':
        result = value1Big - value2Big;
        break;
      case 'and':
        result = leftMasked & rightMasked;
        break;
      case 'or':
        result = leftMasked | rightMasked;
        break;
      case 'xor':
        result = leftMasked ^ rightMasked;
        break;
      case 'xnor':
        result = ~(leftMasked ^ rightMasked) & mask;
        break;
      case 'nand':
        result = ~(leftMasked & rightMasked) & mask;
        break;
      case 'nor':
        result = ~(leftMasked | rightMasked) & mask;
        break;
      default:
        result = leftMasked ^ rightMasked;
        break;
    }

    const unsignedPadded = ((result % bitRange) + bitRange) % bitRange;

    return {
      result,
      bin: toBase(result, 2),
      oct: toBase(result, 8),
      dec: result.toString(10),
      hex: toBase(result, 16),
      paddedBin: unsignedPadded.toString(2).padStart(normalizedBits, '0')
    };
  }, [value1Big, value2Big, operation, normalizedBits]);

  const base1Example = EXAMPLES_BY_BASE[base1Num]?.first || '1101';
  const base2Example = EXAMPLES_BY_BASE[base2Num]?.second || '1011';
  const inputValid =
    val1.trim() !== '' &&
    val2.trim() !== '' &&
    value1Big != null &&
    value2Big != null;

  return (
    <ToolCard
      title="Generic Bitwise Calculator"
      icon={<Calculator className="text-indigo-400" size={18} />}
      footer={
        <div className="space-y-2">
          <div>
            <span className="text-zinc-400">Example: </span>{' '}
            <span className="font-mono text-zinc-300">1101 ^ 1011 = 0110</span>
          </div>
          <div className="text-xs">
            <span>
              Supports arithmetic and bitwise operations across binary, octal, decimal, and hex inputs.
              Bitwise ops use the selected bit width for masking.
            </span>{' '}
            <a href="https://en.wikipedia.org/wiki/Bitwise_operation" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 underline">
              Bitwise operations
            </a>
            {' | '}
            <a href="https://en.wikipedia.org/wiki/Binary_number#Binary_arithmetic" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 underline">
              Binary arithmetic
            </a>
          </div>
        </div>
      }
    >
      <Row>
        <div>
          <Label>Value 1</Label>
          <TextInput
            value={val1}
            onChange={setVal1}
            placeholder={`e.g. ${base1Example}`}
          />
        </div>
        <div>
          <Label>Base 1</Label>
          <Select value={base1} onChange={setBase1} options={BASE_OPTIONS} />
        </div>
      </Row>

      <Row>
        <div>
          <Label>Value 2</Label>
          <TextInput
            value={val2}
            onChange={setVal2}
            placeholder={`e.g. ${base2Example}`}
          />
        </div>
        <div>
          <Label>Base 2</Label>
          <Select value={base2} onChange={setBase2} options={BASE_OPTIONS} />
        </div>
      </Row>

      <Row>
        <div>
          <Label>Operation</Label>
          <Select value={operation} onChange={setOperation} options={OPERATION_OPTIONS} />
        </div>
        <div>
          <Label>Bit Width</Label>
          <TextInput
            value={bits.toString()}
            onChange={(v) => setBits(Math.max(1, parseInt(v, 10) || 32))}
            placeholder="32 (used for bitwise mask + padded output)"
          />
        </div>
      </Row>

      {inputValid && calculation && (
        <div className="space-y-3">
          <div>
            <Label>Result (Binary)</Label>
            <div className="flex gap-2">
              <TextInput value={calculation.bin} readOnly />
              <CopyButton text={calculation.bin} />
            </div>
          </div>

          <Row>
            <div>
              <Label>Octal</Label>
              <div className="flex gap-2">
                <TextInput value={calculation.oct} readOnly />
                <CopyButton text={calculation.oct} />
              </div>
            </div>
            <div>
              <Label>Decimal</Label>
              <div className="flex gap-2">
                <TextInput value={calculation.dec} readOnly />
                <CopyButton text={calculation.dec} />
              </div>
            </div>
          </Row>

          <Row>
            <div>
              <Label>Hexadecimal</Label>
              <div className="flex gap-2">
                <TextInput value={calculation.hex} readOnly />
                <CopyButton text={calculation.hex} />
              </div>
            </div>
            <div>
              <Label>Binary ({normalizedBits}-bit padded)</Label>
              <div className="flex gap-2">
                <TextInput value={calculation.paddedBin} readOnly />
                <CopyButton text={calculation.paddedBin} />
              </div>
            </div>
          </Row>

          <div className="text-sm text-zinc-400">
            <div>Input 1: {val1} (base {base1}) = {value1Big?.toString(2)}₂</div>
            <div>Input 2: {val2} (base {base2}) = {value2Big?.toString(2)}₂</div>
            <div className="mt-1 font-mono">
              {value1Big?.toString(10)} {selectedOperation.symbol} {value2Big?.toString(10)} = {calculation.dec}
            </div>
            {selectedOperation.kind === 'bitwise' && (
              <div className="mt-1">Bitwise masking width: {normalizedBits} bits</div>
            )}
          </div>
        </div>
      )}

      {(!inputValid && (val1.trim() || val2.trim())) && (
        <div className="mt-4 p-3 rounded-xl bg-red-900/20 border border-red-800">
          <p className="text-red-400 text-sm">
            {!value1Big && val1.trim() ? 'Invalid Value 1 format for selected base' :
             !value2Big && val2.trim() ? 'Invalid Value 2 format for selected base' :
             'Please enter valid values in both fields'}
          </p>
        </div>
      )}
    </ToolCard>
  );
}
