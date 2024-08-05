// Copyright (c) 2024, Brandon Lehmann <brandonlehmann@gmail.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import { exec } from 'child_process';
import { Address4, Address6 } from 'ip-address';
import which from 'which';
import { Options, Result, ResultSet } from './types';

export { Options, Result, ResultSet };

/** @ignore */
const toFixed = (value: number, digits = 3): number =>
    parseFloat(value.toFixed(digits));

/** @ignore */
const checkIp = (value: string): string => {
    try {
        if (value.includes(':')) {
            return (new Address6(value)).address;
        }

        return (new Address4(value)).address;
    } catch (error: any) {
        throw new Error(`${error.toString()} ${value}`);
    }
};

/**
 * Performs a fping of the specified hosts with the specified options
 *
 * @param targets
 * @param options
 */
const fping = async (
    targets: string[],
    options: Partial<Options> = {}
): Promise<ResultSet> => {
    options.bytes ??= 56;
    options.backoff ??= 1.5;
    options.count ??= 1;
    options.interval ??= 10;
    options.period ??= 1000;
    options.retry ??= 3;
    options.random ??= true;
    options.timeout ??= 500;
    options.digits ??= 3;
    options.lossDigits ??= 4;

    // Check to make sure that IP addresses supplied are valid, throws if not
    targets.forEach(target => checkIp(target));

    // Check to make sure our options are valid
    if (options.bytes < 40) {
        throw new Error('Bytes must be at least 40 bytes');
    }

    if (options.backoff < 0) options.backoff = 0;

    if (options.count <= 0) {
        throw new Error('Count must be >= 1');
    }

    if (options.interval <= 0) options.interval = 0;

    if (options.period <= 0) options.period = 0;

    if (options.retry <= 0) options.retry = 0;

    if (options.timeout <= 0) options.timeout = 0;

    if (options.digits <= 0) options.digits = 0;

    if (options.lossDigits < 2) {
        throw new Error('lossDigits must be at least 2');
    }

    const binary = await which('fping', { nothrow: true });

    if (!binary) {
        throw new Error('fping could not be found, is it installed?');
    }

    const fping_options: string[] = [
        '-A',
        '-q',
        `-b ${options.bytes}`,
        `-B ${options.backoff}`,
        `-C ${options.count}`,
        `-i ${options.interval}`,
        `-p ${options.period}`,
        `-r ${options.retry}`,
        `-t ${options.timeout}`
    ];

    if (options.random) {
        fping_options.push('-R');
    }

    const { timeout, digits, lossDigits } = options;

    return new Promise(resolve =>
        exec(`${binary} ${fping_options.join(' ')} ${targets.join(' ')}`,
            (_error, stdout, stderr) => {
                const lines = (stdout || stderr).split('\n')
                    .map(line => line.trim())
                    .filter(line => line.length !== 0)
                    .map(line => line.split(':').map(col => col.trim()));

                const result: ResultSet = {};

                for (const [host, response] of lines) {
                    const times = response.split(' ')
                        .map(ping => parseFloat(ping) || timeout);

                    const received = times.filter(ping => ping < timeout).length;
                    const avg = times.reduce((a, b) => a + b) / times.length;

                    result[host] = {
                        target: host,
                        sent: times.length,
                        received,
                        loss: toFixed(1 - (received / times.length), lossDigits),
                        avg: toFixed(avg, digits),
                        min: toFixed(Math.min(...times), digits),
                        max: toFixed(Math.max(...times), digits),
                        stddev: toFixed(Math.sqrt(times.map(x =>
                            Math.pow(x - avg, 2))
                            .reduce((a, b) => a + b) / times.length)),
                        times: times.map(time => toFixed(time, digits))
                    };
                }

                return resolve(result);
            }));
};

export default fping;
