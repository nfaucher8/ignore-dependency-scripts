#!/usr/bin/env node

/**
 * MIT License
 *
 * Copyright (c) 2022 Douglas Nassif Roma Junior
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const rootPath = process.cwd();

console.log('Running in rootPath:', rootPath);

const gitPath = path.resolve(rootPath, '.git');

let myLibAsDep = !fs.existsSync(gitPath);

// Ignore the first 2 args in argv because they are the path and script name
let argCount = 2;
for (let arg of process.argv.slice(2)) {
  if (arg.startsWith("-")) {
    // Add 1 for each argument found starting with "-"
    argCount = argCount + 1;

    switch(arg) {
      case '-i': 
        // Inverse flag, instead of running the script when it is not a dependency run it when it is a dependency
        myLibAsDep = !myLibAsDep;
        break;
      default: 
        console.log(`Unknown flag ${arg}`);
    }
  } else {
    // After we find the first non "-" arg stop checking
    break;
  }
}

// Use the arg count from before to get only script args
const scripts = process.argv.slice(argCount).join(' ');

if (!scripts) {
  throw new Error('No script was provided.');
}

function main() {
  if (myLibAsDep) {
    console.log('Ignored script:', scripts);
    return;
  }

  const cmdProcess = exec(scripts);

  cmdProcess.stdout.pipe(process.stdout);
  cmdProcess.stderr.pipe(process.stdout);

  cmdProcess.on('exit', function (code) {
    console.log('Process exited with code: ' + code);
    process.exit(code);
  });
}

main();
