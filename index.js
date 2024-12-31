const fs = require('fs');
const chalk = require('chalk');
const readline = require('readline');
const config = require('./src/config');
const { HttpsProxyAgent } = require('https-proxy-agent');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://node-b.teneo.pro';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlra25uZ3JneHV4Z2pocGxicGV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU0MzgxNTAsImV4cCI6MjA0MTAxNDE1MH0.DRAvf8nH1ojnJBc3rD_Nw6t1AV8X_g6gmY_HByG2Mag';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

function displayHeader() {
  const width = process.stdout.columns;
  const headerLines = [
    "<|============================================|>",
    " Teneo account register bot ",
    " github.com/recitativonika ",
    "<|============================================|>"
  ];
  console.log("");
  headerLines.forEach(line => {
    const padding = Math.max(0, Math.floor((width - line.length) / 2));
    console.log(chalk.green(' '.repeat(padding) + line));
  });
}

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkUserExists(email, proxy) {
  try {
    const options = {};

    if (proxy) {
      try {
        const agent = new HttpsProxyAgent(proxy);
        options.agent = agent;
      } catch (proxyError) {
        console.error(chalk.red(`Proxy error for ${email}: Invalid proxy configuration.`));
        return false;
      }
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: 'incorrect_password',
      options
    });

    return error ? false : true;
  } catch (error) {
    console.error(chalk.red('Unexpected error checking user existence for', email, error.message));
    throw error;
  }
}

async function registerUser(email, password, proxy) {
  try {
    const userExists = await checkUserExists(email, proxy);
    if (userExists) {
      console.log(chalk.yellow('Email already registered:', email));
      return;
    }

    const options = {
      data: { invited_by: config.reff }
    };

    if (proxy) {
      try {
        const agent = new HttpsProxyAgent(proxy);
        options.agent = agent;
      } catch (proxyError) {
        console.error(chalk.red(`Proxy error for ${email}: Invalid proxy configuration.`));
        return;
      }
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options
    });

    if (error) {
      console.error(chalk.red('Error during registration for', email, error.message));
      return;
    }

    console.log(chalk.green('Successfully registered, please confirm your email:', email));
    return { email, password };
  } catch (error) {
    console.error(chalk.red('Unexpected error during registration for', email, error.message));
  }
}

function askUseProxy() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('Do you want to use a proxy? (y/n): ', (answer) => {
      rl.close();
      process.stdout.moveCursor(0, -1);
      process.stdout.clearLine(1);
      process.stdout.moveCursor(0, -1);
      process.stdout.clearLine(1);
      resolve(answer.toLowerCase() === 'y');
    });
  });
}

function askPassword() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('Enter a password for all accounts (must contain lowercase, uppercase, and a symbol): ', (password) => {
      rl.close();
      const hasLowercase = /[a-z]/.test(password);
      const hasUppercase = /[A-Z]/.test(password);
      const hasSymbol = /[^a-zA-Z0-9]/.test(password);

      if (!hasLowercase || !hasUppercase || !hasSymbol) {
        console.log(chalk.yellow('Warning: Password does not meet the recommended criteria (lowercase, uppercase, and a symbol).'));
      }

      resolve(password);
    });
  });
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

async function readEmailsAndRegister(useProxy, password) {
  const emails = fs.readFileSync('email.txt', 'utf8').split('\n').map(line => line.trim()).filter(line => line !== '');
  const proxies = fs.readFileSync('proxy.txt', 'utf8').split('\n').map(line => line.trim()).filter(line => line !== '');

  if (useProxy && proxies.length === 0) {
    console.log(chalk.red('Proxy usage selected, but proxy.txt is empty. Stopping script.'));
    return;
  }

  if (useProxy && proxies.length < emails.length) {
    console.log(chalk.yellow('Number of proxies is less than the number of emails.'));
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const answer = await new Promise((resolve) => {
      rl.question('Do you want to stop the script or reuse proxies? (stop/reuse): ', (answer) => {
        rl.close();
        resolve(answer.toLowerCase());
      });
    });

    if (answer === 'stop') {
      console.log(chalk.red('Stopping script.'));
      return;
    }
  }

  const accountData = [];

  for (let i = 0; i < emails.length; i++) {
    const email = emails[i];
    if (!isValidEmail(email)) {
      console.log(chalk.red('Invalid email format:', email));
      continue; // Skip invalid emails
    }
    const proxy = useProxy ? proxies[i % proxies.length] : null;
    const account = await registerUser(email, password, proxy);
    if (account) {
      accountData.push(`${account.email},${account.password}`);
    }
    await delay(config.delay);
  }

  fs.writeFileSync('account.txt', accountData.join('\n'), 'utf8');
  console.log(chalk.green('Account data saved to account.txt'));
}

async function main() {
  displayHeader();
  const useProxy = await askUseProxy();
  const password = await askPassword();
  await readEmailsAndRegister(useProxy, password);
}

main();