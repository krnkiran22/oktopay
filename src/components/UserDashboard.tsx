import { useOkto, getAccount, getPortfolio  } from "@okto_web3/react-sdk"; 
import { useEffect, useState } from "react";

import { getPortfolioActivity ,tokenTransfer , getOrdersHistory } from "@okto_web3/react-sdk";

type Wallet = {
    caipId: string;
    networkName: string;
    address: string;
    caip2Id: string;
    networkSymbol: string;
};
type UserPortfolioData = {
    /**
     * Aggregated data of the user's holdings.
     */
    aggregatedData: {
        holdingsCount: string;
        holdingsPriceInr: string;
        holdingsPriceUsdt: string;
        totalHoldingPriceInr: string;
        totalHoldingPriceUsdt: string;
    };
    /**
     * Array of group tokens.
     */
    groupTokens: Array<{
        id: string;
        name: string;
        symbol: string;
        shortName: string;
        tokenImage: string;
        tokenAddress: string;
        groupId: string;
        caip2Id: string;
        precision: string;
        networkName: string;
        isPrimary: boolean;
        balance: string;
        holdingsPriceUsdt: string;
        holdingsPriceInr: string;
        aggregationType: string;
        /**
         * Array of tokens within the group.
         */
        tokens: Array<{
            id: string;
            name: string;
            symbol: string;
            shortName: string;
            tokenImage: string;
            tokenAddress: string;
            caip2Id: string;
            precision: string;
            networkName: string;
            isPrimary: boolean;
            balance: string;
            holdingsPriceUsdt: string;
            holdingsPriceInr: string;
        }>;
    }>;
};

export function UserDashboard() {
    const oktoClient = useOkto();
    const [accounts, setAccounts] = useState<Wallet []>([]);
     const [portfolio, setPortfolio] = useState<UserPortfolioData | null>(null);
     const [status, setStatus] = useState("");
 
    useEffect(() => {
        async function fetchUserData() { 
            // Get user's accounts/wallets
            const userAccounts = await getAccount(oktoClient); 
            setAccounts(userAccounts); 
 
            // Get user's portfolio
            const userPortfolio = await getPortfolio(oktoClient); 
            setPortfolio(userPortfolio); 
        }
 
        fetchUserData();
    }, []);

    async function handleTransfer() {
        try {
            const transferParams = { 
                amount: BigInt("10000000000000000"),
                recipient : "0xC95380dc0277Ac927dB290234ff66880C4cdda8c"  as `0x${string}`, 
                token: ""  as `0x${string}`, // Empty string for native token 
                caip2Id: "eip155:84532" // Polygon Amoy Testnet chain ID 
            };
 
            // Execute the transfer
            const jobId = await tokenTransfer(oktoClient, transferParams); 
            setStatus(`Transfer jobId! Result: ${jobId}`);
        } catch (error: any) {
            console.error("Transfer failed:", error);
            setStatus(`Transfer failed: ${error.message}`);
        }
    }
    
    async function fetchActivity() {
        try {
            const activity = await getPortfolioActivity(oktoClient);
            console.log('Portfolio activity:', activity);
        } catch (error) {
            console.error('Error fetching portfolio activity:', error);
        }
    }

    
    async function fetchOrderHistory() {
        try {
            const history = await getOrdersHistory(oktoClient);
            console.log('Order history:', history);
        } catch (error) {
            console.error('Error fetching order history:', error);
        }
    }

    return (
        <div>
            <h2>Welcome {oktoClient.userSWA}</h2>
            <h3>Your Accounts:</h3>
            {accounts.map(account => (
                <div key={account.caipId}>
                    <p>Network: {account.networkName}</p>
                    <p>Address: {account.address}</p>
                </div>
            ))}
 
            <h3>Portfolio:</h3>
            <pre>{JSON.stringify(portfolio, null, 2)}</pre>

            <div>
            <h2>Token Transfer</h2>
            <button onClick={handleTransfer}>
                Send 1 POL
            </button>
            <p>{status}</p>
        </div>
        <button onClick={fetchActivity}>
            Fetch Portfolio Activity
        </button>

        <button onClick={fetchOrderHistory}>
            Fetch Order History
        </button>
        </div>
    );
}