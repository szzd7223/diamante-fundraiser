const express = require('express');
const { Fundraiser } = require('./db/Fundraiser');
const bodyParser = require('body-parser');
const cors = require('cors');
const {
    Keypair,
    TransactionBuilder,
    Operation,
    Networks
} = require('diamante-base');
const { Horizon } = require('diamante-sdk-js');


const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

// mongoose.connect('mongodb+srv://USER_01:SSSS@cluster0.v3iwhye.mongodb.net/', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });

// const fundraiserSchema = new mongoose.Schema({
//     title: String,
//     description: String,
//     goal: Number,
//     condition: String,
//     publicKey: String,
//   });

// const Fundraiser = mongoose.model('Fundraiser', fundraiserSchema);

app.post('/create-keypair', (req, res) => {
    try {
        console.log('Received request to create keypair');
        const keypair = Keypair.random();
        console.log('Keypair created:', keypair.publicKey(), keypair.secret());
        res.json({
            publicKey: keypair.publicKey(),
            secret: keypair.secret()
        });
    } catch (error) {
        console.error('Error in create-keypair:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/store-fundraiser', async (req, res) => {
    const { title, description, goal, condition, publicKey } = req.body;
    const newFundraiser = new Fundraiser({ title, description, goal, condition, publicKey });
  
    try {
      await newFundraiser.save();
      res.json({ message: 'Fundraiser created successfully!' });
    } catch (error) {
      res.status(500).json({ message: 'Error creating fundraiser.' });
    }
  });

app.post('/fund-account', async (req, res) => {
    try {
        const { publicKey } = req.body;
        console.log(`Received request to fund account ${publicKey}`);
        const fetch = await import('node-fetch').then(mod => mod.default);
        const response = await fetch(`https://friendbot.diamcircle.io/?addr=${publicKey}`);
        if (!response.ok) {
            throw new Error(`Failed to activate account ${publicKey}: ${response.statusText}`);
        }
        const result = await response.json();
        console.log(`Account ${publicKey} activated`, result);
        res.json({ message: `Account ${publicKey} funded successfully` });
    } catch (error) {
        console.error('Error in fund-account:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/make-payment', async (req, res) => {
    try {
        const { senderSecret, receiverPublicKey, amount } = req.body;
        console.log(`Received request to make payment from ${senderSecret} to ${receiverPublicKey} with amount ${amount}`);

        const server = new Horizon.Server('https://diamtestnet.diamcircle.io/');
        const senderKeypair = Keypair.fromSecret(senderSecret);
        const senderPublicKey = senderKeypair.publicKey();

        const account = await server.loadAccount(senderPublicKey);
        const transaction = new TransactionBuilder(account, {
            fee: await server.fetchBaseFee(),
            networkPassphrase: Networks.TESTNET,
        })
            .addOperation(Operation.payment({
                destination: receiverPublicKey,
                asset: Asset.native(),
                amount: amount,
            }))
            .setTimeout(30)
            .build();

        transaction.sign(senderKeypair);
        const result = await server.submitTransaction(transaction);
        console.log(`Payment made from ${senderPublicKey} to ${receiverPublicKey} with amount ${amount}`, result);
        res.json({ message: `Payment of ${amount} DIAM made to ${receiverPublicKey} successfully` });
    } catch (error) {
        console.error('Error in make-payment:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/manage-data', async (req, res) => {
    try {
        const { senderSecret, key, value } = req.body;
        console.log(`Received request to manage data for key ${key} with value ${value}`);

        const server = new Horizon.Server('https://diamtestnet.diamcircle.io/');
        const senderKeypair = Keypair.fromSecret(senderSecret);
        const senderPublicKey = senderKeypair.publicKey();

        const account = await server.loadAccount(senderPublicKey);
        const transaction = new TransactionBuilder(account, {
            fee: await server.fetchBaseFee(),
            networkPassphrase: Networks.TESTNET,
        })
            .addOperation(Operation.manageData({
                name: key,
                value: value || null,
            }))
            .setTimeout(30)
            .build();

        transaction.sign(senderKeypair);
        const result = await server.submitTransaction(transaction);
        console.log(`Data managed for key ${key} with value ${value}`, result);
        res.json({ message: `Data for key ${key} managed successfully` });
    } catch (error) {
        console.error('Error in manage-data:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/set-options', async (req, res) => {
    try {
        const { senderSecret, inflationDest, homeDomain, lowThreshold, medThreshold, highThreshold } = req.body;
        console.log(`Received request to set options with inflationDest: ${inflationDest}, homeDomain: ${homeDomain}, thresholds: ${lowThreshold}, ${medThreshold}, ${highThreshold}`);

        const server = new Horizon.Server('https://diamtestnet.diamcircle.io/');
        const senderKeypair = Keypair.fromSecret(senderSecret);
        const senderPublicKey = senderKeypair.publicKey();

        const account = await server.loadAccount(senderPublicKey);
        const transaction = new TransactionBuilder(account, {
            fee: await server.fetchBaseFee(),
            networkPassphrase: Networks.TESTNET,
        })
            .addOperation(Operation.setOptions({
                inflationDest: inflationDest || undefined,
                homeDomain: homeDomain || undefined,
                lowThreshold: lowThreshold ? parseInt(lowThreshold) : undefined,
                medThreshold: medThreshold ? parseInt(medThreshold) : undefined,
                highThreshold: highThreshold ? parseInt(highThreshold) : undefined,
            }))
            .setTimeout(30)
            .build();

        transaction.sign(senderKeypair);
        const result = await server.submitTransaction(transaction);
        console.log('Options set successfully:', result);
        res.json({ message: 'Options set successfully' });
    } catch (error) {
        console.error('Error in set-options:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/create-claimable-balance', async (req, res) => {
    try {
        const { senderSecret, amount, claimantPublicKey, predicateType, predicateTime } = req.body;
        console.log(`Received request to create claimable balance from ${senderSecret} to ${claimantPublicKey} with amount ${amount}`);

        const server = new Horizon.Server('https://diamtestnet.diamcircle.io/');
        const senderKeypair = Keypair.fromSecret(senderSecret);
        const senderPublicKey = senderKeypair.publicKey();

        const account = await server.loadAccount(senderPublicKey);
        const transaction = new TransactionBuilder(account, {
            fee: await server.fetchBaseFee(),
            networkPassphrase: Networks.TESTNET,
        });

        // Create the claim predicate based on the type
        let claimPredicate;
        if (predicateType === "unconditional") {
            claimPredicate = Operation.claimPredicate.unconditional();
        } else if (predicateType === "before_relative_time") {
            claimPredicate = Operation.claimPredicate.beforeRelativeTime(predicateTime);
        } else if (predicateType === "before_absolute_time") {
            claimPredicate = Operation.claimPredicate.beforeAbsoluteTime(predicateTime);
        } else {
            throw new Error("Invalid predicate type");
        }

        transaction.addOperation(Operation.createClaimableBalance({
            asset: Asset.native(),
            amount: amount,
            claimants: [
                {
                    destination: claimantPublicKey,
                    predicate: claimPredicate,
                },
            ],
        }));

        transaction.setTimeout(30).build();
        transaction.sign(senderKeypair);
        const result = await server.submitTransaction(transaction);
        console.log(`Claimable balance created successfully:`, result);
        res.json({ message: `Claimable balance created successfully`, result });
    } catch (error) {
        console.error('Error in create-claimable-balance:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/claim-claimable-balance', async (req, res) => {
    try {
        const { claimantSecret, claimableBalanceID } = req.body;
        console.log(`Received request to claim claimable balance ${claimableBalanceID} using secret ${claimantSecret}`);

        const server = new Horizon.Server('https://diamtestnet.diamcircle.io/');
        const claimantKeypair = Keypair.fromSecret(claimantSecret);
        const claimantPublicKey = claimantKeypair.publicKey();

        const transaction = new TransactionBuilder(await server.loadAccount(claimantPublicKey), {
            fee: await server.fetchBaseFee(),
            networkPassphrase: Networks.TESTNET,
        })
            .addOperation(Operation.claimClaimableBalance({
                balanceId: claimableBalanceID,
            }))
            .setTimeout(30)
            .build();

        transaction.sign(claimantKeypair);
        const result = await server.submitTransaction(transaction);
        console.log(`Claimable balance claimed successfully:`, result);
        res.json({ message: `Claimable balance claimed successfully`, result });
    } catch (error) {
        console.error('Error in claim-claimable-balance:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Diamante backend listening at http://localhost:${port}`);
});
