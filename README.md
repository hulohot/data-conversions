# CE Dark Conversions

A beautiful, dark-themed React web application featuring various engineering calculators for everyday use. Built with React, Vite, and Tailwind CSS.

## Features

- **Base Converter**: Convert between binary, octal, decimal, and hexadecimal with support for custom bases
- **Time ↔ Frequency Converter**: Convert between time periods and frequencies with multiple unit support
- **Two's Complement Calculator**: Handle signed binary numbers
- **Binary Padding Tools**: Easily pad binary strings to specific lengths
- **Size Converters**: Convert between bits, bytes, and IEC/SI prefixes
- **Throughput Calculator**: Calculate data throughput from bus width and clock frequency
- **ASCII ↔ Hex Converter**: Convert between ASCII text and hexadecimal representations
- **2^n Calculator**: Compute powers of two and related values
- **Bit Inverter**: Reverse bit order (MSB↔LSB) in various bases

## Tech Stack

- **React 19** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **JetBrains Mono** - Monospace font for technical content

## Development

### Prerequisites

- Node.js (v20 or higher recommended)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/data-conversions.git
cd data-conversions

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Deployment to GitHub Pages

### Setup

1. Update the `homepage` field in `package.json` with your GitHub username:
   ```json
   "homepage": "https://yourusername.github.io/data-conversions"
   ```

2. Update the `vite.config.js` base path if needed (already configured for `/data-conversions/`)

### Deploy

```bash
npm run deploy
```

This will build the project and deploy it to GitHub Pages.

### Manual Deployment

If you prefer to deploy manually:

1. Build the project:
   ```bash
   npm run build
   ```

2. The `dist` folder will contain the built files

3. Enable GitHub Pages in your repository settings:
   - Go to Settings → Pages
   - Source: "Deploy from a branch"
   - Branch: `main` or `gh-pages`
   - Folder: `/ (root)` or `/docs`

4. Upload the contents of the `dist` folder to your GitHub Pages branch

## Project Structure

```
data-conversions/
├── src/
│   ├── components/
│   │   ├── BaseConverter.jsx
│   │   ├── TimeFreq.jsx
│   │   ├── ModuleManager.jsx
│   │   ├── UIComponents.jsx
│   │   └── ConversionSuite.jsx
│   ├── utils/
│   │   └── conversionUtils.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Features in Detail

### Base Converter
- Support for binary, octal, decimal, hexadecimal, and custom bases (2-36)
- Two's complement interpretation for signed binary numbers
- Configurable bit padding
- Real-time conversion between all bases

### Time-Frequency Converter
- Convert between time periods (seconds, milliseconds, microseconds, nanoseconds, picoseconds)
- Convert between frequencies (Hz, kHz, MHz, GHz)
- Automatic reciprocal calculations
- Quick preset buttons for common values

### Module Management
- Drag-and-drop reordering of calculator modules
- Show/hide individual calculators
- Settings persist in localStorage

## Customization

The app is highly customizable:

- **Color Scheme**: Dark theme with zinc color palette
- **Typography**: JetBrains Mono for technical content
- **Layout**: Responsive grid system
- **Modules**: Easily add new calculator modules

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Original concept from ChatGPT Canvas
- Icons from [Lucide](https://lucide.dev/)
- Font from [Google Fonts](https://fonts.google.com/)