# Teneo Account Creator

## Description
Teneo Account Creator is a simple tool designed to automate the creation of accounts on Teneo using a list of email addresses.

## Features
- **Automated Account Creation**: Register multiple accounts using a list of email addresses.

## Prerequisites
- [Node.js](https://nodejs.org/) (version 12 or higher)

## Installation

1. Clone the repository to your local machine:
   ```bash
	git clone https://github.com/recitativonika/teneo-account-creator.git
   ```
2. Navigate to the project directory:
	```bash
	cd teneo-account-creator
	```
3. Install the necessary dependencies:
	```bash
	npm install
	```

## Usage

1. Prepare a `email.txt` file in the project directory containing the email addresses you wish to register (one per line) and set the `config.js` before running the script.
2. Configuration
Modify the config.js file to set your account parameters:
	```
	reff: refferal code
	password: The password for the new accounts.
	delay: The delay in milliseconds between account creation requests.
	```
3. Run the account creator script:
	```bash
	node index.js
	```

# License
This project is licensed under the MIT License. See the LICENSE file for more details.

# Note
This script only for testing purpose, using this script might violates ToS and may get your account permanently banned.
