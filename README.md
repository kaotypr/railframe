# Railframe

A JavaScript library that handles bidirectional communication between container (parent) and iframe (client) applications using the postMessage API. It provides a simple interface for sending and receiving messages across different origins with built-in ready state handling and event namespacing.

> 💡 Railframe simplifies cross-origin communication between parent windows and iframes with type-safe messaging and built-in state management.

## Features

- 🎯 Event namespacing support
- 🚦 Ready state handling
- 🐛 Configurable debug mode with detailed logging
- 🔍 Origin validation (support multiple origins)

> ⚠️ When using multiple target origins, make sure to properly validate and whitelist allowed origins for security.

## Installation

```bash
npm install railframe
# or
yarn add railframe
# or
pnpm add railframe
```

## Basic Usage

### RailframeContainer - In parent app

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

### RailframeClient - In iframe app

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

### RailframeGlobal - Works in both parent and iframe
RailframeGlobal is a class that combines both client and container functionality, allowing direct communication between parent window and iframes without managing ready states.

> 🔔 Unlike RailframeContainer, RailframeGlobal doesn't manage iframe ready states. Messages are sent immediately without queueing.

```typescript
import { RailframeClient } from 'railframe';

// Initialize
const global = new RailframeGlobal(options?)

// Listen for messages
global.on('message:type', (payload) => {
  console.log(payload)
})

// Send message to parent window
global.emitToContainer('message:type', payload)

// Send message to specific iframe
global.emitToClient(iframeElement, 'message:type', payload)

// Clean up
global.destroy()
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
new RailframeContainer(iframe: HTMLIFrameElement, options?: RailframeOptions)
```

#### Parameters:

- **iframe**: Iframe element to communicate with
- **options**:
  - **targetOrigin**: Target origin for postMessage
  - **debug**: Enable debug logging
  - **delimiter**: Namespace delimiter (default: `:`)

```typescript
[
    HTMLIFrameElement,
    {
        targetOrigin: string | string[]
        debug: boolean
    }
]
```

#### Methods:

- **on**: Add event listener
- **off**: Remove event listener, if handler is not provided, all handlers for the event will be removed
- **emit**: Send message to iframe
- **destroy**: Cleanup listeners

```typescript
{
    on: (type: string, handler: MessageHandler) => void
    off: (type: string, handler?: MessageHandler) => void
    emit: (type: string, payload?: any) => void
    destroy: () => void
}
```

### RailframeClient

```typescript
new RailframeClient(options?: RailframeOptions)
```

#### Parameters:

> Same as RailframeContainer options argument

#### Methods:

> Same as RailframeContainer methods

### RailframeGlobal

```typescript
new RailframeGlobal(options?: RailframeOptions)
```

#### Parameters:

> Same as RailframeContainer options argument

#### Methods:

- **on**: Add event listener
- **off**: Remove event listener, if handler is not provided, all handlers for the event will be removed
- **emitToClient**: Send message to iframe
- **emitToContainer**: Send message to parent window
- **destroy**: Cleanup listeners

```typescript
{
    on: (type: string, handler: MessageHandler) => void
    off: (type: string, handler?: MessageHandler) => void
    emitToClient: (iframe: HTMLIframeElement, type: string, payload?: any) => void
    emitToContainer: (type: string, payload?: any) => void
    destroy: () => void
}
```

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
