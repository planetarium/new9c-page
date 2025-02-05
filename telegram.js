// Telegram
console.log("Start telegram");
// Initialize Telegram Web App
Telegram.WebApp.ready();

// Get User Data
const initData = Telegram.WebApp.initDataUnsafe;
let userData = initData.user;

const checkTelegramData = () => {
    if (!userData) {
        console.log("User data not available.");
        document.getElementById("modal").style.visibility = "visible";
        return false;
    }

};

const onTelegramLogin = async (user) => {
    const resp = await fetch(`${host}/api/auth/validate-telegram`,
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({user}),
        }
        );
    if (resp.status === 200 && (await resp.json()).valid === true) {
        user.is_bot = false;
        user.is_premium = false;
        user.allows_write_to_pm =false;
        userData = user;
        document.getElementById("modal").style.visibility = "hidden";
        initUnity();
    }
}

async function telegramLogin(unityInstance) {
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
    unityInstance.SendMessage("APIClient", "SetToken", "Bearer " + result.token);
    unityInstance.SendMessage("APIClient", "SetUri", host);
}

window.onTelegramLogin = onTelegramLogin;
window.telegramLogin = telegramLogin;
