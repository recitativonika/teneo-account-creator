const fs = require('fs');
const axios = require('axios');
const chalk = require('chalk');
const readline = require('readline');
const config = require('./config');
const { HttpsProxyAgent } = require('https-proxy-agent');

const displayWelcome = () => {
    console.log(`
* Teneo account creator *
* github.com/recitativonika *
    `);
};

const regurl = "https://ikknngrgxuxgjhplbpey.supabase.co/auth/v1/signup";

const AUTH = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlra25uZ3JneHV4Z2pocGxicGV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU0MzgxNTAsImV4cCI6MjA0MTAxNDE1MH0.DRAvf8nH1ojnJBc3rD_Nw6t1AV8X_g6gmY_HByG2Mag";
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlra25uZ3JneHV4Z2pocGxicGV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU0MzgxNTAsImV4cCI6MjA0MTAxNDE1MH0.DRAvf8nH1ojnJBc3rD_Nw6t1AV8X_g6gmY_HByG2Mag";

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function registerUser(email, proxy) {
  try {
    const axiosConfig = {
      headers: {
        'Authorization': AUTH,
        'apikey': API_KEY
      }
    };

    if (proxy) {
      const cleanedProxy = proxy.replace(/^http:\/\//, '');
      const proxyParts = cleanedProxy.split('@');
      const [authPart, hostPart] = proxyParts.length > 1 ? proxyParts : [null, proxyParts[0]];
      const [host, port] = hostPart.split(':');

      const proxyUrl = `http://${authPart ? authPart + '@' : ''}${host}:${port}`;
      console.log(`Using proxy: ${proxyUrl}`);
      axiosConfig.httpsAgent = new HttpsProxyAgent(proxyUrl);
    }

    const response = await axios.post(regurl, {
      email: email,
      password: config.password,
      data: { invited_by: config.reff },
      gotrue_meta_security: {},
      code_challenge: null,
      code_challenge_method: null
    }, axiosConfig);

    console.log(chalk.green('Successfully registered, please confirm your email:', email));
  } catch (error) {
    console.error(chalk.red('Error during registration for', email, error.response ? error.response.data : error.message));
  }
}

async function readEmailsAndRegister(useProxy) {
  fs.readFile('email.txt', 'utf8', async (err, data) => {
    if (err) {
      console.error(chalk.red('Error reading email file:', err));
      return;
    }

    const lines = data.split('\n').filter(line => line.trim() !== '');
    for (const line of lines) {
      const [email, proxy] = line.split(',').map(item => item.trim());
      await registerUser(email, useProxy ? proxy : null);
      await delay(config.delay);
    }
  });
}

function askUseProxy() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('Do you want to use a proxy? (y/n): ', (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y');
    });
  });
}

async function main() {
  displayWelcome();
  const useProxy = await askUseProxy();
  readEmailsAndRegister(useProxy);
}

main();