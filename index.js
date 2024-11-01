const fs = require('fs');
const axios = require('axios');
const chalk = require('chalk');
const config = require('./config');

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

async function registerUser(email) {
  try {
    const response = await axios.post(regurl, {
      email: email,
      password: config.password,
      data: { invited_by: config.reff },
      gotrue_meta_security: {},
      code_challenge: null,
      code_challenge_method: null
    }, {
      headers: {
        'Authorization': AUTH,
        'apikey': API_KEY
      }
    });

    console.log(chalk.green('successfully register, please confirm your email :', email));
  } catch (error) {
    console.error(chalk.red('Error during register for', email));
  }
}

async function readEmailsAndRegister() {
  fs.readFile('email.txt', 'utf8', async (err, data) => {
    if (err) {
      console.error(chalk.red('Error reading email file:', err));
      return;
    }

    const emails = data.split('\n').filter(email => email.trim() !== '');
    for (const email of emails) {
      await registerUser(email.trim());
      await delay(config.delay);
    }
  });
}

displayWelcome();

readEmailsAndRegister();
