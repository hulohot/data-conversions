import React, { useState, useMemo } from 'react';
import { Shield, Info, RefreshCcw } from "lucide-react";
import CryptoJS from 'crypto-js';
import {
  ToolCard,
  Label,
  TextInput,
  Select,
  Row,
  CopyButton,
  Actions
} from './UIComponents';

export function AESCalculator() {
  const [mode, setMode] = useState('encrypt');
  const [inputText, setInputText] = useState('');
  const [key, setKey] = useState('');
  const [iv, setIv] = useState('');
  const [keySize, setKeySize] = useState('256');
  const [modeType, setModeType] = useState('CBC');
  const [outputFormat, setOutputFormat] = useState('hex');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  // Generate random key and IV
  const generateRandomKey = () => {
    const keyLength = parseInt(keySize) / 8; // Convert bits to bytes
    const randomKey = CryptoJS.lib.WordArray.random(keyLength);
    setKey(randomKey.toString(CryptoJS.enc.Hex));
  };

  const generateRandomIV = () => {
    const randomIV = CryptoJS.lib.WordArray.random(16); // 128 bits = 16 bytes
    setIv(randomIV.toString(CryptoJS.enc.Hex));
  };

  // Process encryption/decryption
  const processAES = () => {
    setError('');
    setOutput('');

    if (!inputText.trim()) {
      setError('Please enter text to process');
      return;
    }

    if (!key.trim()) {
      setError('Please enter a key');
      return;
    }

    try {
      let result;
      const keyWordArray = CryptoJS.enc.Hex.parse(key);
      
      if (mode === 'encrypt') {
        if (modeType === 'ECB') {
          result = CryptoJS.AES.encrypt(inputText, keyWordArray, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
          });
        } else {
          if (!iv.trim()) {
            setError('IV is required for CBC mode');
            return;
          }
          const ivWordArray = CryptoJS.enc.Hex.parse(iv);
          result = CryptoJS.AES.encrypt(inputText, keyWordArray, {
            iv: ivWordArray,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
          });
        }
        
        // Format output based on selected format
        let formattedOutput;
        if (outputFormat === 'hex') {
          formattedOutput = result.ciphertext.toString(CryptoJS.enc.Hex);
        } else if (outputFormat === 'base64') {
          formattedOutput = result.toString();
        } else if (outputFormat === 'base64url') {
          formattedOutput = result.toString().replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
        }
        setOutput(formattedOutput);
      } else {
        // For decryption, we need to handle different input formats
        let ciphertext;
        if (outputFormat === 'hex') {
          // If input is hex, we need to convert it back to a CipherParams object
          const hexString = inputText.replace(/\s/g, ''); // Remove any whitespace
          ciphertext = CryptoJS.lib.CipherParams.create({
            ciphertext: CryptoJS.enc.Hex.parse(hexString)
          });
        } else if (outputFormat === 'base64url') {
          // Convert base64url back to base64
          const base64 = inputText.replace(/-/g, '+').replace(/_/g, '/');
          const padding = '='.repeat((4 - base64.length % 4) % 4);
          ciphertext = base64 + padding;
        } else {
          ciphertext = inputText;
        }
        
        if (modeType === 'ECB') {
          result = CryptoJS.AES.decrypt(ciphertext, keyWordArray, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
          });
        } else {
          if (!iv.trim()) {
            setError('IV is required for CBC mode');
            return;
          }
          const ivWordArray = CryptoJS.enc.Hex.parse(iv);
          result = CryptoJS.AES.decrypt(ciphertext, keyWordArray, {
            iv: ivWordArray,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
          });
        }
        const decryptedText = result.toString(CryptoJS.enc.Utf8);
        if (!decryptedText) {
          setError('Decryption failed. Please check your key, IV, and input.');
          return;
        }
        setOutput(decryptedText);
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
    }
  };

  const resetAll = () => {
    setInputText('');
    setKey('');
    setIv('');
    setOutput('');
    setError('');
  };

  const keySizeOptions = [
    { label: "128 bits (16 bytes)", value: "128" },
    { label: "192 bits (24 bytes)", value: "192" },
    { label: "256 bits (32 bytes)", value: "256" }
  ];

  const modeOptions = [
    { label: "Encrypt", value: "encrypt" },
    { label: "Decrypt", value: "decrypt" }
  ];

  const modeTypeOptions = [
    { label: "CBC (Cipher Block Chaining)", value: "CBC" },
    { label: "ECB (Electronic Codebook)", value: "ECB" }
  ];

  const outputFormatOptions = [
    { label: "Hex", value: "hex" },
    { label: "Base64", value: "base64" },
    { label: "Base64URL", value: "base64url" }
  ];

  return (
    <ToolCard
      title="AES Calculator"
      icon={<Shield className="text-indigo-400" size={18} />}
      footer={
        <div className="space-y-2">
          <div>
            <span className="text-zinc-400">Example: </span>
            <span className="font-mono text-zinc-300">Encrypt "Hello World" with a 256-bit key → hex output</span>
          </div>
          <div className="flex items-start gap-2">
            <Info size={14} className="mt-0.5"/>
            <div className="text-xs">
              <span>Advanced Encryption Standard (AES) calculator for encryption and decryption. Supports 128, 192, and 256-bit keys with CBC and ECB modes. </span>
              <a href="https://en.wikipedia.org/wiki/Advanced_Encryption_Standard" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 underline">
                Learn about AES
              </a>
              {" | "}
              <a href="https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 underline">
                Block cipher modes
              </a>
            </div>
          </div>
        </div>
      }
    >
      <Row>
        <div>
          <Label>Mode</Label>
          <Select value={mode} onChange={setMode} options={modeOptions} />
        </div>
        <div>
          <Label>Key Size</Label>
          <Select value={keySize} onChange={setKeySize} options={keySizeOptions} />
        </div>
      </Row>

      <Row>
        <div>
          <Label>Encryption Mode</Label>
          <Select value={modeType} onChange={setModeType} options={modeTypeOptions} />
        </div>
        <div>
          <Label>Output Format</Label>
          <Select value={outputFormat} onChange={setOutputFormat} options={outputFormatOptions} />
        </div>
      </Row>

      <Row>
        <div>
          <Label>Actions</Label>
          <div className="flex gap-2">
            <button 
              onClick={generateRandomKey}
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-sm transition-colors"
            >
              <RefreshCcw size={14} /> Random Key
            </button>
            {modeType === 'CBC' && (
              <button 
                onClick={generateRandomIV}
                className="flex items-center gap-1 px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-sm transition-colors"
              >
                <RefreshCcw size={14} /> Random IV
              </button>
            )}
          </div>
        </div>
        <div></div>
      </Row>

      <div>
        <Label>Key (Hex)</Label>
        <div className="flex gap-2">
          <TextInput 
            value={key} 
            onChange={setKey} 
            placeholder={`Enter ${keySize}-bit key in hex format`}
          />
          <CopyButton text={key} />
        </div>
      </div>

      {modeType === 'CBC' && (
        <div>
          <Label>Initialization Vector - IV (Hex)</Label>
          <div className="flex gap-2">
            <TextInput 
              value={iv} 
              onChange={setIv} 
              placeholder="Enter 128-bit IV in hex format"
            />
            <CopyButton text={iv} />
          </div>
        </div>
      )}

      <div>
        <Label>{mode === 'encrypt' ? 'Plaintext' : `Ciphertext (${outputFormat.toUpperCase()})`}</Label>
        <TextInput 
          value={inputText} 
          onChange={setInputText} 
          placeholder={mode === 'encrypt' ? 'Enter text to encrypt' : `Enter ciphertext in ${outputFormat} format to decrypt`}
        />
      </div>

      <div className="flex gap-2">
        <button 
          onClick={processAES}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors"
        >
          <Shield size={16} />
          {mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}
        </button>
        <button 
          onClick={resetAll}
          className="flex items-center gap-2 px-4 py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 transition-colors"
        >
          <RefreshCcw size={16} />
          Reset
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-900/30 border border-red-800 text-red-300 text-sm">
          {error}
        </div>
      )}

      {output && (
        <div>
          <Label>{mode === 'encrypt' ? `Ciphertext (${outputFormat.toUpperCase()})` : 'Decrypted Text'}</Label>
          <div className="flex gap-2">
            <TextInput 
              value={output} 
              readOnly 
              placeholder="Result will appear here"
            />
            <CopyButton text={output} />
          </div>
        </div>
      )}

      <div className="text-xs text-zinc-500 space-y-1">
        <div><strong>Key Format:</strong> Enter keys as hexadecimal strings (e.g., "2b7e151628aed2a6abf7158809cf4f3c")</div>
        <div><strong>IV Format:</strong> Enter IV as 32-character hex string for 128-bit IV</div>
        <div><strong>Security Note:</strong> This tool is for educational purposes. Use proper cryptographic libraries for production.</div>
      </div>
    </ToolCard>
  );
}
