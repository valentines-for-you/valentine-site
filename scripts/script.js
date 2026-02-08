const valentine_button = document.getElementById("valentinesBtn");
const message = document.getElementById("message");
const photosBtn = document.getElementById("photoBtn");
const photoSection = document.getElementById("photo-section");
const body = document.getElementById("body");
const paragraphBtn = document.getElementById("paragraphBtn");
const yBtn = document.getElementById("Ybtn");
const nBtn = document.getElementById("Nbtn");
const noWrap = document.getElementById("no-wrapper");
const html = document.getElementById("html");
const animatedDiv = document.getElementById("animatedDiv");
const paragraph = document.getElementById("paragraph");
const messageDiv = document.getElementById("messageDiv");
const buttons = document.querySelectorAll(".heart-button");

checkBool = false;
zoomed = false;
paraBool = false;
let og_dx = -1;
let og_dy = -1;
const started = false;

nBtn.addEventListener("click", () => {
    nBtn.style.position = "fixed";
    nBtn.textContent = " Whaaa";
    const maxX = window.innerWidth - nBtn.offsetWidth;
    const maxY = window.innerHeight - nBtn.offsetHeight;

    const randX = Math.random() * maxX;
    const randY = Math.random() * maxY;

    console.log(randX);
    console.log(randY);

    nBtn.style.left = `${randX}px`;
    nBtn.style.top = `${randY}px`;
});

valentine_button.addEventListener("click", () => {
    message.classList.remove("hidden");
    yBtn.removeAttribute("hidden");
    nBtn.removeAttribute("hidden");

    const rect = nBtn.getBoundingClientRect();
    nBtn.style.left = `${rect.left}px`;
    nBtn.style.top = `${rect.top}px`;
});

yBtn.addEventListener("click", () => {
    const defaults = {
        spread: 360,
        ticks: 100,
        gravity: 0,
        decay: 0.94,
        startVelocity: 30,
        shapes: ["heart"],
        colors: ["FFC0CB", "FF69B4", "FF1493", "C71585"],
    };

    confetti({
        ...defaults,
        particleCount: 100,
        scalar: 2,
    });

    confetti({
        ...defaults,
        particleCount: 50,
        scalar: 3,
    });

    confetti({
        ...defaults,
        particleCount: 20,
        scalar: 4,
    });
});

photosBtn.addEventListener("click", (e) => {
    startFadeOut("animatedDiv");
    alter_section(e);
});

paragraphBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    messageDiv.style.display = "block";
    paragraph.classList.remove("hidden");

    const rect = messageDiv.getBoundingClientRect();
    const currentCenterX = rect.left + rect.width / 2;
    const currentCenterY = rect.right + rect.height / 2;

    const screenCenterX = window.innerWidth / 2;
    const screenCenterY = window.innerHeight / 2;

    const dx = screenCenterX - currentCenterX;
    const dy = screenCenterY - currentCenterY;

    messageDiv.style.transform = `translate(${-dx}px, ${-dy}px)`;
    messageDiv.offsetHeight;

    message.classList.add("move-to-center");
    messageDiv.style.transform = "translate(0px, 0px)";

    startFadeOut("animatedDiv");
    startFadeOut("photo-section");

    photoSection.hidden = true;
    animatedDiv.hidden = true;
    startFadeIn("messageDiv");
    paraBool = true;
});

buttons.forEach((button) => {
    let interval;
    button.addEventListener("mouseenter", () => {
        interval = setInterval(() => {
            if (!checkBool) {
                if (button.getAttribute("id") != "Nbtn") {
                    spawnHeart(button, "❤️");
                } else {
                    spawnHeart(button, "X");
                }
            }
        }, 60);
    });
    photosBtn.addEventListener("click", () => {
        clearInterval(interval);
    });
    button.addEventListener("mouseleave", () => {
        clearInterval(interval);
    });
});

body.addEventListener("click", () => {
    if (zoomed) {
        zoomed = false;
        const section = document.getElementById("photo-section");
        if (section.classList.contains("zoom")) {
            section.classList.remove("zoom");
            section.style.setProperty("--x", `${og_dx / 2}px`);
            section.style.setProperty("--y", `${og_dy / 2}px`);
            section.classList.add("unzoom");
            html.style.overflow = "hidden";
        }
        startFadeIn("animatedDiv");
    }

    if (paraBool) {
        console.log("made here");
        paraBool = false;
        photoSection.hidden = false;
        animatedDiv.hidden = false;
        messageDiv.classList.add("hidden");
        paragraph.classList.add("hidden");
        messageDiv.style.display = "none";

        startFadeOut("messageDiv");
        startFadeIn("animatedDiv");
        startFadeIn("photo-section");
    }
});

function spawnHeart(button, icon, bool) {
    const heart = document.createElement("div");
    heart.classList.add("heart");
    heart.textContent = icon; // or 🌸

    const rect = button.getBoundingClientRect();

    // Button center
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Random spawn point INSIDE button
    const spawnX = rect.left + Math.random() * rect.width;
    const spawnY = rect.top + Math.random() * rect.height;

    heart.style.left = `${spawnX}px`;
    heart.style.top = `${spawnY}px`;

    // Direction vector: center -> spawn
    let dx = spawnX - centerX;
    let dy = spawnY - centerY;

    // Normalize vector (make length = 1)
    const length = Math.sqrt(dx * dx + dy * dy) || 1;
    dx /= length;
    dy /= length;

    // Distance to move outward
    const MIN_DIST = 20;
    const MAX_EXT = 120;

    const distance = MIN_DIST + Math.random() * MAX_EXT;

    // Final movement (always outward, but random magnitude)
    const wobble = 20;
    const moveX = dx * distance + (Math.random() - 0.5) * wobble;
    const moveY = dy * distance + (Math.random() - 0.5) * wobble;

    heart.style.setProperty("--x", `${moveX}px`);
    heart.style.setProperty("--y", `${moveY}px`);
    // Optional polish
    heart.style.fontSize = `${12 + Math.random() * 12}px`;
    heart.style.color = `hsl(${Math.random() * 360}, 70%, 75%)`;
    heart.style.animationDelay = `-${Math.random() * 0.1}s`;

    document.body.appendChild(heart);

    heart.addEventListener("animationend", () => {
        heart.remove();
    });
}

function alter_section(e) {
    e.stopPropagation();
    const section = document.getElementById("photo-section");

    if (section.classList.contains("unzoom")) {
        section.classList.remove("unzoom");
    }

    const rect = section.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const screen_center_x = screen.width / 2;
    const screen_center_y = screen.height / 2;

    const dx = screen_center_x - centerX;
    const dy = screen_center_y - centerY;

    og_dx = -dx;
    og_dy = -dy;

    section.style.setProperty("--x", `${dx}px`);
    section.style.setProperty("--y", `${dy - 65}px`);
    section.classList.add("zoom");
    html.style.overflow = "visible";
    zoomed = true;
}

function startFadeOut(id) {
    const element = document.getElementById(id);
    if (element.classList.contains("fade-in-animation")) {
        element.classList.remove("fade-in-animation");
    }
    element.classList.add("fade-out-animation");
    checkBool = true;
}

function startFadeIn(id) {
    const element = document.getElementById(id);

    if (element.classList.contains("fade-out-animation")) {
        element.classList.remove("fade-out-animation");
    }
    element.classList.add("fade-in-animation");
    checkBool = false;
}
