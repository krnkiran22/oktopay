import { useState, useEffect } from "react";
import { useOkto, getAccount, getPortfolio } from "@okto_web3/react-sdk";
import { GoogleLogin } from "@react-oauth/google";
import HomePage from "./components/HomePage"; // Adjust the import path as needed

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

function App() {
    const oktoClient = useOkto();
    const [isLoading, setIsLoading] = useState(false);
    const [showAuth, setShowAuth] = useState(false);
    const [accounts, setAccounts] = useState<Wallet[]>([]);
    const [portfolio, setPortfolio] = useState<UserPortfolioData | null>(null);

    async function handleGoogleLogin(credentialResponse: any) {
        try {
            setIsLoading(true);
            await oktoClient.loginUsingOAuth({
                idToken: credentialResponse.credential,
                provider: "google",
            });
            // Fetch user data after successful login
        } catch (error) {
            console.error("Authentication error:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleGetStarted = () => {
        setShowAuth(true);
    };

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

    return (
        <div>
            {!showAuth ? (
                // Landing Page
                <div style={{ textAlign: "center", marginTop: "50px" }}>
                    <h1>Welcome to SecurePay</h1>
                    <p>This is a website where you can securely transfer your funds to another person.</p>
                    <button
                        onClick={handleGetStarted}
                        style={{ padding: "10px 20px", fontSize: "16px" }}
                    >
                        Get Started
                    </button>
                </div>
            ) : isLoading ? (
                // Loading State
                <div>Loading...</div>
            ) : oktoClient.userSWA ? (
                // Home Page after Authentication
                <HomePage accounts={accounts} portfolio={portfolio} />
            ) : (
                // Google OAuth Button
                <GoogleLogin onSuccess={handleGoogleLogin} />
            )}
        </div>
    );
}

export default App;