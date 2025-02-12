# Railframe

A JavaScript library that handles bidirectional communication between container (parent) and iframe (client) applications using the postMessage API. It provides a simple interface for sending and receiving messages across different origins with built-in ready state handling and event namespacing.

## Features

- 🎯 Event namespacing support
- 🚦 Ready state handling
- 🐛 Configurable debug mode with detailed logging
- 🔍 Origin validation (support multiple origins)

## Installation

```bash
npm install railframe
# or
yarn add railframe
# or
pnpm add railframe
```

## Basic Usage

### In Container (Parent) App

```typescript
import { RailframeContainer } from 'railframe';

const container = new RailframeContainer(iframeElement, {
  targetOrigin: 'http://localhost:5174', // iframe origin
  debug: true, // enable debug logs
});

// Listen for events from iframe
container.on('form:submit', (data) => {
  console.log('Form submitted:', data);
});

// Send message to iframe
container.emit('update:data', { value: 42 });
```

### In Iframe App

```typescript
import { RailframeClient } from 'railframe';

const client = new RailframeClient({
  targetOrigin: 'http://localhost:5173', // parent origin
  debug: true,
});

// Listen for events from parent
client.on('update:data', (data) => {
  console.log('Data updated:', data);
});

// Send message to parent
client.emit('form:submit', formData);
```

## Event Namespacing

Railframe supports event namespacing for better organization:

```typescript
// Listen to all form events
container.on('form:*', (data) => {
  console.log('Form event:', data);
});

// Listen to specific form event
container.on('form:submit', (data) => {
  console.log('Form submitted:', data);
});
```

## API Reference

### RailframeContainer

```typescript
interface RailframeOptions {
  targetOrigin?: string
  debug?: boolean
  delimiter?: string // for namespace separation
}

new RailframeContainer(iframe: HTMLIFrameElement, options?: RailframeOptions)
```

Options:

- targetOrigin : Target origin for postMessage
- debug : Enable debug logging
- delimiter : Namespace delimiter (default: ':')

Methods:

- on(type: string, handler: MessageHandler) : Add event listener
- off(type: string, handler: MessageHandler) : Remove event listener
- emit(type: string, payload?: any) : Send message to iframe
- destroy() : Cleanup listeners

RailframeClient

```typescript
new RailframeClient(options?: RailframeOptions)
```

Options: Same as RailframeContainer

Methods: Same as RailframeContainer

## Development

```bash
# Install dependencies
pnpm install

# Build
pnpm build

# Development with watch mode
pnpm dev
```

## License

MIT
