// Telegram
console.log("Start telegram");
// Initialize Telegram Web App
Telegram.WebApp.ready();

// Get User Data
const initData = Telegram.WebApp.initDataUnsafe;
const userData = initData.user;

async function sendUserDataToServer(unityInstance) {
    if (!userData) {
        console.log("User data not available.");
        document.getElementById("login-button").style = "display:block";
    } else {
        const response = await fetch(`${host}/api/auth/login/telegram`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id: userData.id,
                username: userData.username ?? userData.first_name,
                is_bot: userData.is_bot ?? false,
                is_premium: userData.is_premium ?? false,
                allows_write_to_pm: userData.allows_write_to_pm,
                photo_url: userData.photo_url ?? "",
            }),
        });

        const result = await response.json();
        console.log("=======");
        console.log(result);
        console.log("=======");
        if (response.success) {
            console.log("Connected successfully!");
        } else {
            console.log("Connection failed: " + result.message);
        }
        token = result.token;
        unityInstance.SendMessage("APIClient", "SetUri", host);
        unityInstance.SendMessage("APIClient", "SetToken", "Bearer " + result.token);
        unityInstance.SendMessage("APIClient", "Initialize");
    }
}

const telegramLogin = async() => {
    alert("login")
};

window.sendUserDataToServer = sendUserDataToServer;
window.telegramLogin = telegramLogin;
