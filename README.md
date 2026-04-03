# @gibme/fping

A simple promise-based wrapper around [fping](https://fping.org/) for Node.js.

## Requirements

- Node.js >= 22
- `fping` must be installed on the system
  - **Linux:** `sudo apt install fping`
  - **macOS:** `brew install fping`

## Installation

```bash
npm install @gibme/fping
```

or

```bash
yarn add @gibme/fping
```

## Usage

```typescript
import fping from '@gibme/fping';

const results = await fping(['1.1.1.1', '8.8.8.8']);

console.log(results);
```

### With Options

```typescript
const results = await fping(['1.1.1.1', '8.8.8.8'], {
    count: 3,
    timeout: 1000,
    retry: 5
});

for (const [host, result] of Object.entries(results)) {
    if (result) {
        console.log(`${host}: avg=${result.avg}ms, loss=${result.loss * 100}%`);
    }
}
```

## Options

All options are optional. Defaults are shown below.

| Option | Type | Default | Description |
|---|---|---|---|
| `bytes` | `number` | `56` | Amount of ping data to send (minimum 40) |
| `backoff` | `number` | `1.5` | Exponential backoff factor |
| `count` | `number` | `1` | Number of pings to send per target (minimum 1) |
| `interval` | `number` | `10` | Interval between ping packets in ms |
| `period` | `number` | `1000` | Interval between pings to one target in ms |
| `retry` | `number` | `3` | Number of retries |
| `random` | `boolean` | `true` | Use random packet data |
| `timeout` | `number` | `500` | Per-target initial timeout in ms |
| `digits` | `number` | `3` | Decimal digits for latency values |
| `lossDigits` | `number` | `4` | Decimal digits for loss percentage (minimum 2) |

## Result

Each target returns a `fping.Result` object:

```typescript
{
    target: string;    // The host that was pinged
    sent: number;      // Packets sent
    received: number;  // Packets received
    loss: number;      // Loss as a decimal (0.25 = 25%)
    avg: number;       // Average latency in ms
    min: number;       // Minimum latency in ms
    max: number;       // Maximum latency in ms
    stddev: number;    // Standard deviation of latencies
    times: number[];   // Individual ping times in ms
}
```

## Documentation

[https://gibme-npm.github.io/fping/](https://gibme-npm.github.io/fping/)

## License

MIT
