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
4. Install the necessary dependencies:
   ```bash
   npm install
   ```

## Usage

1. Prepare a `email.txt` file in the project directory containing the email addresses that you wish to register (one per line), it should look like this:
	```bash
 	email1
 	email2
 	email3
 	```
2. Configuration
 	- Modify `proxy.txt` if you want to use proxy with this format
	```bash
   	proxy1
   	proxy2
   	proxy3
	```
	- Modify the `config.js` file to set your configurations
	
4. Run the account creator script:
	```bash
	node index.js
	```

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Note
This script only for testing purpose, using this script might violates ToS and may get your account permanently banned.
