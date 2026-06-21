import fs from 'fs';
import readline from 'readline';

async function main() {
  const fileStream = fs.createReadStream('C:/Users/wonde/.gemini/antigravity-ide/brain/224bb04f-aab9-45c8-804f-0db5e5ba7151/.system_generated/logs/transcript.jsonl');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let index = 0;
  for await (const line of rl) {
    try {
      const obj = JSON.parse(line);
      if (obj.type === 'USER_INPUT') {
        console.log(`[USER_INPUT] Step ${obj.step_index}:`, obj.content || obj.text || obj.message || JSON.stringify(obj));
        console.log('---');
      }
    } catch (e) {
      // ignore parse errors
    }
    index++;
  }
}

main();
