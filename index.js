
const readline = require('readline');
const fs = require('fs');
const os = require('os');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question(`Welcome To Digikull Bank, Please select one of the options from the list${os.EOL} 
1 - Open Account
2 - Close Account
3 - Deposit Money
4 - Withdraw Money${os.EOL}`, function (input) {
  switch (Number(input)) {
    case 1:
      createAccount();
      break;
    case 2:
      deleteAccount();
      break;
    case 3:
      depositMoney();
      break;
    case 4:
      withdrawMoney();
      break;
    default:
      console.log('Invalid option. Please restart the program and choose a valid option.');
      rl.close();
      break;
  }
});

function createAccount() {
  rl.question(`What's your name? ${os.EOL}`, (name) => {
    rl.question(`Please provide your Aadhar Card ID? ${os.EOL}`, (aadharId) => {
      fs.writeFile(`accounts/${aadharId}.account`, `Name: ${name}${os.EOL}Balance: 0${os.EOL}Account Opening Date: ${new Date().toISOString()}`, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log('Account created successfully.');
        }
        rl.close();
      });
    });
  });
}

function deleteAccount() {
  rl.question(`Enter the Aadhar ID related to your bank account? ${os.EOL}`, (aadharId) => {
    fs.unlink(`accounts/${aadharId}.account`, (err) => {
      if (err) {
        console.log("Account not found, please re-enter the Aadhar ID.");
        deleteAccount();
      } else {
        console.log('Account closed, thanks for doing business with us.');
        rl.close();
      }
    });
  });
}

function depositMoney() {
  rl.question(`What's your Aadhar ID? ${os.EOL}`, (aadharId) => {
    fs.readFile(`accounts/${aadharId}.account`, 'utf8', (err, data) => {
      if (err) {
        console.log("Account not found, please re-enter the Aadhar ID.");
        depositMoney();
      } else {
        rl.question(`How much amount do you want to deposit? ${os.EOL}`, (amount) => {
          const balance = getBalance(data);
          const newBalance = balance + Number(amount);
          const updatedData = updateBalance(data, newBalance);

          fs.writeFile(`accounts/${aadharId}.account`, updatedData, (err) => {
            if (err) {
              console.log(err);
            } else {
              console.log('Account credited successfully.');
            }
            rl.close();
          });
        });
      }
    });
  });
}

function withdrawMoney() {
  rl.question(`What's your Aadhar ID? ${os.EOL}`, (aadharId) => {
    fs.readFile(`accounts/${aadharId}.account`, 'utf8', (err, data) => {
      if (err) {
        console.log("Account not found, please re-enter the Aadhar ID.");
        withdrawMoney();
      } else {
        rl.question(`How much amount do you want to withdraw? ${os.EOL}`, (amount) => {
          const balance = getBalance(data);
          const newBalance = balance - Number(amount);

          if (newBalance < 0) {
            console.log('Insufficient funds. Please enter a valid amount.');
            withdrawMoney();
          } else {
            const updatedData = updateBalance(data, newBalance);

            fs.writeFile(`accounts/${aadharId}.account`, updatedData, (err) => {
              if (err) {
                console.log(err);
              } else {
                console.log('Amount withdrawn successfully.');
              }
              rl.close();
            });
          }
        });
      }
    });
  });
}

function getBalance(data) {
  const match = data.match(/Balance: (\d+)/);
  return match ? Number(match[1]) : 0;
}

function updateBalance(data, newBalance) {
  return data.replace(/Balance: \d+/, `Balance: ${newBalance}`);
}
