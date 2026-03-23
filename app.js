const popup = document.querySelector(".popup"),
      wifiIcon = document.querySelector(".icon i"),
      popupTitle = document.querySelector(".popup .title"),
      popupDesc = document.querySelector(".desc"),
      reconnectBtn = document.querySelector(".reconnect");

let intervalId;
let timer = 10;
let isOnline = navigator.onLine; // use browser status

// Check Internet Connection
const checkConnection = async () => {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts");
        isOnline = response.status >= 200 && response.status < 300;
    } catch (error) {
        isOnline = false;
    }

    timer = 10;                 // reset timer
    clearInterval(intervalId);  // stop any running countdown
    handlePopup(isOnline);
};

// Handle Popup UI
const handlePopup = (status) => {
    clearInterval(intervalId); // prevent multiple intervals

    if (status) {
        wifiIcon.className = "uil uil-wifi";
        popupTitle.innerText = "Restored Connection";
        popupDesc.innerHTML = "Your device is now successfully connected to the Internet.";
        popup.classList.add("online", "show");

        // Hide popup after 2 seconds
        setTimeout(() => popup.classList.remove("show"), 2000);
        return;
    }

    // OFFLINE STATE
    wifiIcon.className = "uil uil-wifi-slash";
    popupTitle.innerText = "Lost Connection";
    popup.classList.remove("online");
    popup.classList.add("show");

    popupDesc.innerHTML =
        `Your network is unavailable. We will attempt to reconnect you in <b>${timer}</b> seconds.`;

    intervalId = setInterval(() => {
        if (timer > 0) {
            timer--;
            popup.querySelector(".desc b").innerText = timer;
        } else {
            clearInterval(intervalId);
            checkConnection();
        }
    }, 1000);
};

// Check once when page loads
window.addEventListener("load", checkConnection);

// Manual reconnect button
reconnectBtn.addEventListener("click", checkConnection);