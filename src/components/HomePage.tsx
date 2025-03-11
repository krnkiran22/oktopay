import { useOkto } from "@okto_web3/react-sdk";
import { useState } from "react";
import { tokenTransfer, evmRawTransaction } from "@okto_web3/react-sdk"; // Assuming evmRawTransaction is available
import { encodeFunctionData } from "viem";

type Wallet = {
    caipId: string;
    networkName: string;
    address: string;
    caip2Id: string;
    networkSymbol: string;
};

type UserPortfolioData = {
    aggregatedData: {
        holdingsCount: string;
        holdingsPriceInr: string;
        holdingsPriceUsdt: string;
        totalHoldingPriceInr: string;
        totalHoldingPriceUsdt: string;
    };
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

type HomePageProps = {
    accounts: Wallet[];
    portfolio: UserPortfolioData | null;
};

const HomePage: React.FC<HomePageProps> = ({ accounts, portfolio }) => {
    const oktoClient = useOkto();
    const [contactName, setContactName] = useState("");
    const [contactWalletAddress, setContactWalletAddress] = useState("");
    const [status, setStatus] = useState("");

    async function handleTransfer() {
        try {
            const transferParams = {
                amount: BigInt("10000000000000000"),
                recipient: "0xC95380dc0277Ac927dB290234ff66880C4cdda8c" as `0x${string}`,
                token: "" as `0x${string}`, // Empty string for native token
                caip2Id: "eip155:84532", // Polygon Amoy Testnet chain ID
            };

            // Execute the transfer
            const jobId = await tokenTransfer(oktoClient, transferParams);
            setStatus(`Transfer jobId! Result: ${jobId}`);
            console.log(status);
        } catch (error: any) {
            console.error("Transfer failed:", error);
            setStatus(`Transfer failed: ${error.message}`);
        }
    }

    const handleAddContact = async () => {
        if (!contactName || !contactWalletAddress) {
            alert("Please fill in both name and wallet address fields.");
            return;
        }

        try {
            // 1. Define Contract Interaction
            const functionName = "setValue";
            const functionArgs = [123]; // Replace with actual arguments if needed

            // 2. Encode Function Data
            const functionData = encodeFunctionData({
                abi: [
                    {
                        name: functionName,
                        type: "function",
                        stateMutability: "nonpayable",
                        inputs: [{ type: "uint256", name: "_value" }],
                    },
                ],
                functionName,
                args: functionArgs,
            });

            // 3. Execute Transaction
            // const rawTxParams = {
            //     caip2Id: "eip155:1", // Replace with the correct chain ID if needed
            //     transaction: {
            //         from: accounts[0].address, // Use the first wallet address
            //         to: "0xcontractAddress", // Replace with the actual contract address
            //         data: functionData,
            //         value: BigInt(0), // Replace with the actual value if needed
            //     },
            // };

            // Execute the raw transaction
            const result = await evmRawTransaction(oktoClient,  {
                caip2Id: "eip155:1", // Replace with the correct chain ID if needed
                transaction: {
                    from: "" as `0x${string}`, // Use the first wallet address
                    to: "0xcontractAddress" as `0x${string}`, // Replace with the actual contract address
                    data: functionData,
                    value: BigInt(0), // Replace with the actual value if needed
                },
            });

            // Handle the result of the transaction
            console.log("Transaction Result:", result);
            alert(`Contact Added: ${contactName} - ${contactWalletAddress}`);
            setContactName("");
            setContactWalletAddress("");
        } catch (error) {
            console.error("Error executing transaction:", error);
            alert("Failed to add contact. Please try again.");
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Welcome to SecurePay</h1>
            <p>You are now logged in. Here's your profile and portfolio:</p>

            {/* Display Only One Wallet Address */}
            <h2>Your Wallet</h2>
            {accounts.length > 0 && (
                <div>
                    <p>Address: {accounts[0].address}</p>
                </div>
            )}

            {/* Display Portfolio Data */}
            <h2>Your Portfolio</h2>
            {portfolio && (
                <div>
                    <h3>Aggregated Data</h3>
                    <p>Total Holdings (USDT): {portfolio.aggregatedData.totalHoldingPriceUsdt}</p>

                    <h3>Token Details</h3>
                    {portfolio.groupTokens.map((group) => (
                        <div key={group.id}>
                            <h4>Network: {group.networkName}</h4>
                            <p>Balance: {group.balance}</p>
                            <p>Holdings (USDT): {group.holdingsPriceUsdt}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Send and Add Contact Buttons */}
            <div style={{ marginTop: "20px" }}>
                <button onClick={handleTransfer} style={{ marginRight: "10px" }}>
                    Send
                </button>

                <div style={{ marginTop: "10px" }}>
                    <input
                        type="text"
                        placeholder="Contact Name"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        style={{ marginRight: "10px" }}
                    />
                    <input
                        type="text"
                        placeholder="Wallet Address"
                        value={contactWalletAddress}
                        onChange={(e) => setContactWalletAddress(e.target.value)}
                        style={{ marginRight: "10px" }}
                    />
                    <button onClick={handleAddContact}>Add Contact</button>
                </div>
            </div>
        </div>
    );
};

export default HomePage;