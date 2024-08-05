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

export interface Options {
    /**
     * Amount of ping data to send, in bytes
     *
     * @default 56
     */
    bytes: number;
    /**
     * The exponential backoff factor
     *
     * @default 1.5
     */
    backoff: number;
    /**
     * Send this many pings to each target
     *
     * @default 1
     */
    count: number;
    /**
     * Interval between sending ping packets (in milliseconds)
     *
     * @default 10
     */
    interval: number;
    /**
     * Interval between ping packets to one target (in milliseconds)
     *
     * @default 1000
     */
    period: number;
    /**
     * Number of retries
     *
     * @default 3
     */
    retry: number;
    /**
     * Random packet data (to foil link data compression)
     *
     * @default true
     */
    random: boolean;
    /**
     * Individual target initial timeout (in milliseconds)
     *
     * @default 500
     */
    timeout: number;
    /**
     * Set the digit count of latency times
     *
     * @default 3
     */
    digits: number;
    /**
     * Set the digit count of loss percentage
     *
     * @default 4
     */
    lossDigits: number;
}

/**
 * A ping result from fping
 */
export interface Result {
    target: string;
    sent: number;
    received: number;
    loss: number;
    avg: number;
    min: number;
    max: number;
    stddev: number;
    times: number[];
}

/**
 * The results of a fping operation keyed by the target IP
 */
export type ResultSet = Record<string, Result | undefined>;
